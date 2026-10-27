import { allCode, readJson } from "./sources.ts";
import { parse, type Expr, type Stmt } from "./parser.ts";

const { scripts, events, rooms } = allCode();
const assets = new Set<string>();
for (const f of ["objects.json", "sprites.json", "backgrounds.json", "scripts.json", "rooms.json", "sounds.json", "fonts.json"]) {
  for (const a of readJson<any[]>(f)) if (a) assets.add(a.name);
}
const read = new Map<string, number>();
const assigned = new Set<string>();
const calls = new Map<string, number>();
const globalvars = new Set<string>();
const fieldNames = new Set<string>();

function ex(e: Expr) {
  switch (e.k) {
    case "id": read.set(e.name, (read.get(e.name) ?? 0) + 1); break;
    case "field": ex(e.obj); fieldNames.add(e.name); break;
    case "index": ex(e.base); e.idx.forEach(ex); break;
    case "call": calls.set(e.name, (calls.get(e.name) ?? 0) + 1); e.args.forEach(ex); break;
    case "un": ex(e.e); break;
    case "bin": ex(e.a); ex(e.b); break;
  }
}
function target(e: Expr) {
  if (e.k === "id") assigned.add(e.name);
  else if (e.k === "index") { target(e.base); e.idx.forEach(ex); }
  else if (e.k === "field") { ex(e.obj); assigned.add(e.name); }
}
function st(s: Stmt) {
  switch (s.k) {
    case "block": s.body.forEach(st); break;
    case "var": s.names.forEach((n) => assigned.add(n)); break;
    case "globalvar": s.names.forEach((n) => { assigned.add(n); globalvars.add(n); }); break;
    case "assign": target(s.target); ex(s.value); break;
    case "expr": ex(s.e); break;
    case "if": ex(s.cond); st(s.then); if (s.else) st(s.else); break;
    case "while": ex(s.cond); st(s.body); break;
    case "do": st(s.body); ex(s.cond); break;
    case "for": st(s.init); ex(s.cond); st(s.step); st(s.body); break;
    case "repeat": ex(s.count); st(s.body); break;
    case "with": ex(s.target); st(s.body); break;
    case "switch": ex(s.e); s.body.forEach(st); break;
    case "case": ex(s.e); break;
    case "return": ex(s.e); break;
  }
}
for (const u of [...scripts, ...events, ...rooms]) parse(u.src).forEach(st);
const scriptNames = new Set(scripts.map((s) => s.id));
const unknown = [...read].filter(([n]) => !assigned.has(n) && !assets.has(n) && !/^argument\d*$/.test(n)).sort((a, b) => b[1] - a[1]);
console.log("globalvar:", [...globalvars]);
console.log("read-only identifiers:", unknown.map(([n, c]) => `${n}:${c}`).join(" "));
console.log("\nbuiltin calls:", [...calls].filter(([n]) => !scriptNames.has(n)).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n}:${c}`).join(" "));
const builtinAssigned = ["x", "y", "hspeed", "vspeed", "speed", "direction", "friction", "gravity", "gravity_direction", "image_index", "image_speed", "image_xscale", "image_yscale", "image_angle", "image_alpha", "image_blend", "sprite_index", "mask_index", "depth", "visible", "solid", "persistent", "alarm", "room_speed", "view_xview", "view_yview", "background_x", "background_y", "background_visible", "background_index", "room_caption", "view_object", "view_wview", "view_hview", "view_angle", "background_color", "background_alpha", "background_hspeed", "background_vspeed", "path_speed", "path_position", "path_scale", "show_score", "score", "lives", "health", "keyboard_string", "transition_kind", "transition_steps", "xstart", "ystart", "xprevious", "yprevious"];
console.log("\nassigned builtins:", builtinAssigned.filter((n) => assigned.has(n)).join(" "));
