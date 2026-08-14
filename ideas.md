# Design Direction — The Gallery Experience

## Three initial approaches

### Theme Name: Nocturne Museum
Very dark, cinematic gallery with luminous artworks, quiet pacing, and a sense of entering a private exhibition after hours.
Probability: 0.07

### Theme Name: Sunlit Archive
Warm paper, daylight, archival labels, and a tactile editorial feeling inspired by artist books and modernist museums.
Probability: 0.04

### Theme Name: Raw Signal
Experimental black-and-white interface with sharp typographic interventions, cursor-led navigation, and sparse industrial materials.
Probability: 0.02

## Chosen approach: Nocturne Museum

### Design Movement
Contemporary digital brutalism softened by the spatial language of a nocturnal museum: dark planes, directional light, oversized typography, and deliberate negative space.

### Core Principles
1. **Enter before browsing.** The first interaction is a threshold: the visitor clicks into the gallery rather than being dropped into a dashboard.
2. **Light is the navigation system.** Artwork thumbnails, cursor halos, and active states use light pools instead of heavy borders or conventional cards.
3. **Quiet intensity.** The interface is sparse, but every object has material depth, grain, shadow, and a reason to move.
4. **Space over symmetry.** Content uses an asymmetric room-like composition rather than a centered marketing grid.

### Color Philosophy
The base is near-black charcoal (#141414), chosen to make artwork and light feel physical. Ivory (#f4efe5) carries the primary type and reads like a projected label. A small signature amber (#d7a85c) marks interaction and warmth; muted cobalt and rust live inside the generated art rather than competing with the chrome.

### Layout Paradigm
A full-viewport threshold screen transitions into a side-anchored exhibition layout. On desktop, navigation and status live on opposite edges while artwork is positioned in a loose spatial field. On mobile, the same system collapses into a vertical sequence with a persistent control rail and tap-friendly exploration cards.

### Signature Elements
- A thin amber light-line cursor and progress indicator that extend the reference's loading bar.
- A translucent glass museum label attached to the currently selected work.
- Subtle grain and spotlight gradients that create depth without decorative clutter.

### Interaction Philosophy
Interactions should feel like entering a room: click to cross the threshold, WASD/arrow keys to move, mouse drag to look, and a small control panel for night mode and performance. Hover states brighten and shift by a few pixels rather than popping with generic rounded buttons.

### Animation
The threshold fades in through a slow opacity and blur release. Artwork panels drift into place with 30–60ms staggered reveals. Hover states use 180ms ease-out transitions. The gallery camera uses gentle parallax and a restrained breathing spotlight. Reduced-motion users receive instant state changes and no continuous drift.

### Typography System
Display: **Cormorant Garamond**, 700 italic for the gallery title and room names. Interface: **DM Mono**, 400/500 for controls, coordinates, and labels. Supporting copy: **Manrope**, 400/500 for readable descriptions. Headings are large and sparse; metadata is compact, uppercase, and tracked.

### Brand Essence
A quiet interactive gallery for people who want to wander through art instead of scrolling past it. Personality: **cinematic, curious, tactile**.

### Brand Voice
Headlines are brief, evocative, and never generic. CTAs sound like invitations into a place, not software commands.

Example lines:
- “Step past the threshold.”
- “A room for looking slowly.”

### Wordmark & Logo
The mark is an ivory interlocking brush-stroke symbol with a small square aperture, paired with the italic serif wordmark “The Gallery” in Cormorant Garamond. The symbol must also work alone as a favicon and loading mark.

### Signature Brand Color
**Amber Beam — #D7A85C**, used sparingly for progress, focus, and active controls.

## Style Decisions
- Use generated gallery artwork as the prominent visual layer rather than generic stock photography.
- Keep the experience dark, spacious, and slightly asymmetrical; do not introduce generic card grids or purple gradients.
- The first viewport should preserve the reference's centered title and threshold interaction, while the explored state should visibly add the richer gallery system.

### Applied visual review amendments
- The threshold CTA is now “Step past the threshold” to make the first action feel like entering a room.
- The generated interlocking mark appears above the title and is reused as the favicon and header identity.
- The amber progress line now connects to a subtle local spotlight and mark glow, reinforcing light as navigation.
