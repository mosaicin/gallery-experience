# Darkland Cube Network

## Room network

The game uses a deterministic 3×3×2 network of twelve cubic rooms. Each room has a coordinate `(x, y, z)`, four visible portals, one short memory fragment, and a color-coded abstract lock. The player can move through a portal only after the room transition animation completes.

| Room | Story fragment | Gate principle |
|---|---|---|
| 000 | The park opens after the last light turns on. | Choice |
| 100 | A notebook records a route that has not happened yet. | Inquiry |
| 200 | The river repeats the same reflection with a different sky. | Remembrance |
| 010 | A workshop keeps tools arranged for an absent hand. | Care |
| 110 | A house of portraits shows only empty frames. | Balance |
| 210 | A clock measures pauses rather than minutes. | Mercy |
| 001 | A red door opens onto a room with no walls. | Choice |
| 101 | Three lamps illuminate three possible memories. | Inquiry |
| 201 | A silent archive stores the player's previous routes. | Remembrance |
| 011 | A suspended bridge moves one block at a time. | Balance |
| 111 | The digital lock accepts a sequence of universal values. | Care |
| 211 | The exit is a clean white cube beyond the park. | Mercy |

## CAD-like movement

The current room remains fixed while the next room slides along a single axis. The camera follows the room's transform for 420 milliseconds with a cubic ease-in-out curve. The player cannot move or trigger a second transition while `transitioning` is true. This gives the feeling of editing a solid model: select a face, move one module, and reveal the next coordinate.

## Digital exit

The exit does not reproduce a religious book or sacred page. Each room contains an invented glyph and a universal theme. The final code is generated from the order in which the player restores six themes: Mercy, Inquiry, Balance, Remembrance, Care, and Choice. The player enters the resulting six digits on a digital lock. A wrong prefix clears the buffer without punishment.

## Sound

Audio is unlocked after the first click. The implementation uses Web Audio oscillators and gain envelopes rather than shipping copyrighted recordings: a low room hum, a short filtered slide tone during a cube transition, a soft pulse on shard collection, and a clean two-note resolution on exit. The sound system must respect a mute toggle and `prefers-reduced-motion` does not disable audio automatically.
