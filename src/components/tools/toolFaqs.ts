import type { FaqItem } from '../FaqAccordion';

export const BODYFAT_FAQS: FaqItem[] = [
  {
    question: 'How accurate is the US Navy Body Fat equation compared to DEXA?',
    answer:
      'The U.S. Navy circumference equation (Hodgdon & Beckett, 1984) carries a standard error of estimate of roughly ±3% to 4% compared with hydrostatic weighing and dual-energy X-ray absorptiometry (DEXA) scans. Unlike standard BMI, which misclassifies muscular athletes by counting skeletal muscle as excess weight, the Navy formula adjusts waist circumference against neck and height to track visceral and subcutaneous fat changes consistently over time.',
  },
  {
    question: 'How should I measure my neck, waist, and hips for accurate results?',
    answer:
      'Take measurements first thing in the morning before eating or training while standing relaxed. Measure neck circumference horizontally just below the larynx (Adam’s apple), waist circumference horizontally at the navel level for men or at the narrowest natural waist for women after a relaxed exhale (do not pull the tape tight or suck in), and hip circumference for women at the widest gluteal protrusion. Official U.S. Navy Body Composition Assessment (BCA) protocols round neck up to the nearest 0.5 inch and waist/hips down to the nearest 0.5 inch.',
  },
  {
    question: 'What is the optimal body fat percentage for muscle hypertrophy?',
    answer:
      'For male lifters, maintaining roughly 10% to 15% body fat supports favorable insulin sensitivity, hormonal balance, and productive lean-bulking phases. For female lifters, roughly 18% to 24% supports healthy endocrine function and steady progressive overload. Dropping into essential fat territory (below 6% for men or 14% for women) increases fatigue and impairs strength recovery.',
  },
  {
    question: 'How do I maintain lean mass while cutting body fat?',
    answer:
      'Keep mechanical tension high on your primary compound lifts (log your sets, reps, and RPE with PPL Tracker), consume 1.8 to 2.2 g of protein per kilogram of body weight daily, and aim for a controlled 300 to 500 kcal daily deficit below TDEE rather than crash dieting.',
  },
];

export const FFMI_FAQS: FaqItem[] = [
  {
    question: 'What is the difference between BMI, FFMI, and FMI?',
    answer:
      'Body Mass Index (BMI) divides total weight by height squared, so it cannot separate muscle from fat. Fat-Free Mass Index (FFMI) divides Lean Body Mass (kg) by height squared (m²), isolating skeletal muscle and fat-free tissue. Fat Mass Index (FMI) divides adipose fat mass (kg) by height squared (m²), allowing you to evaluate muscularity and adiposity independently.',
  },
  {
    question: 'Why does Normalized FFMI adjust for a height of 1.80 meters?',
    answer:
      'Because human volume scales across three dimensions while dividing by height squared scales across two, taller athletes tend to register slightly higher raw FFMI scores at identical proportional muscularity. Kouri et al. (1995) introduced the normalization correction [Raw FFMI + 6.1 × (1.80 − height_m)] to standardize scores to a 1.80 m (5 ft 11 in) male reference.',
  },
  {
    question: 'Is 25.0 FFMI a strict genetic ceiling for men (and what is the female range)?',
    answer:
      'In Kouri et al. (1995), non-steroid-using male athletes peaked near a normalized FFMI of 25.0 kg/m², while typical natural female lifters span roughly 13.5 to 21.0 kg/m². However, frame-size models (such as wrist and ankle circumference frameworks popularized by Casey Butt and Menno Henselmans) show that thicker bone structures and higher body fat percentages can push rare natural outliers slightly above 25.0, while estimating body fat 4% too low artificially inflates FFMI by ~1.0 point.',
  },
  {
    question: 'How do I increase my FFMI without gaining excessive body fat?',
    answer:
      'Pair a modest caloric surplus (5% to 10% above TDEE) and 1.6–2.2 g/kg daily protein with structured mechanical tension across 10–20 weekly hard sets per muscle group, verifying your body fat trend bi-weekly with the US Navy Body Fat Calculator.',
  },
];

export const BMI_FAQS: FaqItem[] = [
  {
    question: 'How is BMI mathematically calculated in metric and imperial units?',
    answer:
      'In metric units, BMI equals weight in kilograms divided by height in meters squared: BMI = weight (kg) ÷ [height (m)]². In imperial units, divide weight in pounds by height in inches squared and multiply by 703: BMI = 703 × weight (lbs) ÷ [height (in)]².',
  },
  {
    question: 'Why does BMI often misclassify muscular lifters and bodybuilders?',
    answer:
      'BMI measures total mass relative to height without distinguishing skeletal muscle from adipose tissue. Because dense skeletal muscle adds substantial lean weight without increasing visceral waist circumference, a lean athlete at 11% body fat can register a BMI of 26–28 ("Overweight") despite low cardiometabolic risk.',
  },
  {
    question: 'Should strength athletes use US Navy Body Fat % or FFMI instead of BMI?',
    answer:
      'Yes. Use BMI only as a rapid population-level screen alongside waist circumference. To evaluate true adiposity and lean muscle development, pair a circumference estimate from our US Navy Body Fat Calculator with your height-normalized Fat-Free Mass Index (FFMI).',
  },
  {
    question: 'What is a healthy BMI range for recreational and female strength athletes?',
    answer:
      'The World Health Organization defines normal BMI as 18.5 to 24.9 kg/m² for adults. Many well-trained men and women carrying several years of resistance-trained muscle sit safely between 22.0 and 26.5 kg/m² provided waist circumference remains lean relative to height.',
  },
];

