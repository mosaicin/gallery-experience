# STRUCTURE

`client/src/pages/Home.tsx` owns the threshold state, selected artwork, keyboard shortcuts, night mode, fullscreen action, labels, and responsive control chrome.

`client/src/components/GalleryCanvas.tsx` owns Babylon lifecycle and the spatial exhibition: camera, floor, walls, frames, generated artwork textures, point lights, and keyboard movement. It intentionally exposes only presentation props and does not contain React UI markup beyond the canvas.

`client/src/index.css` is the Nocturne Museum design system: near-black surfaces, ivory Cormorant display type, DM Mono metadata, Manrope support copy, amber beam accents, grain, vignette, and mobile breakpoints.
