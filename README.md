# 6-Day PPL Hypertrophy Tracker (Upper Chest & 3D Delts Focus)

> 🌐 **Live Web Application**: [https://ppltracker.web.id](https://ppltracker.web.id)

A high-performance progressive overload hypertrophy tracking application built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, **Three.js**, and **GSAP**, upgraded from `ppl-tracker.html` following **UI/UX Pro Max** design standards.

---

## 🚀 Key Features & Architectural Upgrades

### 1. Interactive 3D Hypertrophy Rig (Three.js & GSAP)
- Custom procedural 3D Olympic Barbell and calibrated bumper plates rendered in WebGL.
- **Dynamic Color Shifts**: Glow rings and studio lighting morph seamlessly between active split types:
  - **Push**: Energy Amber / Orange (`#f97316`)
  - **Pull**: Electric Sky Cyan (`#0ea5e9`)
  - **Legs**: Emerald Hypertrophy Green (`#10b981`)
- Realtime mouse drag & touch rotation, wireframe hologram toggle, and GSAP scale / rotation choreography.

### 2. Comprehensive Set-by-Set Logging & Progressive Overload Engine
- Replaces static checkmarks with detailed weight (kg) and rep inputs for every working set.
- **Estimated 1RM**: Realtime Epley formula calculation for peak sets.
- **Double Progression Protocol**: Automatically alerts lifters when all working sets reach the top rep ceiling (e.g. 10 reps on an 8–10 target) with an "Earned" badge signaling to increase weight next session.
- **Plate Math Calculator**: Barbell math helper showing exact color-coded Olympic bumper plates (25kg, 20kg, 15kg, 10kg, 5kg, 2.5kg, 1.25kg) required per sleeve.

### 3. Integrated Auto Rest Timer with Audio Cues
- Automatically triggers on set completion with the exercise's specific rest interval (60s, 75s, 90s, 120s, 150s).
- Built-in zero-dependency **Web Audio API synthesizer** providing punchy triple-tone finish alerts and set chimes.
- Quick adjustments (+15s / -15s), preset chips (45s, 60s, 90s, 2m, 3m), and audio mute toggle.

### 4. Session Metrics, History & PR Tracking
- Tracks total workout volume ($kg \times reps$), sets completed, and session duration in real time.
- **Finish Workout Celebration**: GSAP confetti bursts and celebratory modal.
- **History & PRs**: Local storage persistence, PR Hall of Fame, and JSON export/import for zero data lock-in.
- **Backwards Compatibility**: Automatically imports any existing checkmark states from `ppl-tracker.html`.

### 5. UI/UX Pro Max Standards
- OLED dark theme with high contrast (zinc-950 backdrop, zinc-900 surfaces).
- Athletic typography using **Barlow Condensed**, **Barlow**, and **JetBrains Mono** for tabular numbers.
- Responsive design tailored for mobile gym use (touch targets $\ge 44\text{px}$, sticky quick-nav bar).

---

## 🛠️ Scripts & Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
