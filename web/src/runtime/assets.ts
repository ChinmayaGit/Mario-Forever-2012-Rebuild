export interface Mask {
  w: number; h: number; l: number; r: number; t: number; b: number;
  bits: Uint8Array; off: number;
}

export interface Frame {
  src: TexImageSource;
  /** Source rectangle within `src` (sprite strips share one image). */
  sx: number; sy: number; w: number; h: number;
  tex?: WebGLTexture | null;
}

export class Sprite {
  name: string;
  frames: Frame[] = [];
  w = 0; h = 0; ox = 0; oy = 0;
  sep = false;
  bbox = { l: 0, r: 0, t: 0, b: 0 };
  masks: Mask[] = [];
  /** Deferred mask generation for runtime-loaded sprites. */
  pendingMasks: (() => void) | null = null;
  constructor(name: string) { this.name = name; }
  ensureMasks() {
    if (this.pendingMasks) { const f = this.pendingMasks; this.pendingMasks = null; f(); }
  }
  maskFor(imageIndex: number): Mask | undefined {
    this.ensureMasks();
    if (!this.masks.length) return undefined;
    if (!this.sep) return this.masks[0];
    const n = this.masks.length;
    return this.masks[((Math.floor(imageIndex) % n) + n) % n];
  }
}

export function maskHit(m: Mask, x: number, y: number): boolean {
  if (x < m.l || y < m.t || x > m.r || y > m.b) return false;
  const i = y * m.w + x;
  return (m.bits[m.off + (i >> 3)] & (1 << (i & 7))) !== 0;
}

export class Background {
  name: string;
  w = 0; h = 0;
  frame: Frame | null = null;
  constructor(name: string) { this.name = name; }
}

export interface ObjectDef {
  name: string; sprite: number; mask: number; parent: number;
  solid: boolean; visible: boolean; depth: number; persistent: boolean;
}

export interface Manifest {
  roomOrder: number[];
  rooms: ({ name: string } | null)[];
  objects: (ObjectDef | null)[];
  sprites: any[];
  backgrounds: any[];
  gfxFiles: string[];
  binaryFiles: string[];
  unsupportedAudio: string[];
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("failed to load " + url));
    img.src = url;
  });
}

/** Build GM8.1 precise masks from RGBA pixel data (sprite_add / sprite_replace). */
export function preciseMasks(frames: Uint8ClampedArray[], w: number, h: number): Mask[] {
  const bits = new Uint8Array((w * h + 7) >> 3);
  for (const px of frames) {
    for (let i = 0; i < w * h; i++) if (px[i * 4 + 3] > 0) bits[i >> 3] |= 1 << (i & 7);
  }
  const hit = (x: number, y: number) => (bits[(y * w + x) >> 3] & (1 << ((y * w + x) & 7))) !== 0;
  let l = w - 1, r = 0, t = h - 1, b = 0;
  for (let x = 0; x < w; x++) {
    let found = -1;
    for (let y = 0; y < h; y++) if (hit(x, y)) { found = y; break; }
    if (found >= 0) { l = x; t = found; break; }
  }
  for (let y = 0; y < t; y++) {
    let any = false;
    for (let x = l + 1; x < w; x++) if (hit(x, y)) { any = true; break; }
    if (any) { t = y; break; }
  }
  for (let x = w - 1; x >= l; x--) {
    let found = -1;
    for (let y = h - 1; y >= t; y--) if (hit(x, y)) { found = y; break; }
    if (found >= 0) { r = x; b = found; break; }
  }
  for (let y = h - 1; y > b; y--) {
    let any = false;
    for (let x = l; x <= r; x++) if (hit(x, y)) { any = true; break; }
    if (any) { b = y; break; }
  }
  return [{ w, h, l, r, t, b, bits, off: 0 }];
}

/** GM8.1 sprite_add image processing: fill fully-transparent, remove background, smooth edges. */
export function processImage(px: Uint8ClampedArray, w: number, h: number, removeback: boolean, smooth: boolean) {
  let allClear = true;
  for (let i = 3; i < px.length; i += 4) if (px[i] !== 0) { allClear = false; break; }
  if (allClear) for (let i = 3; i < px.length; i += 4) px[i] = 255;
  if (removeback) {
    const bl = (h - 1) * w * 4;
    const r = px[bl], g = px[bl + 1], b = px[bl + 2];
    for (let i = 0; i < px.length; i += 4) if (px[i] === r && px[i + 1] === g && px[i + 2] === b) px[i + 3] = 0;
  }
  if (smooth) {
    const a = (x: number, y: number) => (y * w + x) * 4 + 3;
    const clear: number[] = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[a(x, y)] === 0) clear.push(x, y);
    for (let i = 0; i < clear.length; i += 2) {
      const cx = clear[i], cy = clear[i + 1];
      for (let y = Math.max(0, cy - 1); y < Math.min(h, cy + 2); y++)
        for (let x = Math.max(0, cx - 1); x < Math.min(w, cx + 2); x++) if (px[a(x, y)] >= 32) px[a(x, y)] -= 32;
    }
  }
}