export const STRENGTH_FAQS: FaqItem[] = [
  {
    question: 'What is the difference between DOTS, Wilks, and IPF GL Points?',
    answer:
      'All three formulas normalize a 3-lift total across body weights to compare pound-for-pound powerlifting strength. Classic Wilks (1994) used a fifth-degree polynomial that slightly favored extreme lightweight and superheavyweight classes. DOTS (Tim Konertz, 2019) corrected polynomial curvature and is widely used across USAPL and WRPF meets, while IPF GL Points (2020) uses an exponential curve calibrated specifically for IPF raw and equipped competitions.',
  },
  {
    question: 'What DOTS score is considered strong for natural lifters?',
    answer:
      'A DOTS score around 275–325 reflects a solid intermediate base, 350–424 marks an advanced regional competitor (top ~15%), 425–499 represents elite national-level raw strength, and 500+ DOTS indicates world-class international competitiveness.',
  },
  {
    question: 'Can I enter my gym PRs or must they be competition-standard lifts?',
    answer:
      'You can enter gym PRs, estimated 1RMs from submaximal working sets, or meet totals. For meaningful comparisons against federation benchmarks, ensure squats reach full depth (hip crease below top of knee), bench presses pause cleanly on the chest without glutes lifting, and deadlifts lock out without hitching.',
  },
  {
    question: 'How do I systematically raise my DOTS and IPF GL strength score?',
    answer:
      'Improve both relative neuromuscular force and lean tissue cross-sectional area over multi-week mesocycles. Track squat, bench, and deadlift progressive overload with PPL Tracker alongside autoregulated RPE targets and a calibrated FFMI lean mass base.',
  },
];

export const WARMUP_FAQS: FaqItem[] = [
  {
    question: 'Why not jump straight into heavy working sets?',
    answer:
      'Loading heavy barbell weights cold increases mechanical strain on tendons and spinal tissues and slows neural bar velocity. Progressive warm-up sets warm synovial joint fluid, groove bar path mechanics, and trigger post-activation potentiation (PAP) without depleting phosphocreatine stores.',
  },
  {
    question: 'Do warm-up sets count toward weekly hypertrophy volume (MEV/MAV)?',
    answer:
      'No. Hypertrophy stimulus comes from challenging working sets taken close to concentric failure (roughly 0 to 3 RIR / RPE 7 to 10). Warm-up sets stop far short of failure (4 to 8+ RIR) so they prepare the nervous system without adding systemic fatigue.',
  },
  {
    question: 'Why do warm-up reps decrease as barbell weight increases?',
    answer:
      'An inverse rep-ramp uses higher reps (8–10) with the empty bar to increase blood flow and synovial lubrication, then tapers down to 3, 2, and 1 rep at 70%–90% of working weight so you prime high-threshold motor units without accumulating lactic acid before your top set.',
  },
  {
    question: 'How do I log warm-up sets separately in PPL Tracker?',
    answer:
      'Inside the PPL Workout Tracker, mark preparatory sets with the warm-up toggle so your working set tonnage, e1RM tracking, and double-progression rep ceilings stay completely accurate.',
  },
];

export const IMPORTER_FAQS: FaqItem[] = [
  {
    question: 'How do I export my workout data from Hevy?',
    answer:
      'Open the Hevy app, navigate to Profile → Settings → Export Data → CSV. Exported files use English column headers such as Exercise Title and Set Index that the importer detects automatically.',
  },
  {
    question: 'How do I export my workouts from the Strong app?',
    answer:
      'In Strong, tap Profile → Settings → Export Workouts → Export as CSV. Both comma-delimited and European semicolon-delimited Strong CSV files (including Exercise Name and Set Order columns) are parsed automatically.',
  },
  {
    question: 'Will importing overwrite my existing PPL Tracker history or break dates in Excel?',
    answer:
      'No—the importer merges incoming sessions into your existing local history and skips duplicate session IDs. However, avoid opening and re-saving CSV files in Microsoft Excel before importing, because Excel can reformat ISO timestamps (YYYY-MM-DD) into ambiguous local date strings.',
  },
  {
    question: 'Is my workout CSV data kept private and local?',
    answer:
      'Yes. All CSV and JSON parsing runs 100% locally inside your browser—your workout files never leave your device during import.',
  },
];
