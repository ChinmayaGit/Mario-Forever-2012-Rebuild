import type { Frame } from "./assets.ts";
import type { Game } from "./game.ts";

const DEG = Math.PI / 180;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class PartType {
  shape = 0;
  sprite = -1; spriteAnimate = false; spriteStretch = false; spriteRandom = false;
  sizeMin = 1; sizeMax = 1; sizeIncr = 0; sizeWiggle = 0;
  xscale = 1; yscale = 1;
  angMin = 0; angMax = 0; angIncr = 0; angWiggle = 0; angRelative = false;
  colourMode = 0; colours = [0xffffff, 0xffffff, 0xffffff];
  alphas = [1, 1, 1];
  additive = false;
  lifeMin = 100; lifeMax = 100;
  speedMin = 0; speedMax = 0; speedIncr = 0; speedWiggle = 0;
  dirMin = 0; dirMax = 0; dirIncr = 0; dirWiggle = 0;
  gravAmount = 0; gravDir = 270;
}

interface Particle {
  t: PartType;
  x: number; y: number;
  speed: number; dir: number;
  size: number; ang: number;
  life: number; maxLife: number;
  colour: number; frame: number;
  wig: number;
}

export class PartSystem {
  depth = 0;
  auto = true;
  autoDraw = true;
  parts: Particle[] = [];
  emitters: { x1: number; y1: number; x2: number; y2: number; shape: number; distr: number }[] = [];
}

const lerpColour = (a: number, b: number, t: number) => {
  const c = (s: number) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return c(0) | (c(8) << 8) | (c(16) << 16);
};

export class Particles {
  game: Game;
  types: PartType[] = [];
  systems: (PartSystem | null)[] = [];
  shapes: Frame[] = [];
  effectsBelow: PartSystem;
  effectsAbove: PartSystem;

  constructor(game: Game) {
    this.game = game;
    this.shapes = makeShapes();
    this.effectsBelow = this.createSystem(100000);
    this.effectsAbove = this.createSystem(-100000);
  }

  createSystem(depth = 0): PartSystem {
    const s = new PartSystem();
    s.depth = depth;
    this.systems.push(s);
    this.game.depthDirty = true;
    return s;
  }
  sysId(s: PartSystem) { return this.systems.indexOf(s); }
  sys(id: number) { return this.systems[id] ?? null; }

  create(sysId: number, x: number, y: number, typeId: number, n: number, colour = -1) {
    const s = this.sys(sysId), t = this.types[typeId];
    if (!s || !t) return;
    for (let i = 0; i < n; i++) this.spawn(s, t, x, y, colour);
  }

  spawn(s: PartSystem, t: PartType, x: number, y: number, colour = -1) {
    const life = Math.round(rand(t.lifeMin, t.lifeMax));
    const spr = this.game.assets.sprites[t.sprite];
    let c = t.colours[0];
    if (colour >= 0) c = colour;
    else if (t.colourMode === 1) c = lerpColour(t.colours[0], t.colours[1], Math.random());
    s.parts.push({
      t, x, y, speed: rand(t.speedMin, t.speedMax), dir: rand(t.dirMin, t.dirMax),
      size: rand(t.sizeMin, t.sizeMax), ang: rand(t.angMin, t.angMax), life, maxLife: life,
      colour: c, frame: spr && t.spriteRandom ? Math.floor(Math.random() * spr.frames.length) : 0, wig: Math.random() * 2 - 1,
    });
  }

  burst(sysId: number, emId: number, typeId: number, n: number) {
    const s = this.sys(sysId), t = this.types[typeId];
    const e = s?.emitters[emId];
    if (!s || !t || !e) return;
    let count = n;
    if (n < 0) count = Math.random() * -n < 1 ? 1 : 0;
    for (let i = 0; i < count; i++) {
      let u = Math.random(), v = Math.random();
      if (e.distr === 1) { u = gauss(); v = gauss(); }
      if (e.shape === 1) {
        let dx: number, dy: number;
        do { dx = Math.random() * 2 - 1; dy = Math.random() * 2 - 1; } while (dx * dx + dy * dy > 1);
        u = (dx + 1) / 2; v = (dy + 1) / 2;
      } else if (e.shape === 3) v = u;
      this.spawn(s, t, e.x1 + (e.x2 - e.x1) * u, e.y1 + (e.y2 - e.y1) * v);
    }
  }

  update(s: PartSystem) {
    const out: Particle[] = [];
    for (const p of s.parts) {
      p.life--;
      if (p.life <= 0) continue;
      const t = p.t;
      p.speed = Math.max(0, p.speed + t.speedIncr + t.speedWiggle * Math.sin(p.life * 0.5) * p.wig);
      p.dir += t.dirIncr + t.dirWiggle * Math.sin(p.life * 0.5) * p.wig;
      let hx = Math.cos(p.dir * DEG) * p.speed, hy = -Math.sin(p.dir * DEG) * p.speed;
      if (t.gravAmount) {
        hx += Math.cos(t.gravDir * DEG) * t.gravAmount;
        hy -= Math.sin(t.gravDir * DEG) * t.gravAmount;
        p.speed = Math.hypot(hx, hy);
        p.dir = Math.atan2(-hy, hx) / DEG;
      }
      p.x += hx; p.y += hy;
      p.size = Math.max(0, p.size + t.sizeIncr + t.sizeWiggle * Math.sin(p.life * 0.5) * p.wig);
      p.ang += t.angIncr + t.angWiggle * Math.sin(p.life * 0.5) * p.wig;
      out.push(p);
    }
    s.parts = out;
  }

