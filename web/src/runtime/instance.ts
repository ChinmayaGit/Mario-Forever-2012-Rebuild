import type { Sprite } from "./assets.ts";
import type { Game } from "./game.ts";

const DEG = Math.PI / 180;
const BBOX_DEFAULT = -100000;

/** A GM8 instance. User variables live on the object as `$name` properties. */
export class Instance {
  [key: `$${string}`]: any;
  game: Game;
  id: number;
  object_index: number;
  destroyed = false;
  /** Creation order, used for GM8's instance iteration order. */
  order: number;

  // Geometry lives behind setters so the collision grid knows what moved (see Game.gridMoved).
  _x = 0; _y = 0;
  xprevious = 0; yprevious = 0;
  xstart = 0; ystart = 0;
  _hspeed = 0; _vspeed = 0; _speed = 0; _direction = 0;
  friction = 0;
  gravity = 0;
  gravity_direction = 270;
  _sprite_index = -1;
  _image_index = 0;
  image_speed = 1;
  _image_xscale = 1;
  _image_yscale = 1;
  _image_angle = 0;
  image_alpha = 1;
  image_blend = 0xffffff;
  _mask_index = -1;
  /** In game.instances (the shared `dummy` never is, so it never enters the grid). */
  _live = false;
  /** Queued for re-indexing in the collision grid. */
  _moved = false;
  /** Grid cell range this instance is filed under (_gIn false = not filed). */
  _gIn = false; _gBig = false; _gx0 = 0; _gy0 = 0; _gx1 = 0; _gy1 = 0;
  /** Last grid query that visited this instance (dedupes instances spanning several cells). */
  _qs = 0;
  _depth = 0;
  visible = true;
  solid = false;
  persistent = false;
  alarm: number[] = new Array(12).fill(-1);
  path_index = -1; path_position = 0; path_positionprevious = 0; path_speed = 0; path_scale = 1;
  path_orientation = 0; path_endaction = 0; path_xstart = 0; path_ystart = 0;
  timeline_index = -1; timeline_position = 0; timeline_speed = 1; timeline_running = 0; timeline_loop = 0;

  constructor(game: Game, id: number, object: number, x: number, y: number, order: number) {
    this.game = game;
    this.id = id;
    this.object_index = object;
    this.order = order;
    const o = game.assets.objects[object];
    this._x = this.xprevious = this.xstart = x;
    this._y = this.yprevious = this.ystart = y;
    this._sprite_index = o.sprite;
    this._mask_index = o.mask;
    this._depth = o.depth;
    this.visible = o.visible;
    this.solid = o.solid;
    this.persistent = o.persistent;
  }

  get depth() { return this._depth; }
  set depth(v: number) {
    if (v !== this._depth) { this._depth = v; this.game.depthDirty = true; }
  }

  private touch() {
    if (!this._moved && this._live) { this._moved = true; this.game.gridMoved.push(this); }
  }
  get x() { return this._x; }
  set x(v: number) { if (v !== this._x) { this._x = v; this.touch(); } }
  get y() { return this._y; }
  set y(v: number) { if (v !== this._y) { this._y = v; this.touch(); } }
  get image_xscale() { return this._image_xscale; }
  set image_xscale(v: number) { if (v !== this._image_xscale) { this._image_xscale = v; this.touch(); } }
  get image_yscale() { return this._image_yscale; }
  set image_yscale(v: number) { if (v !== this._image_yscale) { this._image_yscale = v; this.touch(); } }
  get image_angle() { return this._image_angle; }
  set image_angle(v: number) { if (v !== this._image_angle) { this._image_angle = v; this.touch(); } }
  get mask_index() { return this._mask_index; }
  set mask_index(v: number) { if (v !== this._mask_index) { this._mask_index = v; this.touch(); } }
  /** Queue for grid re-indexing (new instance, room change, sprite data changed). */
  markMoved() { this.touch(); }

  get sprite_index() { return this._sprite_index; }
  set sprite_index(v: number) { if (v !== this._sprite_index) { this._sprite_index = v; this.touch(); } }
  get image_index() { return this._image_index; }
  set image_index(v: number) { this._image_index = v; }

  get hspeed() { return this._hspeed; }
  set hspeed(v: number) { if (v !== this._hspeed) { this._hspeed = v; this.updateSpeedDirection(); } }
  get vspeed() { return this._vspeed; }
  set vspeed(v: number) { if (v !== this._vspeed) { this._vspeed = v; this.updateSpeedDirection(); } }
  get speed() { return this._speed; }
  set speed(v: number) { this._speed = v; this.updateHVSpeed(); }
  get direction() { return this._direction; }
  set direction(v: number) { this._direction = ((v % 360) + 360) % 360; this.updateHVSpeed(); }

