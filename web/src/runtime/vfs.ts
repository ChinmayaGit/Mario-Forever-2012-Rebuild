// In-memory file system for GML file_bin_* calls. Files listed in the manifest are preloaded from the
// server; anything written is persisted to localStorage so settings and save slots survive reloads.

const PREFIX = "mf2012:file:";

function norm(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
}

interface Handle { path: string; data: Uint8Array; len: number; pos: number; dirty: boolean }

export const SAVE_FORMAT = "mario-forever-2012-save";

/** Every persisted save/settings file, base64-encoded, for download. */
export function exportSaves(): { format: string; version: number; date: string; files: Record<string, string> } {
  const files: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (k.startsWith(PREFIX)) files[k.slice(PREFIX.length)] = localStorage.getItem(k)!;
  }
  return { format: SAVE_FORMAT, version: 1, date: new Date().toISOString(), files };
}

/** Replace the persisted saves with a downloaded save file. Returns the number of files restored. */
export function importSaves(json: unknown): number {
  const d = json as ReturnType<typeof exportSaves>;
  if (!d || d.format !== SAVE_FORMAT || typeof d.files !== "object") throw new Error("This is not a Mario Forever 2012 save file.");
  const entries = Object.entries(d.files).filter(([k, v]) => typeof v === "string" && /^data\/gfx\/[\w.-]+$/.test(k));
  if (!entries.length) throw new Error("The save file is empty.");
  entries.forEach(([, v]) => atob(v));
  for (const k of Object.keys(localStorage)) if (k.startsWith(PREFIX)) localStorage.removeItem(k);
  for (const [k, v] of entries) localStorage.setItem(PREFIX + k, v);
  return entries.length;
}

export class VFS {
  files = new Map<string, Uint8Array>();
  handles = new Map<number, Handle>();
  next = 1;
  /** When false, writes stay in memory (multiplayer races must not touch the player's saves). */
  persist = true;

  async preload(paths: string[]) {
    await Promise.all(paths.map(async (p) => {
      const key = norm(p);
      const saved = localStorage.getItem(PREFIX + key);
      if (saved != null) {
        this.files.set(key, Uint8Array.from(atob(saved), (c) => c.charCodeAt(0)));
        return;
      }
      const r = await fetch(p);
      if (r.ok) this.files.set(key, new Uint8Array(await r.arrayBuffer()));
    }));
  }

  exists(path: string) { return this.files.has(norm(path)); }

  rename(from: string, to: string) {
    const a = norm(from), b = norm(to);
    const d = this.files.get(a);
    if (!d) return 0;
    this.files.delete(a);
    this.files.set(b, d);
    return 1;
  }

  open(path: string, mode: number): number {
    const key = norm(path);
    let data = this.files.get(key);
    if (!data || mode === 1) data = new Uint8Array(0);
    const h: Handle = { path: key, data: data.slice(), len: data.length, pos: 0, dirty: mode === 1 };
    const id = this.next++;
    this.handles.set(id, h);
    return id;
  }

  seek(id: number, pos: number) {
    const h = this.handles.get(id);
    if (h) h.pos = Math.max(0, Math.floor(pos));
  }

  readByte(id: number): number {
    const h = this.handles.get(id);
    if (!h || h.pos >= h.len) return 0;
    return h.data[h.pos++];
  }

  writeByte(id: number, v: number) {
    const h = this.handles.get(id);
    if (!h) return;
    if (h.pos >= h.data.length) {
      const grown = new Uint8Array(Math.max(16, (h.pos + 1) * 2));
      grown.set(h.data);
      h.data = grown;
    }
    h.data[h.pos++] = ((Math.round(v) % 256) + 256) % 256;
    h.len = Math.max(h.len, h.pos);
    h.dirty = true;
  }

  close(id: number) {
    const h = this.handles.get(id);
    if (!h) return;
    this.handles.delete(id);
    if (!h.dirty) return;
    const data = h.data.slice(0, h.len);
    this.files.set(h.path, data);
    // Only real save/settings files are worth persisting; scratch writes to decoded sprites are not.
    if (this.persist && /^data\/gfx\/(groundstomp\.png|beetlee(_h|_m)?\.jpg)$/.test(h.path)) {
      let s = "";
      for (const b of data) s += String.fromCharCode(b);
      localStorage.setItem(PREFIX + h.path, btoa(s));
    }
  }
}
