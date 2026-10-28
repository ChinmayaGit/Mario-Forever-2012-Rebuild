// Builds web/public from the exported GM8 project (../export) and the game's loose data folder.
// Run after tools/bin/gm8export and tools/decode_gfx.py. Binary assets are only refreshed when their
// source exists (content/ and export's image folders are not in git); otherwise web/public is kept as is.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { REMOVED_OBJECTS } from "../compiler/patches.ts";

const ROOT = join(import.meta.dirname, "..", "..");
const EXPORT = join(ROOT, "export");
const CONTENT = join(ROOT, "content");
const PUBLIC = join(import.meta.dirname, "..", "public");
const ASSETS = join(PUBLIC, "assets");

const read = (p: string) => JSON.parse(readFileSync(join(EXPORT, p), "utf8"));
const objectsRaw: any[] = read("objects.json");
const spritesRaw: any[] = read("sprites.json");
const bgsRaw: any[] = read("backgrounds.json");
const roomsRaw: any[] = read("rooms.json");
const fontsRaw: any[] = read("fonts.json");
const game = read("game.json");

const index = (list: any[]) => new Map(list.filter(Boolean).map((a) => [a.name, a.index]));
const objIdx = index(objectsRaw), sprIdx = index(spritesRaw), bgIdx = index(bgsRaw), roomIdx = index(roomsRaw);
const ref = (m: Map<string, number>, n: string | null) => (n == null ? -1 : m.get(n) ?? -1);

rmSync(join(ASSETS, "rooms"), { recursive: true, force: true });
mkdirSync(join(ASSETS, "rooms"), { recursive: true });

/** Replace dst with src when src is available. */
const refresh = (src: string, dst: string) => {
  if (!existsSync(src)) return;
  rmSync(dst, { recursive: true, force: true });
  cpSync(src, dst, { recursive: true });
};

const objects = objectsRaw.map((o) => o && {
  name: o.name, sprite: ref(sprIdx, o.sprite), mask: ref(sprIdx, o.mask), parent: ref(objIdx, o.parent),
  solid: o.solid, visible: o.visible, depth: o.depth, persistent: o.persistent,
});
const sprites = spritesRaw.map((s) => {
  if (!s) return null;
  const m = s.masks;
  const bbox = m.length
    ? { l: Math.min(...m.map((c: any) => c.left)), r: Math.max(...m.map((c: any) => c.right)), t: Math.min(...m.map((c: any) => c.top)), b: Math.max(...m.map((c: any) => c.bottom)) }
    : { l: 0, r: 0, t: 0, b: 0 };
  return {
    name: s.name, dir: s.dir, frames: s.frames, w: s.width, h: s.height, ox: s.origin_x, oy: s.origin_y,
    sep: s.per_frame_masks, bbox,
    masks: m.map((c: any) => ({ w: c.w, h: c.h, l: c.left, r: c.right, t: c.top, b: c.bottom, off: c.offset })),
  };
});
const backgrounds = bgsRaw.map((b) => b && { name: b.name, file: b.file, w: b.width, h: b.height });

for (const r of roomsRaw) {
  if (!r) continue;
  const room = read(join("rooms", r.file + ".json"));
  const out = {
    name: room.name, caption: room.caption, w: room.width, h: room.height, speed: room.speed,
    persistent: room.persistent, colour: parseInt(room.bg_colour.slice(0, 6), 16), clear: room.clear_screen,
    hasCode: !!room.creation_code.trim(),
    backgrounds: room.backgrounds.map((b: any) => ({ ...b, bg: ref(bgIdx, b.bg) })),
    viewsEnabled: room.views_enabled,
    views: room.views.map((v: any) => ({ ...v, follow: ref(objIdx, v.follow) })),
    instances: room.instances.filter((i: any) => i.obj != null && !REMOVED_OBJECTS.includes(i.obj)).map((i: any) => ({
      x: i.x, y: i.y, obj: objIdx.get(i.obj), id: i.id, code: i.code.trim() ? 1 : 0,
      ...(i.xscale !== 1 ? { xs: i.xscale } : {}), ...(i.yscale !== 1 ? { ys: i.yscale } : {}),
      ...(i.angle ? { a: i.angle } : {}), ...(i.blend !== 0xffffffff ? { c: i.blend } : {}),
    })),
    tiles: room.tiles.filter((t: any) => t.bg != null).map((t: any) => [
      t.x, t.y, bgIdx.get(t.bg), t.tx, t.ty, t.w, t.h, t.depth, t.id, t.xscale, t.yscale, t.blend,
    ]),
  };
  writeFileSync(join(ASSETS, "rooms", r.index + ".json"), JSON.stringify(out));
}

refresh(join(EXPORT, "sprites"), join(ASSETS, "sprites"));
refresh(join(EXPORT, "backgrounds"), join(ASSETS, "backgrounds"));
refresh(join(EXPORT, "masks.bin"), join(ASSETS, "masks.bin"));

// Loose data folder: decoded gfx plus the original music, sounds and title images.
const DATA = join(PUBLIC, "data");
refresh(join(EXPORT, "gfx"), join(DATA, "gfx"));
for (const d of ["m", "s", "t"]) refresh(join(CONTENT, "data", d), join(DATA, d));

// PSF/PSF2 (PlayStation) tracks can't be decoded in the browser; transcode them when ffmpeg can.
const psf = readdirSync(join(DATA, "m")).filter((f) => /\.psf2?$/i.test(f));

// Playable stages per world, taken from the map buttons (multiplayer level picker). Item shops (DOME) are skipped.
const levels: { map: number; room: number; name: string; title: string }[] = [];
for (let map = 1; map <= 8; map++) {
  const seen = new Set<number>();
  for (const i of read(join("rooms", `room_map_${map}.json`)).instances) {
    if (i.obj !== "o_button_map_1") continue;
    const target = /goto_level\s*=\s*(room_\w+)/.exec(i.code)?.[1];
    const room = target && !target.startsWith("room_DOME") ? roomIdx.get(target) : undefined;
    if (room === undefined || seen.has(room)) continue;
    seen.add(room);
    const field = (k: string) => new RegExp(`${k}\\s*=\\s*"([^"]*)"`).exec(i.code)?.[1] ?? "";
    levels.push({ map, room, name: field("level_name"), title: field("levek_full_name").replace(/_/g, " ").replace(/\//g, "'") || target!.replace(/^room_/, "") });
  }
}

const manifest = {
  roomOrder: game.room_order.map((n: string) => roomIdx.get(n)),
  levels,
  rooms: roomsRaw.map((r) => r && { name: r.name }),
  objects, sprites, backgrounds,
  fonts: fontsRaw,
  gfxFiles: readdirSync(join(DATA, "gfx")).sort(),
  binaryFiles: ["data/gfx/groundstomp.png", "data/gfx/beetlee.jpg", "data/gfx/beetlee_h.jpg", "data/gfx/beetlee_m.jpg"],
  unsupportedAudio: psf,
};
writeFileSync(join(ASSETS, "manifest.json"), JSON.stringify(manifest));
console.log(`public/ built: ${objects.length} objects, ${sprites.length} sprites, ${backgrounds.length} backgrounds, ${roomsRaw.length} rooms`);
console.log(`psf tracks without a browser decoder: ${psf.join(", ")}`);

execFileSync(process.execPath, [join(import.meta.dirname, "..", "compiler", "compile.ts")], { stdio: "inherit" });
