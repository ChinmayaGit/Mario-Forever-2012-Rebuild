// In-memory file system for GML file_bin_* calls. Files listed in the manifest are preloaded from the
// server; anything written is persisted to localStorage so settings and save slots survive reloads.

const PREFIX = "mf2012:file:";

function norm(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
}

interface Handle { path: string; data: Uint8Array; len: number; pos: number; dirty: boolean }

export class VFS {
  files = new Map<string, Uint8Array>();
  handles = new Map<number, Handle>();
  next = 1;

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
    if (/^data\/gfx\/(groundstomp\.png|beetlee(_h|_m)?\.jpg)$/.test(h.path)) {
      let s = "";
      for (const b of data) s += String.fromCharCode(b);
      localStorage.setItem(PREFIX + h.path, btoa(s));
    }
  }
}