  setHV(h: number, v: number) {
    if (h !== this._hspeed || v !== this._vspeed) { this._hspeed = h; this._vspeed = v; this.updateSpeedDirection(); }
  }

  private updateHVSpeed() {
    const h = Math.cos(this._direction * DEG) * this._speed;
    const v = -Math.sin(this._direction * DEG) * this._speed;
    const rh = Math.round(h), rv = Math.round(v);
    this._hspeed = Math.abs(rh - h) < 0.0001 ? rh : h;
    this._vspeed = Math.abs(rv - v) < 0.0001 ? rv : v;
  }
  private updateSpeedDirection() {
    let d = (Math.atan2(-this._vspeed, this._hspeed) / DEG + 360) % 360;
    if (Math.abs(d - Math.round(d)) < 0.0001) d = Math.round(d);
    this._direction = d;
    this._speed = Math.hypot(this._hspeed, this._vspeed);
  }

  get sprite(): Sprite | undefined { return this.game.assets.sprites[this._sprite_index]; }
  get maskSprite(): Sprite | undefined {
    return this.game.assets.sprites[this._mask_index < 0 ? this._sprite_index : this._mask_index];
  }
  get image_number() { return this.sprite?.frames.length ?? 0; }
  get sprite_width() { const s = this.sprite; return s ? s.w * this.image_xscale : 0; }
  get sprite_height() { const s = this.sprite; return s ? s.h * this.image_yscale : 0; }
  get sprite_xoffset() { const s = this.sprite; return s ? s.ox * this.image_xscale : 0; }
  get sprite_yoffset() { const s = this.sprite; return s ? s.oy * this.image_yscale : 0; }

  // Bounding box, recomputed on read only when an input changed (static blocks are read constantly).
  _bl = 0; _br = 0; _bt = 0; _bb = 0;
  private _bk = { x: NaN, y: NaN, xs: 0, ys: 0, a: 0, spr: -2, ver: -1 };
  updateBBox() {
    const si = this._mask_index < 0 ? this._sprite_index : this._mask_index;
    const k = this._bk, x = this._x, y = this._y, xs = this._image_xscale, ys = this._image_yscale, ang = this._image_angle;
    const ver = this.game.spriteVersion;
    if (k.x === x && k.y === y && k.xs === xs && k.ys === ys && k.a === ang && k.spr === si && k.ver === ver) return;
    const s = this.game.assets.sprites[si];
    if (!s) { this._bl = this._br = this._bt = this._bb = BBOX_DEFAULT; return; }
    s.ensureMasks();
    k.x = x; k.y = y; k.xs = xs; k.ys = ys; k.a = ang; k.spr = si; k.ver = ver;
    let tlx = x - s.ox * xs + s.bbox.l * xs;
    let tly = y - s.oy * ys + s.bbox.t * ys;
    let brx = tlx + (s.bbox.r + 1 - s.bbox.l) * xs - 1;
    let bry = tly + (s.bbox.b + 1 - s.bbox.t) * ys - 1;
    if (xs <= 0) { const t = tlx; tlx = brx; brx = t; }
    if (ys <= 0) { const t = tly; tly = bry; bry = t; }
    if (ang === 0) {
      this._bl = Math.round(tlx); this._br = Math.round(brx); this._bt = Math.round(tly); this._bb = Math.round(bry);
      return;
    }
    const a = -ang * DEG, sn = Math.sin(a), cs = Math.cos(a);
    const ax = tlx - x, bx = brx - x, ay = tly - y, by = bry - y;
    const x0 = x + ax * cs - ay * sn, x1 = x + bx * cs - ay * sn, x2 = x + ax * cs - by * sn, x3 = x + bx * cs - by * sn;
    const y0 = y + ax * sn + ay * cs, y1 = y + bx * sn + ay * cs, y2 = y + ax * sn + by * cs, y3 = y + bx * sn + by * cs;
    this._bl = Math.round(Math.min(x0, x1, x2, x3)); this._br = Math.round(Math.max(x0, x1, x2, x3));
    this._bt = Math.round(Math.min(y0, y1, y2, y3)); this._bb = Math.round(Math.max(y0, y1, y2, y3));
  }
  get bbox_left() { this.updateBBox(); return this._bl; }
  get bbox_right() { this.updateBBox(); return this._br; }
  get bbox_top() { this.updateBBox(); return this._bt; }
  get bbox_bottom() { this.updateBBox(); return this._bb; }

  // Read-only in GML, but assignments must not throw.
  set image_number(_v: number) {}
  set sprite_width(_v: number) {}
  set sprite_height(_v: number) {}
  set sprite_xoffset(_v: number) {}
  set sprite_yoffset(_v: number) {}
  set bbox_left(_v: number) {}
  set bbox_right(_v: number) {}
  set bbox_top(_v: number) {}
  set bbox_bottom(_v: number) {}
}
