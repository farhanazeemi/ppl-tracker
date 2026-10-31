import {
  SubstitutionExercise,
  MatchingWeights,
  FilterOptions,
  SubstitutionMatchResult,
  RecommendationLabel,
  MovementPattern,
  EquipmentCategory
} from '../../types/substitution';
import {
  CANONICAL_EXERCISE_DATABASE,
  findCanonicalExercise
} from './exerciseRepository';

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  primaryMuscle: 0.30,
  movementPattern: 0.25,
  equipment: 0.20,
  secondaryMuscle: 0.15,
  exerciseType: 0.10,
  goalBonus: 0.05
};

// Movement pattern kinship matrix for partial credit
const RELATED_PATTERNS: Record<MovementPattern, MovementPattern[]> = {
  'Vertical Pull': ['Horizontal Pull'],
  'Horizontal Pull': ['Vertical Pull'],
  'Horizontal Push': ['Vertical Push'],
  'Vertical Push': ['Horizontal Push'],
  'Squat': ['Lunge', 'Knee Extension'],
  'Lunge': ['Squat', 'Knee Extension'],
  'Knee Extension': ['Squat', 'Lunge'],
  'Hip Hinge': ['Knee Flexion'],
  'Knee Flexion': ['Hip Hinge'],
  'Hip Abduction': [],
  'Hip Adduction': [],
  'Shoulder Isolation': ['Vertical Push', 'Horizontal Pull'],
  'Arm Isolation': [],
  'Core Flexion': ['Core Anti-Extension'],
  'Core Anti-Extension': ['Core Flexion'],
  'Core Anti-Rotation': ['Core Anti-Extension'],
  'Calf Isolation': [],
  'Carry': []
};

/**
 * Calculate Jaccard similarity coefficient between two string arrays
 */
function calculateSetOverlap<T extends string>(setA: T[], setB: T[]): number {
  if (setA.length === 0 || setB.length === 0) return 0;
  const setBSet = new Set(setB);
  const intersection = setA.filter((item) => setBSet.has(item));
  const union = new Set([...setA, ...setB]);
  return intersection.length / union.size;
}

/**
 * Check if candidate exercise can be performed with available equipment
 */
export function isEquipmentCompatible(
  exerciseEquipment: EquipmentCategory[],
  availableEquipment: EquipmentCategory[]
): boolean {
  if (!availableEquipment || availableEquipment.length === 0) {
    return true; // Any equipment allowed
  }
  // Check if at least one equipment category required by the exercise is available
  // Special case: if exercise requires bench + dumbbell, but user has dumbbell, dumbbells can often be floor pressed or seated
  return exerciseEquipment.some((eq) => availableEquipment.includes(eq));
}

/**
 * Generate biomechanically accurate explanations for why an exercise is recommended
 */
export function generateWhyRecommended(
  source: SubstitutionExercise,
  candidate: SubstitutionExercise
): string[] {
  const reasons: string[] = [];

  // Movement pattern
  if (source.movementPattern === candidate.movementPattern) {
    reasons.push(
      `Exact movement pattern match (${source.movementPattern}): preserves identical joint kinematics and lines of force.`
    );
  } else if (RELATED_PATTERNS[source.movementPattern]?.includes(candidate.movementPattern)) {
    reasons.push(
      `Complementary ${candidate.movementPattern} mechanics: stimulates target muscles along an adjacent functional plane.`
    );
  }

  // Primary muscles
  const sharedPrimary = source.primaryMuscles.filter((m) => candidate.primaryMuscles.includes(m));
  if (sharedPrimary.length > 0) {
    reasons.push(
      `Directly overloads primary target (${sharedPrimary.join(', ')}), ensuring intended training stimulus is preserved.`
    );
  }

  // Secondary muscles
  const sharedSecondary = source.secondaryMuscles.filter(
    (m) => candidate.secondaryMuscles.includes(m) || candidate.primaryMuscles.includes(m)
  );
  if (sharedSecondary.length > 0) {
    reasons.push(
      `Synergistic support across ${sharedSecondary.slice(0, 2).join(' & ')} maintains multi-joint motor coordination.`
    );
  }

  // Equipment shift context
  const sourceEq = source.equipment.join('/');
  const candEq = candidate.equipment.join('/');
  if (sourceEq !== candEq) {
    reasons.push(
      `Replaces ${sourceEq} with accessible ${candEq} equipment without sacrificing training stimulus.`
    );
  }

  // Stretch / hypertrophy emphasis
  if (candidate.biomechanics.stretchEmphasis) {
    reasons.push(
      `Provides strong lengthened-position tension for maximum mechanical muscle damage and hypertrophy signaling.`
    );
  }

  return reasons.slice(0, 4);
}

