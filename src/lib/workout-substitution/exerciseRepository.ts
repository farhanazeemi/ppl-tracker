import {
  WORKOUT_DAYS,
  BRO_SPLIT_DAYS,
  UPPER_LOWER_DAYS,
  FULL_BODY_DAYS
} from '../../data/workouts';
import { ExerciseDefinition } from '../../types/workout';
import {
  SubstitutionExercise,
  MovementPattern,
  EquipmentCategory,
  ExerciseDifficulty,
  ExerciseMechanics,
  ExerciseBiomechanics
} from '../../types/substitution';

/**
 * Normalizes an exercise name into a URL-friendly slug
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Deterministically infers movement pattern from exercise metadata
 */
function inferMovementPattern(ex: ExerciseDefinition): MovementPattern {
  const name = ex.name.toLowerCase();
  const target = (ex.target || '').toLowerCase();
  const cue = (ex.cue || '').toLowerCase();
  const muscle = ex.primaryMuscle;

  // 1. Vertical Pull
  if (
    name.includes('pulldown') ||
    name.includes('pull-up') ||
    name.includes('pullup') ||
    name.includes('chin-up') ||
    name.includes('chinup') ||
    name.includes('pullover')
  ) {
    return 'Vertical Pull';
  }

  // 2. Horizontal Pull
  if (name.includes('row') || name.includes('t-bar')) {
    return 'Horizontal Pull';
  }

  // 3. Face Pulls & Rear Delts / Deltoid Isolation
  if (
    name.includes('face pull') ||
    name.includes('facepull') ||
    name.includes('lateral raise') ||
    name.includes('side raise') ||
    name.includes('reverse pec deck') ||
    name.includes('rear delt') ||
    name.includes('shrug')
  ) {
    return 'Shoulder Isolation';
  }

  // 4. Horizontal Push
  if (
    name.includes('bench press') ||
    name.includes('chest press') ||
    name.includes('push-up') ||
    name.includes('pushup') ||
    name.includes('dips') ||
    name.includes('fly') ||
    name.includes('flyes') ||
    (name.includes('incline') && (target.includes('chest') || muscle.includes('Chest'))) ||
    (name.includes('flat') && (target.includes('chest') || muscle.includes('Chest')))
  ) {
    return 'Horizontal Push';
  }

  // 5. Vertical Push
  if (
    name.includes('overhead press') ||
    name.includes('shoulder press') ||
    name.includes('military') ||
    name.includes('ohp') ||
    name.includes('pike')
  ) {
    return 'Vertical Push';
  }

  // 6. Squat
  if (
    name.includes('squat') ||
    name.includes('leg press') ||
    name.includes('hack') ||
    name.includes('goblet')
  ) {
    return 'Squat';
  }

  // 7. Hip Hinge
  if (
    name.includes('deadlift') ||
    name.includes('rdl') ||
    name.includes('romanian') ||
    name.includes('hyperextension') ||
    name.includes('good morning')
  ) {
    return 'Hip Hinge';
  }

  // 8. Lunge
  if (name.includes('lunge') || name.includes('split squat') || name.includes('step-up')) {
    return 'Lunge';
  }

  // 9. Knee Extension
  if (name.includes('leg extension') || name.includes('sissy')) {
    return 'Knee Extension';
  }

  // 10. Knee Flexion
  if (name.includes('leg curl') || name.includes('hamstring curl')) {
    return 'Knee Flexion';
  }

  // 11. Calf Isolation
  if (name.includes('calf raise') || name.includes('calf') || muscle === 'Calves') {
    return 'Calf Isolation';
  }

  // 12. Arm Isolation
  if (
    muscle === 'Triceps' ||
    muscle === 'Biceps' ||
    muscle === 'Forearms' ||
    name.includes('curl') ||
    name.includes('pushdown') ||
    name.includes('extension') ||
    name.includes('skull') ||
    name.includes('kickback')
  ) {
    return 'Arm Isolation';
  }

  // 13. Core
  if (muscle === 'Abs' || name.includes('crunch') || name.includes('raise') || name.includes('rollout')) {
    return 'Core Flexion';
  }

  return 'Horizontal Push';
}

/**
 * Deterministically infers compound vs isolation mechanics
 */
function inferExerciseType(name: string, pattern: MovementPattern): ExerciseMechanics {
  const lower = name.toLowerCase();
  if (
    pattern === 'Shoulder Isolation' ||
    pattern === 'Arm Isolation' ||
    pattern === 'Knee Extension' ||
    pattern === 'Knee Flexion' ||
    pattern === 'Calf Isolation' ||
    pattern === 'Core Flexion' ||
    lower.includes('fly') ||
    lower.includes('flyes') ||
    lower.includes('shrug')
  ) {
    return 'isolation';
  }
  return 'compound';
}

