# Mario-Forever-2012-Rebuild

A browser port of *New Super Mario Forever 2012* (GameMaker 8.1). The original GML is compiled to
JavaScript and runs on a small GM8-compatible engine (WebGL2 + Web Audio).

## Play

```sh
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in web/dist
```

Controls: arrows to move, Z jump, X fire, Enter for menus.

## Layout

- `web/src/runtime/` – engine: room loading, GM8 frame order, collisions, drawing, input, audio, particles.
- `web/compiler/` – GML parser and JavaScript code generator.
- `web/src/generated/game.js` – compiled game code.
- `web/public/` – game assets (sprites, backgrounds, rooms, music, sounds).
- `export/` – scripts, objects and rooms exported from the original game; input to the compiler.
- `tools/` – `gm8export` (Rust, uses OpenGMK's `gm8exe`) and `decode_gfx.py` for re-exporting from the original exe.

After changing the compiler or runtime asset handling, run `npm run build:data` in `web/` to regenerate
`web/public/assets` and `game.js`.

## Known gaps

- PlayStation `.psf` music tracks and `.snd` sound effects have no browser decoder.
- `path_start` uses a simplified straight-line follower.

Fan project; Mario characters and assets belong to Nintendo.
