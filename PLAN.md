# PLAN — The Gallery Experience

The project recreates the provided dark interactive-gallery reference as a polished React + Babylon.js experience.

## Risk slices

The highest-risk slice is the Babylon-in-React lifecycle: one engine, one scene, resize cleanup, and no duplicate render loops under React StrictMode. The second risk is keeping the threshold screen usable while the canvas is already initializing. The third is responsive input: desktop keyboard/mouse guidance must collapse into touch-friendly artwork navigation on small screens.

## Verification criteria

The threshold must show a centered gallery title, a clear invitation to enter, the generated brand mark, amber progress light, and edge metadata. After entry, the scene must show a dark exhibition room with three distinct artworks, a museum-style label, navigation controls, and a night-mode toggle. TypeScript must pass, generated asset URLs must resolve, and the layout must remain legible at desktop and mobile widths.
