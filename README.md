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

Controls: arrows or WASD to move, Space jump, Q fire, Enter for menus. Keys can be changed in Settings (⚙,
top right), which also has on-screen touch controls (show/hide, size, opacity, drag to move) and fullscreen.

- **Save / Load**: on a world map the 💾 Save button downloads your progress as a `.json` file; LOAD GAME on
  the title menu restores it (for moving to another browser or device).
- **Multiplayer**: MULTIPLAYER on the title menu starts a peer-to-peer race. One player creates a room and
  shares the 5-letter code (the public PeerJS server is only used to connect), picks a stage, and both play it
  at once, seeing each other as a ghost. Score = coins × 50 + enemies (100–500 by type) + 3000 for finishing
  + a time bonus − 500 per death. Races never write to your saves.
- Changes to the original game code (menu entries, skipped intro screens, removed links) are listed in
  `web/compiler/patches.ts`.

## Layout

- `web/src/runtime/` – engine: room loading, GM8 frame order, collisions, drawing, input, audio, particles.
- `web/src/ui/` – web layer: loading screen, settings, touch controls, save download, multiplayer race.
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