/**
 * Infers difficulty level
 */
function inferDifficulty(name: string, equipment: string): ExerciseDifficulty {
  const lower = name.toLowerCase();
  if (
    lower.includes('back squat') ||
    lower.includes('deadlift') ||
    lower.includes('overhead press (ohp)') ||
    lower.includes('dips')
  ) {
    return 'advanced';
  }
  if (
    equipment === 'barbell' ||
    lower.includes('rdl') ||
    lower.includes('skullcrusher') ||
    lower.includes('bent-over')
  ) {
    return 'intermediate';
  }
  return 'beginner';
}

/**
 * Parses equipment tags from existing equipment field and exercise name
 */
function parseEquipmentCategories(ex: ExerciseDefinition): EquipmentCategory[] {
  const categories: Set<EquipmentCategory> = new Set();
  const baseEq = ex.equipment?.toLowerCase() || '';
  const name = ex.name.toLowerCase();

  if (baseEq === 'barbell') categories.add('barbell');
  if (baseEq === 'dumbbell') categories.add('dumbbell');
  if (baseEq === 'cable') categories.add('cable');
  if (baseEq === 'machine') categories.add('machine');
  if (baseEq === 'bodyweight') categories.add('bodyweight');

  // Check name tokens for dual-equipment options
  if (name.includes('machine') || name.includes('pec deck')) categories.add('machine');
  if (name.includes('dumbbell') || name.includes('db')) categories.add('dumbbell');
  if (name.includes('barbell') || name.includes('ez-bar')) categories.add('barbell');
  if (name.includes('cable') || name.includes('rope') || name.includes('pulley')) categories.add('cable');
  if (name.includes('smith')) categories.add('smith');
  if (name.includes('pull-up') || name.includes('chin-up') || name.includes('dips')) {
    categories.add('bodyweight');
    categories.add('pullup_bar');
  }
  if (name.includes('bench') || name.includes('press') || name.includes('incline') || name.includes('flat')) {
    if (!name.includes('leg press') && !name.includes('overhead')) {
      categories.add('bench');
    }
  }

  if (categories.size === 0) categories.add('machine');
  return Array.from(categories);
}

/**
 * Parses clean aliases from exercise title (e.g. removing parentheses)
 */
function extractAliases(name: string): string[] {
  const aliases: Set<string> = new Set();
  // Check for parenthetical alternative
  const parenMatch = name.match(/\((.*?)\)/);
  if (parenMatch && parenMatch[1]) {
    const rawAlt = parenMatch[1];
    // Split by 'or', '/', comma
    rawAlt.split(/or|\/|,/).forEach((part) => {
      const clean = part.replace(/^or\s+/i, '').trim();
      if (clean.length > 2) aliases.add(clean);
    });
  }

  // Base name without parentheses
  const baseName = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (baseName !== name) aliases.add(baseName);

  return Array.from(aliases);
}

/**
 * Derives structured instructions from cue and biomechanicsTip
 */
function deriveInstructions(ex: ExerciseDefinition): string[] {
  const steps: string[] = [];
  if (ex.cue) {
    const cueParts = ex.cue.split(/(?<=[.!?])\s+/);
    cueParts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.length > 10) steps.push(trimmed);
    });
  }
  if (ex.biomechanicsTip) {
    steps.push(`Biomechanical Optimization: ${ex.biomechanicsTip}`);
  }
  if (steps.length === 0) {
    steps.push(
      'Assume a stable posture, lock in core tension, and perform with full controlled active range of motion.'
    );
  }
  return steps;
}

/**
 * Derives biomechanics profile
 */
function deriveBiomechanics(ex: ExerciseDefinition, pattern: MovementPattern): ExerciseBiomechanics {
  const name = ex.name.toLowerCase();
  const tip = ex.biomechanicsTip || '';

  const isStretch =
    name.includes('incline') ||
    name.includes('fly') ||
    name.includes('pulldown') ||
    name.includes('rdl') ||
    name.includes('romanian') ||
    name.includes('overhead') ||
    name.includes('stretch') ||
    name.includes('curl');

  const stabilizationDemand: 'low' | 'moderate' | 'high' =
    ex.equipment === 'barbell' || pattern === 'Squat' || pattern === 'Hip Hinge'
      ? 'high'
      : ex.equipment === 'machine' || name.includes('seated')
      ? 'low'
      : 'moderate';

  let jointStress = 'Balanced joint loading across primary kinematic plane.';
  if (ex.equipment === 'machine') {
    jointStress = 'Guided track minimizes axial spinal sheer and stabilizer joint fatigue.';
  } else if (ex.equipment === 'cable') {
    jointStress = 'Continuous cable vector provides smooth rotational joint excursion without impact peaks.';
  } else if (name.includes('squat') || name.includes('deadlift')) {
    jointStress = 'Requires strong core bracing to support axial spinal compression under load.';
  }

  return {
    resistanceProfile: tip || 'Continuous tension matched to physiological muscle length-tension curve.',
    stabilizationDemand,
    stretchEmphasis: isStretch,
    jointStressProfile: jointStress
  };
}

