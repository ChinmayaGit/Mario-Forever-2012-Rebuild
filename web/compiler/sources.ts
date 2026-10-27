import { readFileSync } from "node:fs";
import { join } from "node:path";

export const EXPORT_DIR = join(import.meta.dirname, "..", "..", "export");

export function readJson<T = any>(name: string): T {
  return JSON.parse(readFileSync(join(EXPORT_DIR, name), "utf8"));
}

export interface CodeUnit {
  id: string;
  src: string;
}

/** Every piece of GML in the game: scripts, object event actions, room and instance creation code. */
export function allCode(): { scripts: CodeUnit[]; events: CodeUnit[]; rooms: CodeUnit[] } {
  const scripts = readJson<any[]>("scripts.json").filter(Boolean).map((s) => ({
    id: s.name,
    src: readFileSync(join(EXPORT_DIR, "scripts", s.name.replace(/[^A-Za-z0-9_-]/g, "_") + ".gml"), "latin1"),
  }));
  const events: CodeUnit[] = [];
  for (const o of readJson<any[]>("objects.json")) {
    if (!o) continue;
    for (const e of o.events) {
      e.actions.forEach((a: any, n: number) => {
        if (a.lib === 1 && a.id === 603) events.push({ id: `${o.name}/${e.label}/${n}`, src: a.params[0] });
      });
    }
  }
  const rooms: CodeUnit[] = [];
  for (const r of readJson<any[]>("rooms.json")) {
    if (!r) continue;
    const room = readJson(join("rooms", r.file + ".json"));
    if (room.creation_code.trim()) rooms.push({ id: `room:${r.name}`, src: room.creation_code });
    for (const inst of room.instances) {
      if (inst.code.trim()) rooms.push({ id: `inst:${r.name}:${inst.id}`, src: inst.code });
    }
  }
  return { scripts, events, rooms };
}
