import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Codegen } from "./codegen.ts";
import { parse } from "./parser.ts";
import { allCode, readJson } from "./sources.ts";
import { FUNCTIONS } from "../src/runtime/function-names.ts";

const OUT = join(import.meta.dirname, "..", "src", "generated");

const assets = new Map<string, number>();
const collisions: string[] = [];
for (const f of ["objects", "sprites", "sounds", "backgrounds", "scripts", "fonts", "rooms"]) {
  for (const a of readJson<any[]>(f + ".json")) {
    if (!a) continue;
    if (assets.has(a.name)) collisions.push(`${f}:${a.name}`);
    else assets.set(a.name, a.index);
  }
}

const { scripts, events, rooms } = allCode();
const scriptNames = new Set(scripts.map((s) => s.id));
const gen = new Codegen({ assets, scripts: scriptNames, functions: new Set(FUNCTIONS) });
const errors: string[] = [];

function compileUnit(id: string, src: string, isScript: boolean): string {
  let body: string;
  try {
    body = gen.fn(parse(src));
  } catch (e) {
    errors.push(`${id}: ${(e as Error).message}`);
    body = "return 0;";
  }
  try {
    new Function("s", "o", "a", body);
  } catch (e) {
    errors.push(`${id}: generated JS invalid: ${(e as Error).message}`);
    body = "return 0;";
  }
  return `function(s,o,a){${body}}`;
}

const objects = readJson<any[]>("objects.json");
const objIndex = new Map(objects.filter(Boolean).map((o) => [o.name, o.index]));
const parts: string[] = [];
parts.push("// Generated from the original GML by web/compiler/compile.ts. Do not edit.");
parts.push("export function install(rt,R,G,F,S,E,RC,IC){");
for (const s of scripts) {
  parts.push(`if(!S.${s.id})S.${s.id}=${compileUnit(s.id, s.src, true)};`);
}

// Object events: one function per event, the event's code actions concatenated in order.
const byEvent = new Map<string, string[]>();
for (const u of events) {
  const [obj, label] = u.id.split("/");
  const key = `${obj}/${label}`;
  if (!byEvent.has(key)) byEvent.set(key, []);
  byEvent.get(key)!.push(u.src);
}
for (const o of objects) {
  if (!o) continue;
  const entries: string[] = [];
  for (const e of o.events) {
    const srcs = byEvent.get(`${o.name}/${e.label}`) ?? [];
    const fns = srcs.map((src, n) => compileUnit(`${o.name}/${e.label}/${n}`, src, false));
    const key = `${e.type_id}:${e.sub}`;
    if (fns.length === 1) entries.push(`"${key}":${fns[0]}`);
    else if (fns.length > 1) entries.push(`"${key}":rt.seq([${fns.join(",")}])`);
    else entries.push(`"${key}":rt.noop`);
  }
  parts.push(`E[${o.index}]={${entries.join(",\n")}};`);
}

const roomIndex = new Map(readJson<any[]>("rooms.json").filter(Boolean).map((r) => [r.name, r.index]));
for (const u of rooms) {
  const [kind, room, inst] = u.id.split(":");
  const fn = compileUnit(u.id, u.src, false);
  if (kind === "room") parts.push(`RC[${roomIndex.get(room)}]=${fn};`);
  // Instance ids are not unique across rooms (copied rooms keep them), so key by room as well.
  else parts.push(`IC["${roomIndex.get(room)}:${inst}"]=${fn};`);
}
parts.push("}");

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "game.js"), parts.join("\n"));
writeFileSync(join(OUT, "game.d.ts"), "export function install(...args: any[]): void;\n");
console.log(`compiled ${scripts.length} scripts, ${events.length} event actions, ${rooms.length} room/instance codes`);
console.log(`asset name collisions: ${collisions.join(", ") || "none"}`);
console.log(`errors: ${errors.length}\n${errors.slice(0, 30).join("\n")}`);
const unknown = [...gen.unknownFns].sort();
console.log(`unimplemented functions (${unknown.length}): ${unknown.join(" ")}`);
void objIndex;