/**
 * Builds the canonical exercise list by extracting and deduplicating
 * all exercises across WORKOUT_DAYS, BRO_SPLIT_DAYS, UPPER_LOWER_DAYS, and FULL_BODY_DAYS.
 */
function buildCanonicalExercisesFromWorkouts(): SubstitutionExercise[] {
  const allDays = [
    ...WORKOUT_DAYS,
    ...BRO_SPLIT_DAYS,
    ...UPPER_LOWER_DAYS,
    ...FULL_BODY_DAYS
  ];

  const uniqueExercisesMap = new Map<string, SubstitutionExercise>();

  for (const day of allDays) {
    for (const ex of day.exercises) {
      // Normalize name for deduplication key
      const normalizedKey = ex.name
        .toLowerCase()
        .replace(/\s*\(.*?\)\s*/g, '')
        .replace(/[^a-z0-9]/g, '');

      if (!uniqueExercisesMap.has(normalizedKey)) {
        const movementPattern = inferMovementPattern(ex);
        const exerciseType = inferExerciseType(ex.name, movementPattern);
        const difficulty = inferDifficulty(ex.name, ex.equipment);
        const equipment = parseEquipmentCategories(ex);
        const instructions = deriveInstructions(ex);
        const biomechanics = deriveBiomechanics(ex, movementPattern);
        const aliases = extractAliases(ex.name);

        const subExercise: SubstitutionExercise = {
          id: ex.id,
          name: ex.name,
          slug: slugify(ex.name),
          primaryMuscles: [ex.primaryMuscle],
          secondaryMuscles: ex.secondaryMuscles || [],
          movementPattern,
          equipment,
          exerciseType,
          difficulty,
          description: `Evidence-based ${movementPattern.toLowerCase()} exercise targeting the ${ex.primaryMuscle.toLowerCase()} with ${ex.equipment} mechanics.`,
          instructions,
          cues: [ex.cue],
          biomechanics,
          aliases,
          defaultSets: ex.sets || 3,
          defaultReps: ex.targetReps || '8–12',
          restSeconds: ex.restSeconds || 90
        };

        uniqueExercisesMap.set(normalizedKey, subExercise);
      } else {
        // If an alternate alias exists in another split variation, append it
        const existing = uniqueExercisesMap.get(normalizedKey)!;
        const newAliases = extractAliases(ex.name);
        newAliases.forEach((alias) => {
          if (!existing.aliases?.includes(alias) && alias !== existing.name) {
            existing.aliases = [...(existing.aliases || []), alias];
          }
        });
      }
    }
  }

  // Add foundational bodyweight/band movement variations to guarantee zero-equipment home alternatives
  const homeAndBandBaselines: SubstitutionExercise[] = [
    {
      id: 'bodyweight-push-up',
      name: 'Standard Bodyweight Push-Up',
      slug: 'standard-bodyweight-push-up',
      primaryMuscles: ['Mid Chest'],
      secondaryMuscles: ['Front Delts', 'Triceps', 'Abs'],
      movementPattern: 'Horizontal Push',
      equipment: ['bodyweight'],
      exerciseType: 'compound',
      difficulty: 'beginner',
      description: 'The premier bodyweight horizontal press building chest mass and anterior core stability.',
      instructions: [
        'Set hands slightly wider than shoulders in high plank.',
        'Brace core and lower chest to 1 inch above floor with elbows at 45°.',
        'Press floor away to full scapular reach.'
      ],
      cues: ['Keep body in a rigid straight line', 'Do not let hips sag', 'Push floor away at the top'],
      biomechanics: {
        resistanceProfile: 'Closed kinetic chain supporting ~64% of bodyweight.',
        stabilizationDemand: 'moderate',
        stretchEmphasis: false,
        jointStressProfile: 'Allows natural scapular motion without bench immobilization.'
      },
      aliases: ['Pushup', 'Push-Ups', 'Floor Push Up'],
      defaultSets: 3,
      defaultReps: '15–25',
      restSeconds: 60
    },
    {
      id: 'resistance-band-kneeling-pulldown',
      name: 'Resistance Band Kneeling Pulldown',
      slug: 'resistance-band-kneeling-pulldown',
      primaryMuscles: ['Lats'],
      secondaryMuscles: ['Upper Back', 'Biceps'],
      movementPattern: 'Vertical Pull',
      equipment: ['bands'],
      exerciseType: 'compound',
      difficulty: 'beginner',
      description: 'A home-friendly vertical pull using looped resistance bands anchored overhead.',
      instructions: [
        'Anchor looped resistance band overhead to door anchor or bar.',
        'Kneel facing anchor with arms stretched high.',
        'Pull elbows down and in toward ribcage against elastic band tension.'
      ],
      cues: ['Drive elbows into back pockets', 'Hold 1-second peak squeeze at bottom', 'Control ascent'],
      biomechanics: {
        resistanceProfile: 'Ascending elastic resistance peaking at full contraction.',
        stabilizationDemand: 'moderate',
        stretchEmphasis: false,
        jointStressProfile: 'Extremely gentle on shoulder capsule.'
      },
      aliases: ['Band Pulldown', 'Home Lat Pulldown'],
      defaultSets: 3,
      defaultReps: '15–20',
      restSeconds: 60
    },
    {
      id: 'resistance-band-chest-fly',
      name: 'Resistance Band Chest Fly',
      slug: 'resistance-band-chest-fly',
      primaryMuscles: ['Mid Chest'],
      secondaryMuscles: ['Front Delts'],
      movementPattern: 'Horizontal Push',
      equipment: ['bands'],
      exerciseType: 'isolation',
      difficulty: 'beginner',
      description: 'A portable chest isolation alternative utilizing elastic bands anchored at chest height.',
      instructions: [
        'Anchor band behind you at chest level and grasp ends with soft elbows.',
        'Bring hands together in front of sternum in a wide hugging arc.',
        'Squeeze pecs for 1 second at center before controlled return.'
      ],
      cues: ['Maintain fixed elbow bend', 'Focus on peak squeeze where band is tightest'],
      biomechanics: {
        resistanceProfile: 'Ascending tension curve peaking at full horizontal adduction.',
        stabilizationDemand: 'moderate',
        stretchEmphasis: false,
        jointStressProfile: 'Minimal stretch strain; safe for anterior shoulder capsule.'
      },
      aliases: ['Band Fly', 'Band Chest Fly'],
      defaultSets: 3,
      defaultReps: '15–20',
      restSeconds: 60
    },
    {
      id: 'bodyweight-squat-sissy',
      name: 'Bodyweight Sissy Squat',
      slug: 'bodyweight-sissy-squat',
      primaryMuscles: ['Quads'],
      secondaryMuscles: ['Calves', 'Abs'],
      movementPattern: 'Knee Extension',
      equipment: ['bodyweight'],
      exerciseType: 'isolation',
      difficulty: 'advanced',
      description: 'An intense knee-dominant bodyweight movement providing extreme eccentric stretch across the quads.',
      instructions: [
        'Hold sturdy post for balance support and rise onto balls of feet.',
        'Push knees forward while leaning torso backward in a straight line.',
        'Contract quads to drive knees back and return to standing.'
      ],
      cues: ['Keep straight line from knees to shoulders', 'Do not bend at hips'],
      biomechanics: {
        resistanceProfile: 'Long-lever knee extension moment arm; deep lengthened rectus femoris loading.',
        stabilizationDemand: 'high',
        stretchEmphasis: true,
        jointStressProfile: 'High patellar tendon demand; progress gradually.'
      },
      aliases: ['Sissy Squat', 'Matrix Squat'],
      defaultSets: 3,
      defaultReps: '10–12',
      restSeconds: 60
    }
  ];

  for (const item of homeAndBandBaselines) {
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!uniqueExercisesMap.has(key)) {
      uniqueExercisesMap.set(key, item);
    }
  }

  return Array.from(uniqueExercisesMap.values());
}

/**
 * The single canonical exercise database for PPL Tracker Workout Substitution
 */
export const CANONICAL_EXERCISE_DATABASE: SubstitutionExercise[] =
  buildCanonicalExercisesFromWorkouts();

/**
 * Returns all canonical exercises derived from WORKOUT_DAYS
 */
export function getCanonicalExercises(): SubstitutionExercise[] {
  return CANONICAL_EXERCISE_DATABASE;
}

/**
 * Finds a canonical exercise by ID, slug, name, or alias
 */
export function findCanonicalExercise(identifier: string): SubstitutionExercise | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  return CANONICAL_EXERCISE_DATABASE.find(
    (ex) =>
      ex.id.toLowerCase() === clean ||
      ex.slug.toLowerCase() === clean ||
      ex.name.toLowerCase() === clean ||
      ex.aliases?.some((a) => a.toLowerCase() === clean) ||
      clean.includes(ex.name.toLowerCase()) ||
      ex.name.toLowerCase().includes(clean)
  );
}
