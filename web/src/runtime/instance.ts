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

  x = 0; y = 0;
  xprevious = 0; yprevious = 0;
  xstart = 0; ystart = 0;
  _hspeed = 0; _vspeed = 0; _speed = 0; _direction = 0;
  friction = 0;
  gravity = 0;
  gravity_direction = 270;
  _sprite_index = -1;
  _image_index = 0;
  image_speed = 1;
  image_xscale = 1;
  image_yscale = 1;
  image_angle = 0;
  image_alpha = 1;
  image_blend = 0xffffff;
  mask_index = -1;
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
    this.x = this.xprevious = this.xstart = x;
    this.y = this.yprevious = this.ystart = y;
    this._sprite_index = o.sprite;
    this.mask_index = o.mask;
    this._depth = o.depth;
    this.visible = o.visible;
    this.solid = o.solid;
    this.persistent = o.persistent;
  }

  get depth() { return this._depth; }
  set depth(v: number) {
    if (v !== this._depth) { this._depth = v; this.game.depthDirty = true; }
  }

  get sprite_index() { return this._sprite_index; }
  set sprite_index(v: number) { this._sprite_index = v; }
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
    return this.game.assets.sprites[this.mask_index < 0 ? this._sprite_index : this.mask_index];
  }
  get image_number() { return this.sprite?.frames.length ?? 0; }
  get sprite_width() { const s = this.sprite; return s ? s.w * this.image_xscale : 0; }
  get sprite_height() { const s = this.sprite; return s ? s.h * this.image_yscale : 0; }
  get sprite_xoffset() { const s = this.sprite; return s ? s.ox * this.image_xscale : 0; }
  get sprite_yoffset() { const s = this.sprite; return s ? s.oy * this.image_yscale : 0; }

  // Bounding box, recomputed on read (cheap compared to the GML that reads it).
  _bl = 0; _br = 0; _bt = 0; _bb = 0;
  updateBBox() {
    const s = this.maskSprite;
    if (!s) { this._bl = this._br = this._bt = this._bb = BBOX_DEFAULT; return; }
    s.ensureMasks();
    const x = this.x, y = this.y, xs = this.image_xscale, ys = this.image_yscale;
    let tlx = x - s.ox * xs + s.bbox.l * xs;
    let tly = y - s.oy * ys + s.bbox.t * ys;
    let brx = tlx + (s.bbox.r + 1 - s.bbox.l) * xs - 1;
    let bry = tly + (s.bbox.b + 1 - s.bbox.t) * ys - 1;
    if (xs <= 0) [tlx, brx] = [brx, tlx];
    if (ys <= 0) [tly, bry] = [bry, tly];
    if (this.image_angle === 0) {
      this._bl = Math.round(tlx); this._br = Math.round(brx); this._bt = Math.round(tly); this._bb = Math.round(bry);
      return;
    }
    const a = -this.image_angle * DEG, sn = Math.sin(a), cs = Math.cos(a);
    const rx = (px: number, py: number) => x + (px - x) * cs - (py - y) * sn;
    const ry = (px: number, py: number) => y + (px - x) * sn + (py - y) * cs;
    const xsArr = [rx(tlx, tly), rx(brx, tly), rx(tlx, bry), rx(brx, bry)];
    const ysArr = [ry(tlx, tly), ry(brx, tly), ry(tlx, bry), ry(brx, bry)];
    this._bl = Math.round(Math.min(...xsArr)); this._br = Math.round(Math.max(...xsArr));
    this._bt = Math.round(Math.min(...ysArr)); this._bb = Math.round(Math.max(...ysArr));
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
