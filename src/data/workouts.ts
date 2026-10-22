import { DayWorkout, SplitDayId } from '../types/workout';

export const WORKOUT_DAYS: DayWorkout[] = [
  {
    id: 'push-a',
    dayNumber: 1,
    title: 'Day 1: Push A',
    splitType: 'push',
    subtitle: 'Upper Chest Priority, Mid Delts & Long-Head Triceps',
    focus: 'Clavicular Pec Overload & Lateral Width',
    themeColor: 'push',
    accentHex: '#f97316',
    exercises: [
      {
        id: 'push-a-1',
        name: 'Incline Dumbbell Press',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: 'Set bench to 15°–30°. Tuck elbows to a 45° angle and drive biceps inward at the top without banging the dumbbells together.',
        biomechanicsTip: 'Angles steeper than 30° transfer tension directly to the anterior deltoid. Keep feet planted and drive upper back firmly into the pad.'
      },
      {
        id: 'push-a-2',
        name: 'Seated Dumbbell Shoulder Press',
        target: 'Front & Mid Delts',
        primaryMuscle: 'Front Delts',
        secondaryMuscles: ['Lateral Delts', 'Triceps'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: 'Use an 75°–80° bench support rather than completely vertical. Control the descent down to ear level before pressing upwards.',
        biomechanicsTip: 'Slightly arching allows your scapulae to glide naturally in the scapular plane, eliminating shoulder impingement.'
      },
      {
        id: 'push-a-3',
        name: 'Flat Barbell or Machine Press',
        target: 'Mid Chest',
        primaryMuscle: 'Mid Chest',
        secondaryMuscles: ['Triceps', 'Front Delts'],
        sets: 3,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'barbell',
        cue: 'Keep shoulder blades fully retracted and pinned into the pad throughout the entire set. Lower to sternum with control.',
        biomechanicsTip: 'Think of pushing yourself away from the bar into the bench rather than just shoving the weight up.'
      },
      {
        id: 'push-a-4',
        name: 'Seated Dumbbell Lateral Raise',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        secondaryMuscles: ['Traps'],
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 75,
        restDisplay: '60–90s',
        equipment: 'dumbbell',
        cue: 'Raise slightly forward in the scapular plane (~30° forward). Lead with your elbows rather than wrists for pure medial delt isolation.',
        biomechanicsTip: 'Seated posture eliminates leg drive and torso swinging, ensuring strict mechanical tension on the side delts.'
      },
      {
        id: 'push-a-5',
        name: 'Overhead Cable Rope Extension',
        target: 'Triceps (Long Head)',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 75,
        restDisplay: '60–90s',
        equipment: 'cable',
        cue: 'Let the cables stretch your elbows fully behind your head on the eccentric. Flare rope apart at complete extension.',
        biomechanicsTip: 'The long head of the triceps crosses the shoulder joint; overhead flexion is mandatory for full recruitment and growth.'
      },
      {
        id: 'push-a-6',
        name: 'Tricep Rope Pushdowns',
        target: 'Triceps (Lateral Head)',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Keep elbows locked firmly to your ribs. Spread the rope apart at the bottom and lock out with a 1-second peak contraction.',
        biomechanicsTip: 'Avoid leaning forward excessively over the cable, which turns the movement into a chest dip.'
      }
    ]
  },
  {
    id: 'pull-a',
    dayNumber: 2,
    title: 'Day 2: Pull A',
    splitType: 'pull',
    subtitle: 'Back V-Taper Width, Rear Delts & Bicep Peak',
    focus: 'Lat Width, Scapular Retraction & Arm Hypertrophy',
    themeColor: 'pull',
    accentHex: '#0ea5e9',
    exercises: [
      {
        id: 'pull-a-1',
        name: 'Wide-Grip Lat Pulldown (or Pull-Ups)',
        target: 'Lats (Width / V-Taper)',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps', 'Rear Delts'],
        sets: 4,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'cable',
        cue: 'Pull elbows down toward your hips rather than leaning far back and turning it into a row. Touch bar to clavicle level.',
        biomechanicsTip: 'Drive your chest up slightly to meet the bar; initiate the pull by depressing the scapulae before bending the elbows.'
      },
      {
        id: 'pull-a-2',
        name: 'Chest-Supported Row (Machine/DB)',
        target: 'Upper & Mid Back',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Traps', 'Rear Delts', 'Biceps'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Let your shoulders protract fully forward at the bottom for a deep stretch, then pull and squeeze shoulder blades together.',
        biomechanicsTip: 'The chest pad takes your spinal erectors out of the equation, letting you train to true upper-back failure safely.'
      },
      {
        id: 'pull-a-3',
        name: 'Single-Arm Dumbbell Row',
        target: 'Lats (Thickness)',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps', 'Forearms'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Pull the dumbbell in a low sweeping arc toward your hip pocket rather than straight up to your chest.',
        biomechanicsTip: 'Rowing to the hip aligns with the iliac lat fibers and maximizes shoulder extension without trap compensation.'
      },
      {
        id: 'pull-a-4',
        name: 'High-Pulley Rope Face Pulls',
        target: 'Rear Delts & Rotator Cuff',
        primaryMuscle: 'Rear Delts',
        secondaryMuscles: ['Traps'],
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 75,
        restDisplay: '60–90s',
        equipment: 'cable',
        cue: 'Pull the rope toward your forehead/eyes while externally rotating your hands backward like a double-bicep pose.',
        biomechanicsTip: 'Essential for posture balance, rotator cuff longevity, and developing that 3D cannonball shoulder roundness from behind.'
      },
      {
        id: 'pull-a-5',
        name: 'Incline Dumbbell Curls',
        target: 'Biceps (Long Head Peak)',
        primaryMuscle: 'Biceps',
        secondaryMuscles: ['Forearms'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 75,
        restDisplay: '60–90s',
        equipment: 'dumbbell',
        cue: 'Set bench to 45°–60°. Keep elbows pinned behind your torso line to maximize the deep bicep stretch at the bottom.',
        biomechanicsTip: 'Placing the shoulder into hyperextension maximally stretches the long head of the biceps brachii for peak growth.'
      },
      {
        id: 'pull-a-6',
        name: 'Dumbbell Hammer Curls',
        target: 'Brachialis & Forearms',
        primaryMuscle: 'Forearms',
        secondaryMuscles: ['Biceps'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Maintain a strict neutral (thumbs-up) grip throughout. Avoid rocking or using hip swing to initiate reps.',
        biomechanicsTip: 'Targets the brachialis muscle underneath the bicep, pushing the bicep up for higher arms and denser forearms.'
      }
    ]
  },
  {
    id: 'legs-a',
    dayNumber: 3,
    title: 'Day 3: Legs A',
    splitType: 'legs',
    subtitle: 'Quad-Dominant Compound Focus, Calves & Core',
    focus: 'Knee Flexion, Deep Squat Depth & Calf Hypertrophy',
    themeColor: 'legs',
    accentHex: '#10b981',
    exercises: [
      {
        id: 'legs-a-1',
        name: 'Barbell Back Squat (or Hack Squat)',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes', 'Abs'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2–3 min',
        equipment: 'barbell',
        cue: 'Brace your core 360°, screw feet into the floor, and control the descent below parallel for full knee flexion and quad stretch.',
        biomechanicsTip: 'Elevating heels slightly with squat shoes or small plates reduces ankle mobility demands and directs load squarely onto the quads.'
      },
      {
        id: 'legs-a-2',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        target: 'Hamstrings & Glutes',
        primaryMuscle: 'Hamstrings',
        secondaryMuscles: ['Glutes', 'Upper Back'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: 'Push your hips straight back horizontally like touching a wall behind you. Stop once hips stop travelling backwards.',
        biomechanicsTip: 'Keep dumbbells brushing your thighs. Bending your lower back does not load hamstrings—pure hip hinge does.'
      },
      {
        id: 'legs-a-3',
        name: 'Leg Press',
        target: 'Quads',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Place feet shoulder-width on the lower half of the sled to bias knee flexion. Keep lower back glued to the backrest pad.',
        biomechanicsTip: 'Do not lock out your knees violently at the top; preserve continuous tension on the quadriceps.'
      },
      {
        id: 'legs-a-4',
        name: 'Seated Leg Extension',
        target: 'Quads (Isolation)',
        primaryMuscle: 'Quads',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 75,
        restDisplay: '60–90s',
        equipment: 'machine',
        cue: 'Align knee axis with machine pivot point. Pause for 1 full second at peak extension on every single repetition.',
        biomechanicsTip: 'Isolates the rectus femoris in its fully shortened position—something compound squats cannot do alone.'
      },
      {
        id: 'legs-a-5',
        name: 'Standing Calf Raises',
        target: 'Calves (Gastrocnemius)',
        primaryMuscle: 'Calves',
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Pause for 2 full seconds in the deep bottom stretch to dissipate the Achilles elastic recoil before pressing up high.',
        biomechanicsTip: 'The gastrocnemius requires straight knees for full activation; bent knee calf raises only work the underlying soleus.'
      },
      {
        id: 'legs-a-6',
        name: 'Hanging Leg Raises',
        target: 'Lower Abs',
        primaryMuscle: 'Abs',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'bodyweight',
        cue: 'Curl your pelvis upward toward your ribs rather than swinging your hip flexors. Squeeze abs tight at top.',
        biomechanicsTip: 'Posterior pelvic tilt is the key: if your hips do not curl upward, you are only working the psoas muscles.'
      }
    ]
  },
  {
    id: 'push-b',
    dayNumber: 4,
    title: 'Day 4: Push B',
    splitType: 'push',
    subtitle: 'Heavy Incline Overload, Constant-Tension Delts & Triceps',
    focus: 'Barbell Progressive Overload & Medial Delt Cables',
    themeColor: 'push',
    accentHex: '#f97316',
    exercises: [
      {
        id: 'push-b-1',
        name: 'Incline Barbell or Smith Press',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2–3 min',
        equipment: 'barbell',
        cue: 'Focus on heavy progressive overload. Pause for 1 second just above your clavicle/upper chest before driving up explosively.',
        biomechanicsTip: 'Smith machine or barbell at 30° allows maximum load accumulation with minimal stabilization fatigue.'
      },
      {
        id: 'push-b-2',
        name: 'Low-to-High Cable Fly',
        target: 'Upper Chest (Inner/Squeeze)',
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Front Delts'],
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'cable',
        cue: 'Scoop hands upward from hip height to eye level, bringing pinkies slightly together at top for a brutal clavicular pec squeeze.',
        biomechanicsTip: 'Follows the anatomical fiber direction of the clavicular head diagonally across the chest.'
      },
      {
        id: 'push-b-3',
        name: 'Chest Dips (or Decline Push-Ups)',
        target: 'Lower Chest & Triceps',
        primaryMuscle: 'Lower Chest',
        secondaryMuscles: ['Triceps', 'Front Delts'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'bodyweight',
        cue: 'Lean your torso forward 30° and flare elbows moderately to bias the pectoral fibers over tricep lockout.',
        biomechanicsTip: 'Deep dip stretch provides enormous mechanical tension at long muscle lengths, accelerating lower chest development.'
      },
      {
        id: 'push-b-4',
        name: 'Cable Lateral Raises',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Set pulley to wrist/knee height. Routing cable behind your back provides continuous resistance from the very first inch of movement.',
        biomechanicsTip: 'Unlike dumbbells where tension is zero at the bottom, cables maintain high mechanical tension at the stretched position.'
      },
      {
        id: 'push-b-5',
        name: 'EZ-Bar Skullcrushers',
        target: 'Triceps (Medial/Long)',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'barbell',
        cue: 'Lower the bar slightly behind the crown of your head instead of directly to forehead to preserve constant tricep tension.',
        biomechanicsTip: 'Angling the upper arms backward 15° prevents the weight from balancing at the top, keeping triceps firing constantly.'
      },
      {
        id: 'push-b-6',
        name: 'Single-Arm Cable Kickbacks/Pushdowns',
        target: 'Triceps',
        primaryMuscle: 'Triceps',
        sets: 2,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Squeeze hard at full lockout for 1 full second on every single rep. Keep upper arm completely motionless.',
        biomechanicsTip: 'Single-arm cables remove bilateral asymmetries and isolate the lateral tricep head with no joint discomfort.'
      }
    ]
  },
  {
    id: 'pull-b',
    dayNumber: 5,
    title: 'Day 5: Pull B',
    splitType: 'pull',
    subtitle: 'Overall Back Density, 3D Rear Delts & Bicep Thickness',
    focus: 'Mid-Back Thickness, Rear Delt Hypertrophy & Preacher Overload',
    themeColor: 'pull',
    accentHex: '#0ea5e9',
    exercises: [
      {
        id: 'pull-b-1',
        name: 'Barbell Bent-Over Row',
        target: 'Overall Back Density',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Lats', 'Traps', 'Biceps'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'barbell',
        cue: 'Hinge to a solid 45° torso angle. Pull the bar smoothly into your lower ribs/upper abdomen without jerking your torso upright.',
        biomechanicsTip: 'Brace your core and glutes firmly to create an immovable base for heavy spinal erector and rhomboid loading.'
      },
      {
        id: 'pull-b-2',
        name: 'Close-Grip (V-Bar) Lat Pulldown',
        target: 'Lower Lats',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps', 'Forearms'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'cable',
        cue: 'Keep chest high and proud. Drive your elbows straight down close to your ribs for a fierce lower lat crunch.',
        biomechanicsTip: 'Neutral grip allows your elbows to tuck tighter to the torso, prioritizing the lower fibers of the latissimus dorsi.'
      },
      {
        id: 'pull-b-3',
        name: 'Reverse Pec Deck (or Rear Delt Fly)',
        target: 'Rear Delts',
        primaryMuscle: 'Rear Delts',
        secondaryMuscles: ['Traps'],
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 75,
        restDisplay: '60–90s',
        equipment: 'machine',
        cue: 'Push outward with the backs of your hands. Keep shoulders depressed down and avoid shrugging traps to move the weight.',
        biomechanicsTip: 'Think about pushing the handles toward the back corners of the room rather than squeezing shoulder blades together.'
      },
      {
        id: 'pull-b-4',
        name: 'Dumbbell Shrugs',
        target: 'Upper Traps',
        primaryMuscle: 'Traps',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Elevate your shoulders straight up toward your ears. Hold for a 2-second isometric pause at the top. Never roll shoulders.',
        biomechanicsTip: 'Rolling shoulders backward does not add trap tension and places unnecessary stress on the cervical spine.'
      },
      {
        id: 'pull-b-5',
        name: 'EZ-Bar Preacher Curls',
        target: 'Biceps (Short Head Width)',
        primaryMuscle: 'Biceps',
        secondaryMuscles: ['Forearms'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'barbell',
        cue: 'Keep upper arms glued flat against the preacher pad. Stop 2 inches short of perpendicular at top to avoid losing tension.',
        biomechanicsTip: 'Forces strict bicep isolation by preventing shoulder assistance. Highest mechanical tension occurs in the initial stretch.'
      },
      {
        id: 'pull-b-6',
        name: 'Cable Curls (Straight Bar or Rope)',
        target: 'Biceps',
        primaryMuscle: 'Biceps',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Step 1-2 paces back from the cable pulley so there is resistance pulling forward against your forearms at all times.',
        biomechanicsTip: 'Continuous tension profile produces superior metabolic fatigue and cell swelling for the arms.'
      }
    ]
  },
  {
    id: 'legs-b',
    dayNumber: 6,
    title: 'Day 6: Legs B',
    splitType: 'legs',
    subtitle: 'Posterior Chain, Unilateral Leg Balance & Abs',
    focus: 'Hamstring Length, Glute Drive & Core Stability',
    themeColor: 'legs',
    accentHex: '#10b981',
    exercises: [
      {
        id: 'legs-b-1',
        name: 'Barbell RDL (or Deadlifts)',
        target: 'Hamstrings & Posterior',
        primaryMuscle: 'Hamstrings',
        secondaryMuscles: ['Glutes', 'Upper Back'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2–3 min',
        equipment: 'barbell',
        cue: 'Keep the barbell grazing your thighs and shins. Stop descending the moment your hips stop moving backward.',
        biomechanicsTip: 'Maximum mechanical tension on the hamstrings occurs at deep hip flexion with locked knee angle (15° flexed).'
      },
      {
        id: 'legs-b-2',
        name: 'Bulgarian Split Squats',
        target: 'Quads & Glutes (Unilateral)',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes'],
        sets: 3,
        targetReps: '8–10/leg',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Lean your torso forward slightly (~15°) and drive up through the mid-foot of your lead leg. Control the descent.',
        biomechanicsTip: 'Fixes side-to-side strength imbalances, challenges hip stabilizers, and recruits maximum gluteus medius fibers.'
      },
      {
        id: 'legs-b-3',
        name: 'Lying or Seated Leg Curls',
        target: 'Hamstrings',
        primaryMuscle: 'Hamstrings',
        sets: 4,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Keep your hips pressed down firmly into the pad. Do not allow your lower back to arch when pulling the roller in.',
        biomechanicsTip: 'Seated leg curls produce superior hamstring hypertrophy compared to lying due to greater hip flexion prestretching the muscle.'
      },
      {
        id: 'legs-b-4',
        name: 'Seated Leg Extension',
        target: 'Quads',
        primaryMuscle: 'Quads',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Perform a drop set on your final set: reach failure, reduce weight by 30%, and pump out reps to complete exhaustion.',
        biomechanicsTip: 'High-rep metabolic finisher to fully deplete quadriceps glycogen stores and drive muscle protein synthesis.'
      },
      {
        id: 'legs-b-5',
        name: 'Seated Calf Raises',
        target: 'Calves (Soleus)',
        primaryMuscle: 'Calves',
        sets: 4,
        targetReps: '15–20',
        minReps: 15,
        maxReps: 20,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Full stretch at the bottom for 1 second, then press up hard onto your big toes. Do not bounce.',
        biomechanicsTip: 'Bent-knee posture removes the gastrocnemius, isolating the fatigue-resistant soleus muscle.'
      },
      {
        id: 'legs-b-6',
        name: 'Cable Crunches',
        target: 'Upper & Mid Abs',
        primaryMuscle: 'Abs',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Lock your hips in place like concrete and curl your ribcage down toward your pelvis. Aim elbows toward thighs.',
        biomechanicsTip: 'The spine must flex. If your hips are moving back and forth, you are using hip flexors instead of abdominals.'
      }
    ]
  }
];

export const GOLDEN_RULES = [
  {
    number: '01',
    title: 'Low Incline Priority',
    angleBadge: '15° – 30° Incline',
    description: 'Keep your incline bench strictly between 15° to 30°. Going steeper than 30° shifts the mechanical tension away from the clavicular (upper) pecs onto the anterior deltoids.',
    tag: 'Upper Chest Bias',
    color: 'amber'
  },
  {
    number: '02',
    title: 'Double Progression',
    angleBadge: 'Rep Ceiling Rule',
    description: 'Keep your working weight fixed until you achieve the top of the rep range across all prescribed sets with clean form. Increase weight at the next session and build reps back up.',
    tag: 'Overload Protocol',
    color: 'emerald'
  },
  {
    number: '03',
    title: 'Stretch Under Load',
    angleBadge: '2–3s Eccentric',
    description: 'Control the descent for 2–3 seconds and eliminate bouncing at the bottom of incline presses, lateral raises, and RDLs. Loaded eccentric stretch triggers peak muscle hypertrophy.',
    tag: 'Mechanical Tension',
    color: 'sky'
  }
];


// ==========================================
// BRO SPLIT / SINGLE MUSCLE FOCUS (5 DAYS)
// ==========================================
export const BRO_SPLIT_DAYS: DayWorkout[] = [
  {
    id: 'bro-chest',
    dayNumber: 1,
    title: 'Chest Annihilation',
    splitType: 'chest',
    subtitle: 'Clavicular & Sternal Pec Overload with Deep Stretch',
    focus: 'Incline Angle Variance, Dumbbell Stretch & Cable Squeeze',
    themeColor: 'push',
    accentHex: '#f97316',
    dayOfWeekTarget: 1, // Monday
    exercises: [
      {
        id: 'bro-c-1',
        name: 'Incline Barbell Bench Press',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2.5 min',
        equipment: 'barbell',
        cue: 'Set bench to 30°. Retract scapulae, unrack with locked lats, and bring bar cleanly to upper chest.',
        biomechanicsTip: 'Heavier loading in the 6–8 rep bracket drives high mechanical tension for clavicular pec fibers.'
      },
      {
        id: 'bro-c-2',
        name: 'Flat Dumbbell Press',
        target: 'Mid Chest',
        primaryMuscle: 'Mid Chest',
        secondaryMuscles: ['Triceps', 'Front Delts'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: 'Tuck elbows 45°. Allow dumbbells to sink deep into the chest stretch before explosive convergent press.',
        biomechanicsTip: 'Dumbbells offer converging adduction that barbells cannot match.'
      },
      {
        id: 'bro-c-3',
        name: 'Incline Dumbbell Flyes (Stretch-Focused)',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Slight bend in elbows. Lower slowly for 3 seconds into deep pectoral stretch; stop when elbows align with torso.',
        biomechanicsTip: 'Loaded stretch hypertrophy is highest when the muscle is held under tension at long lengths.'
      },
      {
        id: 'bro-c-4',
        name: 'High-to-Low Cable Flyes',
        target: 'Lower Chest',
        primaryMuscle: 'Lower Chest',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Bring hands down and across each other, squeezing the lower pectorals hard at the peak for 1 second.',
        biomechanicsTip: 'Follows the anatomical path of the sternocostal muscle fibers.'
      },
      {
        id: 'bro-c-5',
        name: 'Weighted or Bodyweight Dips',
        target: 'Lower Chest & Triceps',
        primaryMuscle: 'Lower Chest',
        secondaryMuscles: ['Triceps'],
        sets: 3,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'bodyweight',
        cue: 'Lean torso forward 30° with elbows flared slightly out to recruit the pectorals rather than upright triceps.',
        biomechanicsTip: 'One of the best compound mass builders for the entire chest shelf.'
      }
    ]
  },
  {
    id: 'bro-back',
    dayNumber: 2,
    title: 'Back & Lats Thickness',
    splitType: 'back',
    subtitle: 'V-Taper Lat Width & Dense Scapular Mid-Back',
    focus: 'Vertical Pulling, Heavy Rows & Trapezius Hypertrophy',
    themeColor: 'pull',
    accentHex: '#0ea5e9',
    dayOfWeekTarget: 2, // Tuesday
    exercises: [
      {
        id: 'bro-b-1',
        name: 'Barbell Deadlift (or Heavy Rack Pulls)',
        target: 'Posterior Chain & Erector Spinae',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Hamstrings', 'Glutes', 'Traps'],
        sets: 3,
        targetReps: '5–6',
        minReps: 5,
        maxReps: 6,
        restSeconds: 180,
        restDisplay: '3 min',
        equipment: 'barbell',
        cue: 'Brace core with Valsalva maneuver, pack lats like putting pencils in your armpits, and drive heels through floor.',
        biomechanicsTip: 'Builds systemic strength, spinal erector density, and upper-back trap thickness.'
      },
      {
        id: 'bro-b-2',
        name: 'Single-Arm Neutral-Grip Lat Pulldown',
        target: 'Lats (V-Taper)',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps'],
        sets: 4,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'cable',
        cue: 'Drive elbow down and back toward your hip pocket. Avoid excessive torso twisting.',
        biomechanicsTip: 'Isolates iliac and lumbar lat fibers with zero lower-back strain.'
      },
      {
        id: 'bro-b-3',
        name: 'Chest-Supported T-Bar Row',
        target: 'Upper Back & Rhomboids',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Rear Delts', 'Traps'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Full protraction at bottom, pull elbows wide and pin shoulder blades together at contraction.',
        biomechanicsTip: 'Allows deep stretch without taxing the lower back lumbar spine.'
      },
      {
        id: 'bro-b-4',
        name: 'Straight-Arm Cable Pullover',
        target: 'Lats (Teres Major & Stretch)',
        primaryMuscle: 'Lats',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Keep slight bend in elbows, push hips back slightly, and pull hands through in an arc to thighs.',
        biomechanicsTip: 'Zero bicep involvement ensures 100% pure lat fatigue.'
      },
      {
        id: 'bro-b-5',
        name: 'Dumbbell Shrugs (Pause at Peak)',
        target: 'Traps (Upper)',
        primaryMuscle: 'Traps',
        sets: 4,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Elevate scapulae straight up toward ears. Hold peak squeeze for 2 full seconds. Do NOT roll shoulders.',
        biomechanicsTip: 'Rolling shoulders provides zero mechanical advantage and increases rotator cuff wear.'
      }
    ]
  },
  {
    id: 'bro-shoulders',
    dayNumber: 3,
    title: 'Shoulders & Traps',
    splitType: 'shoulders',
    subtitle: 'Boulder Shoulders 3D Deltoid Specialization',
    focus: 'Lateral Delt Capped Width & Rear Delt Density',
    themeColor: 'push',
    accentHex: '#f97316',
    dayOfWeekTarget: 3, // Wednesday
    exercises: [
      {
        id: 'bro-s-1',
        name: 'Standing Barbell Overhead Press (OHP)',
        target: 'Front & Side Delts',
        primaryMuscle: 'Front Delts',
        secondaryMuscles: ['Triceps', 'Upper Chest'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2.5 min',
        equipment: 'barbell',
        cue: 'Squeeze glutes and quads tight. Press bar overhead in a straight vertical bar path, tucking head through at lockout.',
        biomechanicsTip: 'A primary compound overhead movement that builds deltoid thickness.'
      },
      {
        id: 'bro-s-2',
        name: 'Seated Dumbbell Lateral Raises',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        sets: 5,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Lead with elbows in scapular plane 30° forward. Keep wrists neutral. High volume for lateral delt cap.',
        biomechanicsTip: 'Lateral delts respond best to frequent, high-volume metabolic stress.'
      },
      {
        id: 'bro-s-3',
        name: 'Behind-the-Back Cable Lateral Raise',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Position cable at wrist height behind glutes. Provides continuous tension that free dumbbells miss at the bottom.',
        biomechanicsTip: 'Maintains uniform torque across the first 30° of abduction.'
      },
      {
        id: 'bro-s-4',
        name: 'Rear Delt Reverse Pec Deck Flyes',
        target: 'Rear Delts',
        primaryMuscle: 'Rear Delts',
        secondaryMuscles: ['Upper Back'],
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Internally rotate hands (thumbs down) to decouple traps and shift mechanical tension strictly to posterior deltoid.',
        biomechanicsTip: 'The posterior deltoid is crucial for preventing round-shouldered posture.'
      },
      {
        id: 'bro-s-5',
        name: 'Face Pulls with External Rotation',
        target: 'Rear Delts & Rotator Cuff',
        primaryMuscle: 'Rear Delts',
        secondaryMuscles: ['Traps'],
        sets: 3,
        targetReps: '15–20',
        minReps: 15,
        maxReps: 20,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Pull rope toward forehead and spread hands apart, rotating thumbs backward at the peak.',
        biomechanicsTip: 'Strengthens infraspinatus and teres minor, safeguarding the shoulder joint.'
      }
    ]
  },
  {
    id: 'bro-arms',
    dayNumber: 4,
    title: 'Arms (Biceps & Triceps)',
    splitType: 'arms',
    subtitle: 'Dedicated Arm Hypertrophy with Antagonist Supersets',
    focus: 'Brachialis, Bicep Peak, Long & Lateral Tricep Heads',
    themeColor: 'sky',
    accentHex: '#38bdf8',
    dayOfWeekTarget: 4, // Thursday
    exercises: [
      {
        id: 'bro-a-1',
        name: 'Close-Grip Barbell Bench Press',
        target: 'Triceps (All Heads)',
        primaryMuscle: 'Triceps',
        secondaryMuscles: ['Mid Chest', 'Front Delts'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'barbell',
        cue: 'Grip shoulder-width (not excessively narrow to save wrists). Lower bar to lower sternum and press through triceps.',
        biomechanicsTip: 'Allows the highest absolute load on triceps among all pressing variations.'
      },
      {
        id: 'bro-a-2',
        name: 'Standing Barbell EZ-Bar Curl',
        target: 'Biceps (Biceps Brachii)',
        primaryMuscle: 'Biceps',
        secondaryMuscles: ['Forearms'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'barbell',
        cue: 'Keep elbows pinned at sides. Curl weight without swinging hips. Lower with 2-second eccentric control.',
        biomechanicsTip: 'The EZ-bar semi-supinated angle reduces valgus stress on the elbow joint.'
      },
      {
        id: 'bro-a-3',
        name: 'Skull Crushers (EZ-Bar Lying Extension)',
        target: 'Triceps (Long & Lateral Heads)',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'barbell',
        cue: 'Lower the bar back behind your crown rather than directly to forehead to keep constant tension on the long head.',
        biomechanicsTip: 'Shoulder flexion at 90° places the long head under pre-stretch.'
      },
      {
        id: 'bro-a-4',
        name: 'Incline Dumbbell Curl (Long-Head Stretch)',
        target: 'Biceps (Long Head / Peak)',
        primaryMuscle: 'Biceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 75,
        restDisplay: '75s',
        equipment: 'dumbbell',
        cue: 'Set bench to 45°. Let arms hang straight down behind torso. Curl while supinating hard at top.',
        biomechanicsTip: 'Shoulder hyperextension stretches the long head of the biceps across the glenohumeral joint.'
      },
      {
        id: 'bro-a-5',
        name: 'Dumbbell Hammer Curls',
        target: 'Brachialis & Forearms',
        primaryMuscle: 'Forearms',
        secondaryMuscles: ['Biceps'],
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Neutral grip (palms facing each other). Great for pushing the biceps up from underneath and thickening the arm.',
        biomechanicsTip: 'The brachialis muscle sits underneath the biceps; developing it visibly widens the upper arm.'
      },
      {
        id: 'bro-a-6',
        name: 'Cable Tricep Pushdowns (Straight Bar)',
        target: 'Triceps (Lateral Head)',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Lock elbows into ribs and drive bar down to upper thighs, locking out triceps with high velocity.',
        biomechanicsTip: 'Finisher to achieve maximum metabolic cell swelling.'
      }
    ]
  },
  {
    id: 'bro-legs',
    dayNumber: 5,
    title: 'Legs & Core',
    splitType: 'legs',
    subtitle: 'Quad Sweeps, Hamstring Thickness & Calves',
    focus: 'Squats, Hinge Pattern & Direct Calves Overload',
    themeColor: 'legs',
    accentHex: '#10b981',
    dayOfWeekTarget: 5, // Friday
    exercises: [
      {
        id: 'bro-l-1',
        name: 'Barbell Back Squat',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes', 'Hamstrings'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 180,
        restDisplay: '3 min',
        equipment: 'barbell',
        cue: 'Tripod foot pressure. Descend below parallel with knees tracking over toes. Drive through midfoot.',
        biomechanicsTip: 'The undisputed king of lower-body quad hypertrophy and systemic stimulus.'
      },
      {
        id: 'bro-l-2',
        name: 'Romanian Deadlift (RDL)',
        target: 'Hamstrings & Glutes',
        primaryMuscle: 'Hamstrings',
        secondaryMuscles: ['Glutes'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'barbell',
        cue: 'Soft knees, push hips straight back into the wall behind you until hamstrings reach peak stretch. Snap hips forward.',
        biomechanicsTip: 'Trains the hamstrings at long muscle lengths for maximum passive elastic tension.'
      },
      {
        id: 'bro-l-3',
        name: 'Leg Press (Quad-Dominant Foot Placement)',
        target: 'Quads',
        primaryMuscle: 'Quads',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Feet placed lower on platform to maximize knee flexion and vastus lateralis quad sweep.',
        biomechanicsTip: 'Allows training to absolute failure without axial spinal loading.'
      },
      {
        id: 'bro-l-4',
        name: 'Seated Leg Curl',
        target: 'Hamstrings (Shortened & Lengthened)',
        primaryMuscle: 'Hamstrings',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Lean forward slightly into the thigh pad to increase hip flexion and maximize hamstring stretch before curling.',
        biomechanicsTip: 'Superior to lying leg curls for hypertrophy due to increased hamstring pre-stretch.'
      },
      {
        id: 'bro-l-5',
        name: 'Standing Calf Raises',
        target: 'Calves (Gastrocnemius)',
        primaryMuscle: 'Calves',
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Straight knees. Lower into full dorsiflexion stretch for 2 seconds. Explode onto big toes.',
        biomechanicsTip: 'The straight-knee posture targets the fast-twitch gastrocnemius calf muscle.'
      },
      {
        id: 'bro-l-6',
        name: 'Hanging Leg Raises',
        target: 'Abs (Lower Rectus Abdominis)',
        primaryMuscle: 'Abs',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'bodyweight',
        cue: 'Curl pelvis up toward your sternum rather than simply lifting your legs with hip flexors.',
        biomechanicsTip: 'Posterior pelvic tilt is essential for genuine abdominal activation.'
      }
    ]
  }
];

// ==========================================
// UPPER / LOWER (4 DAYS)
// ==========================================
export const UPPER_LOWER_DAYS: DayWorkout[] = [
  {
    id: 'upper-1',
    dayNumber: 1,
    title: 'Upper Body Power & Hypertrophy A',
    splitType: 'upper',
    subtitle: 'Horizontal Push/Pull Focus with Heavy Compound Work',
    focus: 'Barbell Bench Press, Chest-Supported Rows & Heavy Delts',
    themeColor: 'push',
    accentHex: '#f97316',
    dayOfWeekTarget: 1, // Monday
    exercises: [
      {
        id: 'ul-u1-1',
        name: 'Incline Dumbbell Bench Press',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2.5 min',
        equipment: 'dumbbell',
        cue: 'Bench at 30°. Retract scapulae firmly, drive biceps toward each other at top.',
        biomechanicsTip: 'High mechanical tension on clavicular pectorals with deep range of motion.'
      },
      {
        id: 'ul-u1-2',
        name: 'Barbell Bent-Over Row',
        target: 'Upper Back & Lats',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Lats', 'Biceps'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'barbell',
        cue: 'Hinge torso to 45°, pull bar toward belly button leading with elbows, squeeze shoulder blades.',
        biomechanicsTip: 'Compound back builder establishing raw rowing power.'
      },
      {
        id: 'ul-u1-3',
        name: 'Flat Dumbbell Press',
        target: 'Mid Chest',
        primaryMuscle: 'Mid Chest',
        secondaryMuscles: ['Triceps'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Controlled eccentric descent, drive weight up explosively without bouncing.',
        biomechanicsTip: 'Hypertrophy volume for sternal pec fibers.'
      },
      {
        id: 'ul-u1-4',
        name: 'Neutral Grip Lat Pulldown',
        target: 'Lats (V-Taper)',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps'],
        sets: 3,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'cable',
        cue: 'Drive elbows into hips. Focus on lat contraction rather than bicep pulling.',
        biomechanicsTip: 'Neutral grip aligns latissimus dorsi line of pull.'
      },
      {
        id: 'ul-u1-5',
        name: 'Dumbbell Lateral Raises',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Lead with elbows slightly forward in the scapular plane.',
        biomechanicsTip: 'Builds side delt capping.'
      },
      {
        id: 'ul-u1-6',
        name: 'Incline Dumbbell Bicep Curls',
        target: 'Biceps',
        primaryMuscle: 'Biceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Arms back behind torso for long-head stretch.',
        biomechanicsTip: 'Lengthened bicep position maximizes hypertrophy stimulus.'
      }
    ]
  },
  {
    id: 'lower-1',
    dayNumber: 2,
    title: 'Lower Body Strength & Quads A',
    splitType: 'lower',
    subtitle: 'Squat Heavy Compound & Posterior Chain Foundation',
    focus: 'Barbell Back Squat, Romanian Deadlift & Calf Density',
    themeColor: 'legs',
    accentHex: '#10b981',
    dayOfWeekTarget: 2, // Tuesday
    exercises: [
      {
        id: 'ul-l1-1',
        name: 'Barbell Back Squat',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes'],
        sets: 4,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 180,
        restDisplay: '3 min',
        equipment: 'barbell',
        cue: 'Drive feet into ground, hit parallel with control, explode upwards.',
        biomechanicsTip: 'Primary quadriceps and systemic driver.'
      },
      {
        id: 'ul-l1-2',
        name: 'Romanian Deadlift (RDL)',
        target: 'Hamstrings & Glutes',
        primaryMuscle: 'Hamstrings',
        secondaryMuscles: ['Glutes'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'barbell',
        cue: 'Push hips back like opening a door with glutes, hold 1-second stretch at bottom.',
        biomechanicsTip: 'Premier hamstring elongation movement.'
      },
      {
        id: 'ul-l1-3',
        name: 'Bulgarian Split Squats',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Keep front shin vertical for quads, or torso angled for glutes. Control descent.',
        biomechanicsTip: 'Fixes unilateral asymmetries and stabilizes knee joint.'
      },
      {
        id: 'ul-l1-4',
        name: 'Leg Extensions',
        target: 'Quads (Rectus Femoris)',
        primaryMuscle: 'Quads',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Lock knees at top for 1 full second to recruit rectus femoris.',
        biomechanicsTip: 'Direct isolation for quad peak.'
      },
      {
        id: 'ul-l1-5',
        name: 'Standing Calf Raises',
        target: 'Calves',
        primaryMuscle: 'Calves',
        sets: 4,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Deep stretch at bottom, explosive rise onto big toe.',
        biomechanicsTip: 'Straight leg targets gastrocnemius.'
      }
    ]
  },
  {
    id: 'upper-2',
    dayNumber: 3,
    title: 'Upper Body Hypertrophy & Arms B',
    splitType: 'upper',
    subtitle: 'Vertical Pulling, Overhead Press & Arm Specialization',
    focus: 'Seated DB Press, Lat Pulldowns, Tricep & Bicep Volume',
    themeColor: 'push',
    accentHex: '#f97316',
    dayOfWeekTarget: 4, // Thursday
    exercises: [
      {
        id: 'ul-u2-1',
        name: 'Seated Dumbbell Shoulder Press',
        target: 'Front & Side Delts',
        primaryMuscle: 'Front Delts',
        secondaryMuscles: ['Lateral Delts', 'Triceps'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: 'Bench at 75°, descend to ear level, press smoothly in an inward arc.',
        biomechanicsTip: 'Vertical pressing compound without lower-back sway.'
      },
      {
        id: 'ul-u2-2',
        name: 'Wide-Grip Pull-Ups or Lat Pulldown',
        target: 'Lats (Width)',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps'],
        sets: 4,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'cable',
        cue: 'Pull chest up toward bar, drive elbows down to ribs.',
        biomechanicsTip: 'Prime V-taper builder.'
      },
      {
        id: 'ul-u2-3',
        name: 'Incline Cable Chest Press or Flyes',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'cable',
        cue: 'Constant tension across entire range, squeeze at peak contraction.',
        biomechanicsTip: 'Cables deliver continuous resistance unlike free dumbbells.'
      },
      {
        id: 'ul-u2-4',
        name: 'Chest-Supported Machine Row',
        target: 'Upper Back',
        primaryMuscle: 'Upper Back',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Elbows wide at 60°, squeeze rhomboids.',
        biomechanicsTip: 'Safe upper-back overload.'
      },
      {
        id: 'ul-u2-5',
        name: 'Overhead Cable Rope Tricep Extension',
        target: 'Triceps (Long Head)',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Overhead angle stretches the long head across the shoulder.',
        biomechanicsTip: 'Essential for tricep thickness.'
      },
      {
        id: 'ul-u2-6',
        name: 'Cable Rope Hammer Curls',
        target: 'Brachialis & Forearms',
        primaryMuscle: 'Forearms',
        secondaryMuscles: ['Biceps'],
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Flare rope outward at top for intense contraction.',
        biomechanicsTip: 'Builds forearm and arm density.'
      }
    ]
  },
  {
    id: 'lower-2',
    dayNumber: 4,
    title: 'Lower Body Posterior & Hamstrings B',
    splitType: 'lower',
    subtitle: 'Deadlift/Hip Hinge Emphasis & High-Rep Quad Volume',
    focus: 'Barbell Deadlifts, Leg Press, Seated Hamstring Curls',
    themeColor: 'legs',
    accentHex: '#10b981',
    dayOfWeekTarget: 5, // Friday
    exercises: [
      {
        id: 'ul-l2-1',
        name: 'Conventional or Trap Bar Deadlift',
        target: 'Posterior Chain',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Hamstrings', 'Glutes'],
        sets: 3,
        targetReps: '5–6',
        minReps: 5,
        maxReps: 6,
        restSeconds: 180,
        restDisplay: '3 min',
        equipment: 'barbell',
        cue: 'Solid brace, push floor away through midfoot, lock hips smoothly.',
        biomechanicsTip: 'Full posterior chain recruitment.'
      },
      {
        id: 'ul-l2-2',
        name: 'Leg Press (Moderate Stance)',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        sets: 4,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'machine',
        cue: 'Deep controlled descent, do not lock knees forcefully at top.',
        biomechanicsTip: 'Safe high-volume leg loading.'
      },
      {
        id: 'ul-l2-3',
        name: 'Seated Leg Curls',
        target: 'Hamstrings',
        primaryMuscle: 'Hamstrings',
        sets: 4,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Lean forward slightly for peak stretch, curl hard with 2s negative.',
        biomechanicsTip: 'Hypertrophy favorite for hamstrings.'
      },
      {
        id: 'ul-l2-4',
        name: 'Walking Dumbbell Lunges',
        target: 'Glutes & Quads',
        primaryMuscle: 'Glutes',
        secondaryMuscles: ['Quads'],
        sets: 3,
        targetReps: '12 steps/leg',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Long strides for glute recruitment, control trailing knee down gently.',
        biomechanicsTip: 'Great unilateral finisher.'
      },
      {
        id: 'ul-l2-5',
        name: 'Seated Calf Raises',
        target: 'Calves (Soleus)',
        primaryMuscle: 'Calves',
        sets: 4,
        targetReps: '15–20',
        minReps: 15,
        maxReps: 20,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Bent knee posture isolates soleus.',
        biomechanicsTip: 'Soleus adds calf width from front.'
      }
    ]
  }
];

// ==========================================
// FULL BODY (3 DAYS)
// ==========================================
export const FULL_BODY_DAYS: DayWorkout[] = [
  {
    id: 'full-body-1',
    dayNumber: 1,
    title: 'Full Body A: Heavy Compound Overload',
    splitType: 'fullbody',
    subtitle: 'Squat & Incline Press Foundation with High-Output Compounds',
    focus: 'Barbell Squats, Incline DB Press, Rows & Overload',
    themeColor: 'push',
    accentHex: '#f97316',
    dayOfWeekTarget: 1, // Monday
    exercises: [
      {
        id: 'fb-1-1',
        name: 'Barbell Back Squat',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes'],
        sets: 3,
        targetReps: '6–8',
        minReps: 6,
        maxReps: 8,
        restSeconds: 150,
        restDisplay: '2.5 min',
        equipment: 'barbell',
        cue: 'Clean depth, controlled eccentric, drive out of the hole.',
        biomechanicsTip: 'Full body metabolic primer.'
      },
      {
        id: 'fb-1-2',
        name: 'Incline Dumbbell Press',
        target: 'Upper Chest',
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: '30° incline for clavicular head bias.',
        biomechanicsTip: 'Best compound upper-chest stimulator.'
      },
      {
        id: 'fb-1-3',
        name: 'Chest-Supported Row',
        target: 'Upper Back',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Lats'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Full stretch at bottom, squeeze rhomboids at top.',
        biomechanicsTip: 'Stable horizontal pulling.'
      },
      {
        id: 'fb-1-4',
        name: 'Romanian Deadlift (RDL)',
        target: 'Hamstrings',
        primaryMuscle: 'Hamstrings',
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'barbell',
        cue: 'Hips back into stretch, tight lats throughout.',
        biomechanicsTip: 'Hamstring hypertrophy gold standard.'
      },
      {
        id: 'fb-1-5',
        name: 'Dumbbell Lateral Raises',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Lead with elbows in scapular plane.',
        biomechanicsTip: 'V-taper shoulder width.'
      },
      {
        id: 'fb-1-6',
        name: 'Overhead Cable Tricep Extension',
        target: 'Triceps',
        primaryMuscle: 'Triceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Full stretch behind head.',
        biomechanicsTip: 'Long head isolation.'
      }
    ]
  },
  {
    id: 'full-body-2',
    dayNumber: 2,
    title: 'Full Body B: Deadlift & Vertical Mechanics',
    splitType: 'fullbody',
    subtitle: 'Posterior Chain, Overhead Pressing & Lat Width',
    focus: 'Deadlifts, OHP, Lat Pulldowns & Biceps',
    themeColor: 'pull',
    accentHex: '#0ea5e9',
    dayOfWeekTarget: 3, // Wednesday
    exercises: [
      {
        id: 'fb-2-1',
        name: 'Conventional or Trap Bar Deadlift',
        target: 'Posterior Chain',
        primaryMuscle: 'Upper Back',
        secondaryMuscles: ['Hamstrings', 'Glutes'],
        sets: 3,
        targetReps: '5–6',
        minReps: 5,
        maxReps: 6,
        restSeconds: 180,
        restDisplay: '3 min',
        equipment: 'barbell',
        cue: 'Braced torso, pack lats, smooth explosive lockout.',
        biomechanicsTip: 'Full body power driver.'
      },
      {
        id: 'fb-2-2',
        name: 'Seated Dumbbell Shoulder Press',
        target: 'Front & Side Delts',
        primaryMuscle: 'Front Delts',
        secondaryMuscles: ['Lateral Delts', 'Triceps'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 120,
        restDisplay: '2 min',
        equipment: 'dumbbell',
        cue: 'Controlled descent to ears, vertical drive.',
        biomechanicsTip: 'Vertical pressing compound.'
      },
      {
        id: 'fb-2-3',
        name: 'Wide-Grip Lat Pulldown',
        target: 'Lats (V-Taper)',
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps'],
        sets: 3,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'cable',
        cue: 'Pull elbows to hips, chest elevated.',
        biomechanicsTip: 'Lat width builder.'
      },
      {
        id: 'fb-2-4',
        name: 'Leg Press',
        target: 'Quads',
        primaryMuscle: 'Quads',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'machine',
        cue: 'Deep knee flexion, push through midfoot.',
        biomechanicsTip: 'Safe high-rep quad pump.'
      },
      {
        id: 'fb-2-5',
        name: 'Incline Dumbbell Bicep Curls',
        target: 'Biceps',
        primaryMuscle: 'Biceps',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'dumbbell',
        cue: 'Hang arms back for long-head stretch.',
        biomechanicsTip: 'Bicep peak development.'
      },
      {
        id: 'fb-2-6',
        name: 'Cable Crunches',
        target: 'Abs',
        primaryMuscle: 'Abs',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Curl ribcage to pelvis, lock hips.',
        biomechanicsTip: 'Loaded abdominal hypertrophy.'
      }
    ]
  },
  {
    id: 'full-body-3',
    dayNumber: 3,
    title: 'Full Body C: Density, Pump & Weak Point Volume',
    splitType: 'fullbody',
    subtitle: 'Hypertrophy Density, Unilateral Balance & High Rep Finisher',
    focus: 'Dips, Bulagarian Squats, Single-Arm Rows & Curls',
    themeColor: 'legs',
    accentHex: '#10b981',
    dayOfWeekTarget: 5, // Friday
    exercises: [
      {
        id: 'fb-3-1',
        name: 'Weighted or Bodyweight Dips',
        target: 'Chest & Triceps',
        primaryMuscle: 'Lower Chest',
        secondaryMuscles: ['Triceps'],
        sets: 3,
        targetReps: '8–12',
        minReps: 8,
        maxReps: 12,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'bodyweight',
        cue: 'Lean forward slightly for chest recruitment.',
        biomechanicsTip: 'Upper body mass builder.'
      },
      {
        id: 'fb-3-2',
        name: 'Bulgarian Split Squats',
        target: 'Quads & Glutes',
        primaryMuscle: 'Quads',
        secondaryMuscles: ['Glutes'],
        sets: 3,
        targetReps: '8–10',
        minReps: 8,
        maxReps: 10,
        restSeconds: 90,
        restDisplay: '90s',
        equipment: 'dumbbell',
        cue: 'Deep single-leg lunge, vertical front shin.',
        biomechanicsTip: 'Unilateral quad overload.'
      },
      {
        id: 'fb-3-3',
        name: 'Single-Arm Dumbbell Row',
        target: 'Lats',
        primaryMuscle: 'Lats',
        sets: 3,
        targetReps: '10–12',
        minReps: 10,
        maxReps: 12,
        restSeconds: 75,
        restDisplay: '75s',
        equipment: 'dumbbell',
        cue: 'Pull dumbbell to hip, maintain flat spine.',
        biomechanicsTip: 'Deep lat stretch.'
      },
      {
        id: 'fb-3-4',
        name: 'Seated Leg Curls',
        target: 'Hamstrings',
        primaryMuscle: 'Hamstrings',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: '2-second eccentric phase.',
        biomechanicsTip: 'Lengthened hamstring recruitment.'
      },
      {
        id: 'fb-3-5',
        name: 'Cable Lateral Raises',
        target: 'Lateral Delts',
        primaryMuscle: 'Lateral Delts',
        sets: 3,
        targetReps: '12–15',
        minReps: 12,
        maxReps: 15,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'cable',
        cue: 'Smooth continuous tension across range.',
        biomechanicsTip: 'Constant cable resistance.'
      },
      {
        id: 'fb-3-6',
        name: 'Standing Calf Raises',
        target: 'Calves',
        primaryMuscle: 'Calves',
        sets: 4,
        targetReps: '15–20',
        minReps: 15,
        maxReps: 20,
        restSeconds: 60,
        restDisplay: '60s',
        equipment: 'machine',
        cue: 'Full stretch at bottom, explode up.',
        biomechanicsTip: 'Calf hypertrophy finish.'
      }
    ]
  }
];

// ==========================================
// ALL TRAINING PROGRAMS CATALOG
// ==========================================
export const ALL_TRAINING_PROGRAMS = [
  {
    id: 'ppl',
    name: 'Push-Pull-Legs (6-Day Hypertrophy)',
    daysPerWeek: 6,
    description: 'The premier scientific bodybuilding split. Hits every muscle group twice every 7 days with tailored Push/Pull/Legs rotation for maximum muscle protein synthesis.',
    idealFor: 'Intermediate to advanced lifters aiming for maximum muscular hypertrophy and aesthetics.',
    days: WORKOUT_DAYS
  },
  {
    id: 'bro-split',
    name: 'Bro Split / Single Muscle Focus (5-Day)',
    daysPerWeek: 5,
    description: 'Classic high-volume bodypart split: Chest, Back, Shoulders, Arms, and Legs. Permits relentless localized fatigue and generous 7-day systemic recovery per muscle group.',
    idealFor: 'Lifters who love insane muscle pumps, deep recovery, and dedicated single-muscle isolation days.',
    days: BRO_SPLIT_DAYS
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower (4-Day Frequency)',
    daysPerWeek: 4,
    description: 'Balanced 4-day split hitting Upper body twice and Lower body twice. Optimal sweet spot between high mechanical tension and ample recovery time.',
    idealFor: 'Lifters balancing busy schedules with serious athletic strength and hypertrophy goals.',
    days: UPPER_LOWER_DAYS
  },
  {
    id: 'full-body',
    name: 'Full Body (3-Day Foundation)',
    daysPerWeek: 3,
    description: 'High-frequency 3-day split training all major muscle groups in every session with compound movements. Maximum stimulus per hour in the gym.',
    idealFor: 'Beginners or athletes training 3 days per week seeking progressive overload on core compounds.',
    days: FULL_BODY_DAYS
  }
];

// Helper: Get days for split
export function getWorkoutDaysForSplit(splitId: string): DayWorkout[] {
  switch (splitId) {
    case 'bro-split':
      return BRO_SPLIT_DAYS;
    case 'upper-lower':
      return UPPER_LOWER_DAYS;
    case 'full-body':
      return FULL_BODY_DAYS;
    case 'ppl':
    default:
      return WORKOUT_DAYS;
  }
}

// ==========================================
// DAY-SPECIFIC SMART SCHEDULING ALGORITHM
// ==========================================
export interface DayScheduleResult {
  dayOfWeekNumber: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayOfWeekName: string;
  isRestDay: boolean;
  scheduledDayId: SplitDayId;
  scheduledWorkout: DayWorkout;
  allDays: DayWorkout[];
  statusMessage: string;
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export function getScheduledDayForToday(splitId: string = 'ppl'): DayScheduleResult {
  const today = new Date();
  const dayNum = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayName = DAY_NAMES[dayNum];
  const allDays = getWorkoutDaysForSplit(splitId);

  let scheduledDay: DayWorkout;
  let isRest = false;
  let statusMessage = '';

  if (splitId === 'ppl') {
    // Mon: Push A (day 1)
    // Tue: Pull A (day 2)
    // Wed: Legs A (day 3)
    // Thu: Push B (day 4)
    // Fri: Pull B (day 5)
    // Sat: Legs B (day 6)
    // Sun: Rest
    switch (dayNum) {
      case 1:
        scheduledDay = allDays[0]; // push-a
        statusMessage = 'Day 1 of 6: Kick off the week with Chest & Push hypertrophy!';
        break;
      case 2:
        scheduledDay = allDays[1]; // pull-a
        statusMessage = 'Day 2 of 6: Lat width, vertical pulling and bicep overload.';
        break;
      case 3:
        scheduledDay = allDays[2]; // legs-a
        statusMessage = 'Day 3 of 6: Quadriceps dominant leg day & calf overload.';
        break;
      case 4:
        scheduledDay = allDays[3]; // push-b
        statusMessage = 'Day 4 of 6: Shoulders, clavicular pecs and tricep focus.';
        break;
      case 5:
        scheduledDay = allDays[4]; // pull-b
        statusMessage = 'Day 5 of 6: Upper back thickness, rear delts and arm peak.';
        break;
      case 6:
        scheduledDay = allDays[5]; // legs-b
        statusMessage = 'Day 6 of 6: Hamstrings, glutes and posterior chain finisher.';
        break;
      case 0:
      default:
        // Sunday: Rest / active recovery, default to push-a preview
        scheduledDay = allDays[0];
        isRest = true;
        statusMessage = 'Sunday Active Recovery: Rest, hydrate, and prepare for Push A tomorrow!';
        break;
    }
  } else if (splitId === 'bro-split') {
    // Mon: Chest
    // Tue: Back
    // Wed: Shoulders
    // Thu: Arms
    // Fri: Legs
    // Sat/Sun: Rest
    switch (dayNum) {
      case 1:
        scheduledDay = allDays[0]; // chest
        statusMessage = 'Chest Day: Incline presses, heavy flyes and pec overload!';
        break;
      case 2:
        scheduledDay = allDays[1]; // back
        statusMessage = 'Back Day: Heavy rows, lat pulldowns and deadlift thickness.';
        break;
      case 3:
        scheduledDay = allDays[2]; // shoulders
        statusMessage = 'Boulder Shoulders: Overhead presses and lateral delt capping.';
        break;
      case 4:
        scheduledDay = allDays[3]; // arms
        statusMessage = 'Arm Day: Dedicated bicep/tricep supersets and arm pump.';
        break;
      case 5:
        scheduledDay = allDays[4]; // legs
        statusMessage = 'Leg Day: Squats, RDLs and quad sweep destruction.';
        break;
      case 6:
      case 0:
      default:
        scheduledDay = allDays[0];
        isRest = true;
        statusMessage = 'Weekend Rest: Glycogen replenishment and muscle recovery.';
        break;
    }
  } else if (splitId === 'upper-lower') {
    // Mon: Upper 1
    // Tue: Lower 1
    // Wed: Rest
    // Thu: Upper 2
    // Fri: Lower 2
    // Sat/Sun: Rest
    switch (dayNum) {
      case 1:
        scheduledDay = allDays[0]; // upper-1
        statusMessage = 'Upper 1: Heavy horizontal push & pull overload.';
        break;
      case 2:
        scheduledDay = allDays[1]; // lower-1
        statusMessage = 'Lower 1: Heavy back squats and quad intensity.';
        break;
      case 3:
        scheduledDay = allDays[2]; // upper-2 preview
        isRest = true;
        statusMessage = 'Mid-Week Rest: Nervous system recovery before Upper 2.';
        break;
      case 4:
        scheduledDay = allDays[2]; // upper-2
        statusMessage = 'Upper 2: Overhead pressing, vertical pulling & arm specialization.';
        break;
      case 5:
        scheduledDay = allDays[3]; // lower-2
        statusMessage = 'Lower 2: Deadlifts, hamstrings and posterior chain volume.';
        break;
      case 6:
      case 0:
      default:
        scheduledDay = allDays[0];
        isRest = true;
        statusMessage = 'Weekend Rest: Full recovery before starting Upper 1.';
        break;
    }
  } else {
    // full-body (Mon: A, Wed: B, Fri: C)
    switch (dayNum) {
      case 1:
        scheduledDay = allDays[0]; // FB 1
        statusMessage = 'Full Body 1: Squats, Incline Press & Compound Foundations.';
        break;
      case 2:
        scheduledDay = allDays[1];
        isRest = true;
        statusMessage = 'Active Recovery Day: Light mobility and walking.';
        break;
      case 3:
        scheduledDay = allDays[1]; // FB 2
        statusMessage = 'Full Body 2: Deadlifts, Overhead Press & Lat Width.';
        break;
      case 4:
        scheduledDay = allDays[2];
        isRest = true;
        statusMessage = 'Rest Day: Muscle protein synthesis and recovery.';
        break;
      case 5:
        scheduledDay = allDays[2]; // FB 3
        statusMessage = 'Full Body 3: Density, Single-Leg Work & Weak Point Finisher.';
        break;
      case 6:
      case 0:
      default:
        scheduledDay = allDays[0];
        isRest = true;
        statusMessage = 'Weekend Rest: Re-fuel and prepare for Full Body 1.';
        break;
    }
  }

  return {
    dayOfWeekNumber: dayNum,
    dayOfWeekName: dayName,
    isRestDay: isRest,
    scheduledDayId: scheduledDay.id,
    scheduledWorkout: scheduledDay,
    allDays,
    statusMessage
  };
}

// ==========================================
// WEAK-POINT ADAPTATION ALGORITHM
// ==========================================
// Prioritizes lagging muscle groups by flagging them and moving them to earlier in the session
export function applyWeakPointPriorities(
  workout: DayWorkout,
  weakPoints: string[] = []
): DayWorkout {
  if (!weakPoints || weakPoints.length === 0) return workout;

  const normalizedWeakPoints = weakPoints.map((wp) => wp.toLowerCase().trim());

  // Deep clone workout so we don't mutate original data
  const clonedExercises = workout.exercises.map((ex) => {
    const exPrimary = ex.primaryMuscle?.toLowerCase() || '';
    const exTarget = ex.target?.toLowerCase() || '';
    const exSecondary = (ex.secondaryMuscles || []).map((m) => m.toLowerCase());

    const isMatch = normalizedWeakPoints.some((wp) => {
      // Check for substring matches e.g. "upper chest", "lateral delts", "hamstrings", "triceps", etc.
      return (
        exPrimary.includes(wp) ||
        exTarget.includes(wp) ||
        wp.includes(exPrimary) ||
        exSecondary.some((s) => s.includes(wp) || wp.includes(s))
      );
    });

    if (isMatch) {
      // Find matching label
      const matchedName = weakPoints.find((wp) => {
        const lower = wp.toLowerCase();
        return exPrimary.includes(lower) || exTarget.includes(lower) || lower.includes(exPrimary);
      }) || ex.primaryMuscle;

      return {
        ...ex,
        isPriorityWeakPoint: true,
        weakPointBadge: `⚡ Priority Lagging Focus: ${matchedName}`
      };
    }

    return { ...ex, isPriorityWeakPoint: false, weakPointBadge: undefined };
  });

  // Re-order: exercises that are priority weak points are placed earlier (unless the first exercise is an ultra-heavy compound)
  // Let's sort with stable priority order: Priority weak points float near top
  const priorityExercises = clonedExercises.filter((e) => e.isPriorityWeakPoint);
  const regularExercises = clonedExercises.filter((e) => !e.isPriorityWeakPoint);

  // If there are priority exercises, place them first or immediately after primary heavy compound
  let adaptedList = clonedExercises;
  if (priorityExercises.length > 0 && priorityExercises.length < clonedExercises.length) {
    // If first exercise is a heavy barbell lift, keep it first and place weak points immediately next
    const firstIsBarbell = clonedExercises[0].equipment === 'barbell';
    if (firstIsBarbell && !clonedExercises[0].isPriorityWeakPoint) {
      const first = clonedExercises[0];
      const otherRegulars = regularExercises.filter((e) => e.id !== first.id);
      adaptedList = [first, ...priorityExercises, ...otherRegulars];
    } else {
      adaptedList = [...priorityExercises, ...regularExercises];
    }
  }

  return {
    ...workout,
    exercises: adaptedList
  };
}
