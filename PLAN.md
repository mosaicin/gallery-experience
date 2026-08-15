# Game Plan: Darkland — Night Park Cube

## Concept

A fully original browser game inspired by the high-level premise of a dark amusement park: the player explores a compact cubic night park, collects three luminous memory shards, activates an original Archive House landmark, and reaches the exit before the park resets. No real people, Telegram branding, logos, channel screenshots, or copied posts are used.

## Risk Tasks

### 1. First-person exploration camera
- **Why isolated:** Pointer-lock and camera motion can silently fail in embedded browser contexts.
- **Approach:** Use a visible orbit/drag fallback and keyboard movement. Pointer lock is optional and activated only after a click.
- **Verify:** WASD movement, mouse drag/orbit, and reset key all respond; the game remains playable without pointer lock.

### 2. Procedural cubic park layout
- **Why isolated:** Repeated boxes can create unclear collision and navigation.
- **Approach:** Use a fixed deterministic layout with explicit floor, walls, landmarks, shard pedestals, and a goal gate.
- **Verify:** All three shards are reachable; player cannot leave the park; the goal opens only after collection.

### 3. State-driven quest flow
- **Why isolated:** Collection, activation, completion, and reset states can desynchronise UI and world objects.
- **Approach:** Use explicit states: `explore`, `charged`, `complete`. A single GameWorld owns transitions and emits a compact HUD snapshot.
- **Verify:** Each shard increments the counter once, the Archive House changes state at 3/3, and completion is shown exactly once.

## Main Build

- **Assets needed:** Procedural cube geometry, generated visual reference/art direction, simple original texture accents, emissive shard materials, original icon-like UI marks.
- **Camera:** Third-person/over-shoulder orbit camera with drag fallback and keyboard movement.
- **World:** Small walled night park with a central Archive House, three themed zones, a gate, lamps, benches, and cubic signage.
- **Interaction:** Walk near a shard and press `E` to collect it. After all three are found, enter the six-digit archive code `251463` with keys `1–6`; press `R` to reset. The six labels are fictional universal principles: Mercy, Inquiry, Balance, Remembrance, Care, and Choice.
- **Verify:**
  - Movement direction matches input and camera orientation.
  - All collectibles, gate, and landmarks use visible materials with no missing textures.
  - UI remains readable at desktop and mobile widths.
  - Game flow reaches completion without console errors.
  - The `?demo` mode shows a deterministic tour path for screenshot verification.
  - The game remains original and does not imply endorsement or ownership by the referenced channels.\n  - No sacred quotations or religious figures are used; the lock is a fictional puzzle about universal values.