/**
 * Generate key biomechanical and practical differences between source and candidate
 */
export function generateKeyDifferences(
  source: SubstitutionExercise,
  candidate: SubstitutionExercise
): string[] {
  const differences: string[] = [];

  // Stabilization demands
  if (source.biomechanics.stabilizationDemand !== candidate.biomechanics.stabilizationDemand) {
    differences.push(
      `Stabilization: ${candidate.name} requires ${candidate.biomechanics.stabilizationDemand} bodily stabilization, whereas ${source.name} requires ${source.biomechanics.stabilizationDemand} stabilization.`
    );
  }

  // Joint stress / spinal loading
  if (source.biomechanics.jointStressProfile !== candidate.biomechanics.jointStressProfile) {
    differences.push(
      `Joint & Spine Stress: ${candidate.biomechanics.jointStressProfile}`
    );
  }

  // Resistance curve
  if (source.biomechanics.resistanceProfile !== candidate.biomechanics.resistanceProfile) {
    differences.push(
      `Resistance Profile: ${candidate.biomechanics.resistanceProfile}`
    );
  }

  // Exercise mechanics (compound vs isolation)
  if (source.exerciseType !== candidate.exerciseType) {
    if (candidate.exerciseType === 'isolation') {
      differences.push(
        `Kinematic Shift: ${candidate.name} is a single-joint isolation movement that eliminates secondary muscle assistance.`
      );
    } else {
      differences.push(
        `Kinematic Shift: ${candidate.name} is a multi-joint compound movement requiring greater systemic neuromuscular engagement.`
      );
    }
  }

  // Equipment specific note
  if (candidate.equipment.includes('bodyweight') && !source.equipment.includes('bodyweight')) {
    differences.push(
      `Resistance Scaling: Bodyweight resistance cannot be incremented in small plate increments; progress by varying leverage or adding reps.`
    );
  } else if (candidate.equipment.includes('bands') && !source.equipment.includes('bands')) {
    differences.push(
      `Elastic Curve: Tension increases non-linearly as the band stretches, peaking at terminal contraction rather than in the deep stretch.`
    );
  }

  return differences.slice(0, 4);
}

/**
 * Assign semantic recommendation labels
 */
export function determineRecommendationLabels(
  source: SubstitutionExercise,
  candidate: SubstitutionExercise,
  score: number,
  filterOptions?: FilterOptions
): RecommendationLabel[] {
  const labels: RecommendationLabel[] = [];

  const isExactPattern = source.movementPattern === candidate.movementPattern;
  const isPrimaryMatch = source.primaryMuscles.some((m) => candidate.primaryMuscles.includes(m));
  const isBodyweightOrBand =
    candidate.equipment.includes('bodyweight') || candidate.equipment.includes('bands');

  if (score >= 85 && isExactPattern && isPrimaryMatch) {
    labels.push('Best Match');
  } else if (isExactPattern) {
    labels.push('Similar Movement');
  }

  if (isPrimaryMatch && !labels.includes('Best Match')) {
    labels.push('Same Primary Muscle');
  }

  if (
    !source.equipment.some((eq) => candidate.equipment.includes(eq)) &&
    score >= 60
  ) {
    labels.push('Equipment Alternative');
  }

  if (
    isBodyweightOrBand ||
    filterOptions?.trainingGoal === 'home_workout'
  ) {
    labels.push('Home Workout Option');
  }

  return labels.slice(0, 3);
}

/**
 * Main Deterministic Matching Algorithm
 */
