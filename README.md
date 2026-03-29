# Robo's Hygiene Adventure 🫧🦷♻️

A playful, interactive 2D educational web game designed for children to learn healthy daily habits like brushing teeth, washing hands properly, and sorting trash into the correct bins.

## Features
* **Three Interactive Levels**:
  * 🦷 **Brushing Mini-Game**: Uses timed animations to clean dirty teeth.
  * 🧼 **Handwashing Mini-Game**: Features a hold-to-scrub progress mechanic.
  * ♻️ **Trash-Sorting Mini-Game**: A drag-and-drop game requiring the user to sort recyclable vs. compostable/general trash.
* **Child-Friendly Design**: Employs the "Playful Toybox" aesthetic with soft pastel colors, bouncy Framer Motion animations, large touch-friendly buttons, and satisfying confetti rewards! 
* **Dynamic Media Assets**: Uses HTML5 Canvas per-pixel chroma-keying to dynamically remove neon-green and pure-white backgrounds from `.mp4` and `.jpg` assets in real-time, allowing them to blend seamlessly with full-screen environment backgrounds without relying on standard CSS mix-blend-modes.

## Quick Start (Windows)
If you are on Windows, simply double-click the `build-and-run.bat` script in the root directory!
The script will cleanly install dependencies, compile the production assets, start a local server, and automatically open your default browser to `http://localhost:4173`.

## Manual Setup & Development

First, install all required dependencies:

```bash
npm install
```

To run the local development server (with hot-module reloading on `http://localhost:5173`):
```bash
npm run dev
```

To build for production and preview the compiled app:
```bash
npm run build
npm run preview
```

## Technologies Used
* **Framework**: React 18, Vite, TypeScript
* **Animations**: Framer Motion
* **Drag-and-Drop**: @dnd-kit/core
* **Styling**: Vanilla CSS with comprehensive CSS Variables
* **Media**: HTML5 `<canvas>` for real-time video compositing and image alpha-channel masking