  draw(s: PartSystem) {
    const r = this.game.renderer;
    for (const p of s.parts) {
      const t = p.t;
      const life = 1 - p.life / Math.max(1, p.maxLife);
      let alpha: number;
      if (life < 0.5) alpha = t.alphas[0] + (t.alphas[1] - t.alphas[0]) * life * 2;
      else alpha = t.alphas[1] + (t.alphas[2] - t.alphas[1]) * (life - 0.5) * 2;
      let colour = p.colour;
      if (t.colourMode === 2) colour = lerpColour(t.colours[0], t.colours[1], life);
      else if (t.colourMode === 3) colour = life < 0.5 ? lerpColour(t.colours[0], t.colours[1], life * 2) : lerpColour(t.colours[1], t.colours[2], (life - 0.5) * 2);
      r.setBlendMode(t.additive ? 1 : 0);
      const angle = p.ang + (t.angRelative ? p.dir : 0);
      const spr = this.game.assets.sprites[t.sprite];
      let f: Frame | undefined, ox: number, oy: number;
      if (spr && spr.frames.length) {
        let fi = p.frame;
        if (t.spriteAnimate) fi = t.spriteStretch ? Math.floor(life * spr.frames.length) : p.frame + (p.maxLife - p.life);
        f = spr.frames[((fi % spr.frames.length) + spr.frames.length) % spr.frames.length];
        ox = spr.ox; oy = spr.oy;
      } else {
        f = this.shapes[t.shape] ?? this.shapes[0];
        ox = f.w / 2; oy = f.h / 2;
      }
      r.drawFrame(f, 0, 0, f.w, f.h, p.x, p.y, -ox, -oy, p.size * t.xscale, p.size * t.yscale, angle, colour, alpha);
    }
    r.setBlendMode(this.game.blendMode);
  }

  /** GM8 effect_create_above/below: built-in effect presets. */
  effect(above: boolean, kind: number, x: number, y: number, size: number, colour: number) {
    const s = above ? this.effectsAbove : this.effectsBelow;
    const t = new PartType();
    const sz = [0.5, 1, 2][size] ?? 1;
    t.colours = [colour, colour, colour];
    switch (kind) {
      case 4: case 5: // smoke, smokeup
        t.shape = 12; t.lifeMin = t.lifeMax = 25 * sz; t.sizeMin = t.sizeMax = 0.4 * sz; t.sizeIncr = -0.01;
        t.alphas = [0.6, 0.4, 0]; if (kind === 5) { t.speedMin = t.speedMax = 2; t.dirMin = t.dirMax = 90; }
        for (let i = 0; i < 6 * sz; i++) this.spawn(s, t, x + rand(-10, 10) * sz, y + rand(-10, 10) * sz);
        return;
      case 8: // flare
        t.shape = 8; t.lifeMin = t.lifeMax = 20; t.sizeMin = t.sizeMax = sz; t.sizeIncr = -0.05 * sz; t.additive = true;
        this.spawn(s, t, x, y);
        return;
      default:
        t.shape = 10; t.lifeMin = t.lifeMax = 20; t.sizeMin = t.sizeMax = 0.5 * sz; t.sizeIncr = 0.02;
        t.alphas = [1, 0.6, 0]; t.additive = true;
        this.spawn(s, t, x, y);
    }
  }
}

function gauss() {
  let s = 0;
  for (let i = 0; i < 6; i++) s += Math.random();
  return s / 6;
}

/** Procedural stand-ins for GM8's built-in particle shape textures (64x64). */
function makeShapes(): Frame[] {
  const size = 64;
  const draw = (fn: (c: CanvasRenderingContext2D) => void): Frame => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = size;
    const c = cv.getContext("2d")!;
    c.fillStyle = c.strokeStyle = "#fff";
    fn(c);
    return { src: cv, sx: 0, sy: 0, w: size, h: size };
  };
  const radial = (inner: number, outer: number, soft = true) => draw((c) => {
    const g = c.createRadialGradient(32, 32, inner, 32, 32, outer);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, soft ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)");
    c.fillStyle = g;
    c.beginPath(); c.arc(32, 32, outer, 0, Math.PI * 2); c.fill();
  });
  const cloud = (n: number, alpha: number) => draw((c) => {
    for (let i = 0; i < n; i++) {
      const x = 32 + (Math.random() - 0.5) * 24, y = 32 + (Math.random() - 0.5) * 24, r = 8 + Math.random() * 12;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
  });
  return [
    draw((c) => c.fillRect(31, 31, 2, 2)), // pixel
    draw((c) => { c.beginPath(); c.arc(32, 32, 30, 0, Math.PI * 2); c.fill(); }), // disk
    draw((c) => c.fillRect(2, 2, 60, 60)), // square
    draw((c) => c.fillRect(0, 30, 64, 4)), // line
    draw((c) => { c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 12 : 30, a = (i * Math.PI) / 5 - Math.PI / 2; c.lineTo(32 + r * Math.cos(a), 32 + r * Math.sin(a)); } c.fill(); }), // star
    draw((c) => { c.lineWidth = 4; c.beginPath(); c.arc(32, 32, 28, 0, Math.PI * 2); c.stroke(); }), // circle
    radial(20, 30), // ring
    radial(0, 30), // sphere
    radial(0, 32), // flare
    draw((c) => { c.lineWidth = 2; for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; c.beginPath(); c.moveTo(32, 32); c.lineTo(32 + 30 * Math.cos(a), 32 + 30 * Math.sin(a)); c.stroke(); } }), // spark
    cloud(10, 0.9), // explosion
    cloud(8, 0.5), // cloud
    cloud(12, 0.35), // smoke
    draw((c) => { c.lineWidth = 3; for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; c.beginPath(); c.moveTo(32 - 28 * Math.cos(a), 32 - 28 * Math.sin(a)); c.lineTo(32 + 28 * Math.cos(a), 32 + 28 * Math.sin(a)); c.stroke(); } }), // snow
  ];
}