export function findExerciseSubstitutes(
  sourceExercise: SubstitutionExercise,
  filterOptions: FilterOptions = { availableEquipment: [] },
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS,
  exerciseDatabase: SubstitutionExercise[] = CANONICAL_EXERCISE_DATABASE
): SubstitutionMatchResult[] {
  const results: SubstitutionMatchResult[] = [];

  const {
    availableEquipment = [],
    trainingGoal,
    targetMuscle = 'all',
    movementPattern = 'all',
    difficulty = 'all',
    exerciseType = 'all',
    searchQuery = ''
  } = filterOptions;

  const sanitizedQuery = searchQuery.trim().toLowerCase();

  for (const candidate of exerciseDatabase) {
    // 1. Exclude original exercise
    if (candidate.id === sourceExercise.id) {
      continue;
    }

    // 2. Strict Filter: Equipment check (when equipment filter is specified)
    if (availableEquipment.length > 0) {
      const isAllowed = candidate.equipment.some((eq) => availableEquipment.includes(eq));
      if (!isAllowed) {
        continue;
      }
    }

    // 3. Strict Filter: Target Muscle (if specified)
    if (targetMuscle !== 'all') {
      const hasMuscle =
        candidate.primaryMuscles.includes(targetMuscle) ||
        candidate.secondaryMuscles.includes(targetMuscle);
      if (!hasMuscle) continue;
    }

    // 4. Strict Filter: Movement Pattern (if specified)
    if (movementPattern !== 'all' && candidate.movementPattern !== movementPattern) {
      continue;
    }

    // 5. Strict Filter: Difficulty (if specified)
    if (difficulty !== 'all' && candidate.difficulty !== difficulty) {
      continue;
    }

    // 6. Strict Filter: Exercise Type (if specified)
    if (exerciseType !== 'all' && candidate.exerciseType !== exerciseType) {
      continue;
    }

    // 7. Search Query Filter (if specified)
    if (sanitizedQuery) {
      const matchName = candidate.name.toLowerCase().includes(sanitizedQuery);
      const matchAliases = candidate.aliases?.some((a) =>
        a.toLowerCase().includes(sanitizedQuery)
      );
      const matchMuscles = [...candidate.primaryMuscles, ...candidate.secondaryMuscles].some((m) =>
        m.toLowerCase().includes(sanitizedQuery)
      );
      if (!matchName && !matchAliases && !matchMuscles) {
        continue;
      }
    }

    // ==========================================
    // DETERMINISTIC SCORING ENGINE
    // ==========================================

    // A. Primary Muscle Overlap (Weight: 30%)
    let primaryMuscleScore = 0;
    const sharedPrimary = candidate.primaryMuscles.filter((m) =>
      sourceExercise.primaryMuscles.includes(m)
    );
    if (sharedPrimary.length > 0) {
      primaryMuscleScore =
        sharedPrimary.length /
        Math.max(sourceExercise.primaryMuscles.length, candidate.primaryMuscles.length);
      // Give full credit if primary muscle matches 100%
      if (primaryMuscleScore >= 0.5) primaryMuscleScore = 1.0;
    } else {
      // Check if candidate's primary matches source's secondary
      const primaryInSecondary = candidate.primaryMuscles.some((m) =>
        sourceExercise.secondaryMuscles.includes(m)
      );
      if (primaryInSecondary) {
        primaryMuscleScore = 0.4;
      }
    }

    // B. Movement Pattern Similarity (Weight: 25%)
    let movementPatternScore = 0;
    if (candidate.movementPattern === sourceExercise.movementPattern) {
      movementPatternScore = 1.0;
    } else if (
      RELATED_PATTERNS[sourceExercise.movementPattern]?.includes(candidate.movementPattern)
    ) {
      movementPatternScore = 0.45;
    } else {
      movementPatternScore = 0.05; // Different pattern penalty
    }

    // C. Equipment Compatibility (Weight: 20%)
    let equipmentScore = 0;
    if (availableEquipment.length > 0) {
      // User has specific gear, candidate fits
      equipmentScore = 1.0;
    } else {
      // User is on "Any Equipment" mode
      // If candidate uses a different equipment, it's often a prime substitute
      const sameEquipment = candidate.equipment.some((eq) =>
        sourceExercise.equipment.includes(eq)
      );
      equipmentScore = sameEquipment ? 0.9 : 1.0;
    }

    // D. Secondary Muscle Overlap (Weight: 15%)
    const secondaryOverlap = calculateSetOverlap(
      sourceExercise.secondaryMuscles,
      candidate.secondaryMuscles
    );
    const secondaryMuscleScore = secondaryOverlap;

    // E. Exercise Type Similarity (Weight: 10%)
    const exerciseTypeScore = candidate.exerciseType === sourceExercise.exerciseType ? 1.0 : 0.55;

    // F. Goal Alignment Bonus (Configurable Weight: 5%)
    let goalBonus = 0;
    if (trainingGoal === 'hypertrophy') {
      if (candidate.biomechanics.stretchEmphasis) goalBonus += 0.5;
      if (candidate.biomechanics.resistanceProfile.toLowerCase().includes('constant')) {
        goalBonus += 0.5;
      }
    } else if (trainingGoal === 'strength') {
      if (candidate.exerciseType === 'compound') goalBonus += 0.6;
      if (candidate.equipment.includes('barbell')) goalBonus += 0.4;
    } else if (trainingGoal === 'home_workout') {
      if (candidate.equipment.includes('bodyweight') || candidate.equipment.includes('bands')) {
        goalBonus += 1.0;
      } else if (candidate.equipment.includes('dumbbell')) {
        goalBonus += 0.7;
      }
    } else if (trainingGoal === 'general_fitness') {
      if (candidate.difficulty !== 'advanced') goalBonus += 0.8;
    }

    // Aggregate weighted score (Normalized to 0 - 100)
    const rawWeighted =
      primaryMuscleScore * weights.primaryMuscle +
      movementPatternScore * weights.movementPattern +
      equipmentScore * weights.equipment +
      secondaryMuscleScore * weights.secondaryMuscle +
      exerciseTypeScore * weights.exerciseType +
      goalBonus * weights.goalBonus;

    const finalScore = Math.min(100, Math.round(rawWeighted * 100));

    // Threshold: Only return candidates with reasonable compatibility (>= 40)
    if (finalScore >= 40) {
      let scoreLabel: SubstitutionMatchResult['scoreLabel'] = 'Moderate Alternative';
      if (finalScore >= 80) scoreLabel = 'High Compatibility';
      else if (finalScore >= 60) scoreLabel = 'Good Compatibility';

      const labels = determineRecommendationLabels(
        sourceExercise,
        candidate,
        finalScore,
        filterOptions
      );
      const whyRecommended = generateWhyRecommended(sourceExercise, candidate);
      const keyDifferences = generateKeyDifferences(sourceExercise, candidate);

      const equipmentMatch = candidate.equipment.some((eq) =>
        sourceExercise.equipment.includes(eq)
      )
        ? 'exact'
        : 'alternative';

      results.push({
        exercise: candidate,
        score: finalScore,
        scoreLabel,
        breakdown: {
          primaryMuscleScore: Math.round(primaryMuscleScore * 100),
          movementPatternScore: Math.round(movementPatternScore * 100),
          secondaryMuscleScore: Math.round(secondaryMuscleScore * 100),
          equipmentScore: Math.round(equipmentScore * 100),
          exerciseTypeScore: Math.round(exerciseTypeScore * 100),
          goalBonus: Math.round(goalBonus * 100)
        },
        labels,
        whyRecommended,
        keyDifferences,
        isExactMovement: candidate.movementPattern === sourceExercise.movementPattern,
        equipmentMatch
      });
    }
  }

  // Sort ranked results descending by score
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Utility: Look up an exercise by ID, slug, or name
 */
export function findExerciseByIdOrName(
  identifier: string,
  exerciseDatabase: SubstitutionExercise[] = CANONICAL_EXERCISE_DATABASE
): SubstitutionExercise | undefined {
  return findCanonicalExercise(identifier);
}
