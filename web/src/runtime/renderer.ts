import type { Frame } from "./assets.ts";

const VS = `#version 300 es
in vec2 a_pos; in vec2 a_uv; in vec4 a_col;
uniform mat3 u_proj;
out vec2 v_uv; out vec4 v_col;
void main() {
  vec3 p = u_proj * vec3(a_pos, 1.0);
  gl_Position = vec4(p.xy, 0.0, 1.0);
  v_uv = a_uv; v_col = a_col;
}`;
const FS = `#version 300 es
precision mediump float;
uniform sampler2D u_tex;
in vec2 v_uv; in vec4 v_col;
out vec4 o;
void main() { o = texture(u_tex, v_uv) * v_col; }`;

const FLOATS_PER_VERT = 8;
const MAX_QUADS = 8192;

export class Renderer {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  prog: WebGLProgram;
  buf: WebGLBuffer;
  data = new Float32Array(MAX_QUADS * 6 * FLOATS_PER_VERT);
  count = 0;
  curTex: WebGLTexture | null = null;
  white: WebGLTexture;
  uProj: WebGLUniformLocation;
  texCache = new WeakMap<object, { tex: WebGLTexture; w: number; h: number }>();
  blend: [number, number] = [0, 0];
  interpolate = false;
  target: { fb: WebGLFramebuffer | null; w: number; h: number } = { fb: null, w: 800, h: 600 };
  proj = new Float32Array(9);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error("WebGL2 is not available");
    this.gl = gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(p);
    this.prog = p;
    gl.useProgram(p);
    this.uProj = gl.getUniformLocation(p, "u_proj")!;
    this.buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    const stride = FLOATS_PER_VERT * 4;
    const attr = (name: string, size: number, off: number) => {
      const loc = gl.getAttribLocation(p, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, off * 4);
    };
    attr("a_pos", 2, 0);
    attr("a_uv", 2, 2);
    attr("a_col", 4, 4);
    this.white = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.white);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl.enable(gl.BLEND);
    this.setBlendMode(0);
  }

  texture(f: Frame): { tex: WebGLTexture; w: number; h: number } {
    const key = f.src as object;
    let t = this.texCache.get(key);
    if (!t) {
      const gl = this.gl;
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, f.src);
      const filter = this.interpolate ? gl.LINEAR : gl.NEAREST;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const src = f.src as { width: number; height: number };
      t = { tex, w: src.width, h: src.height };
      this.texCache.set(key, t);
      gl.bindTexture(gl.TEXTURE_2D, this.curTex);
    }
    return t;
  }

  forget(src: object) {
    const t = this.texCache.get(src);
    if (t) { this.flush(); this.gl.deleteTexture(t.tex); this.texCache.delete(src); }
  }

  flush() {
    if (!this.count) return;
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data, 0, this.count * FLOATS_PER_VERT);
    gl.drawArrays(gl.TRIANGLES, 0, this.count);
    this.count = 0;
  }

  bind(tex: WebGLTexture) {
    if (tex !== this.curTex) {
      this.flush();
      this.curTex = tex;
      this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    }
    if (this.count + 6 > MAX_QUADS * 6) this.flush();
  }

  private v(x: number, y: number, u: number, w: number, r: number, g: number, b: number, a: number) {
    const d = this.data, i = this.count * FLOATS_PER_VERT;
    d[i] = x; d[i + 1] = y; d[i + 2] = u; d[i + 3] = w; d[i + 4] = r; d[i + 5] = g; d[i + 6] = b; d[i + 7] = a;
    this.count++;
  }

  /** Arbitrary quad: corners in order top-left, top-right, bottom-right, bottom-left. */
  quad(tex: WebGLTexture, xs: number[], ys: number[], u0: number, v0: number, u1: number, v1: number, cols: number[][]) {
    this.bind(tex);
    const [c0, c1, c2, c3] = cols;
    this.v(xs[0], ys[0], u0, v0, c0[0], c0[1], c0[2], c0[3]);
    this.v(xs[1], ys[1], u1, v0, c1[0], c1[1], c1[2], c1[3]);
    this.v(xs[2], ys[2], u1, v1, c2[0], c2[1], c2[2], c2[3]);
    this.v(xs[0], ys[0], u0, v0, c0[0], c0[1], c0[2], c0[3]);
    this.v(xs[2], ys[2], u1, v1, c2[0], c2[1], c2[2], c2[3]);
    this.v(xs[3], ys[3], u0, v1, c3[0], c3[1], c3[2], c3[3]);
  }

  /**
   * Draw part of a frame. (left, top) is the frame-local corner relative to the pivot (x, y);
   * the part is scaled by xs/ys and rotated by `angle` degrees counter-clockwise around the pivot.
   */
  drawFrame(f: Frame, px: number, py: number, pw: number, ph: number, x: number, y: number, left: number, top: number,
    xs: number, ys: number, angle: number, colour: number, alpha: number) {
    const t = this.texture(f);
    const u0 = (f.sx + px) / t.w, v0 = (f.sy + py) / t.h;
    const u1 = (f.sx + px + pw) / t.w, v1 = (f.sy + py + ph) / t.h;
    const lx = left * xs, ty = top * ys, rx = (left + pw) * xs, by = (top + ph) * ys;
    const cs = [(colour & 255) / 255, ((colour >> 8) & 255) / 255, ((colour >> 16) & 255) / 255, alpha];
    const cols = [cs, cs, cs, cs];
    if (angle === 0) {
      this.quad(t.tex, [x + lx, x + rx, x + rx, x + lx], [y + ty, y + ty, y + by, y + by], u0, v0, u1, v1, cols);
      return;
    }
    const a = (-angle * Math.PI) / 180, sn = Math.sin(a), c = Math.cos(a);
    const X = (dx: number, dy: number) => x + dx * c - dy * sn;
    const Y = (dx: number, dy: number) => y + dx * sn + dy * c;
    this.quad(t.tex, [X(lx, ty), X(rx, ty), X(rx, by), X(lx, by)], [Y(lx, ty), Y(rx, ty), Y(rx, by), Y(lx, by)], u0, v0, u1, v1, cols);
  }

  rect(x1: number, y1: number, x2: number, y2: number, cols: number[][]) {
    this.quad(this.white, [x1, x2, x2, x1], [y1, y1, y2, y2], 0, 0, 1, 1, cols);
  }

  line(x1: number, y1: number, x2: number, y2: number, w: number, col: number[]) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * (w / 2), ny = (dx / len) * (w / 2);
    this.quad(this.white, [x1 + nx, x2 + nx, x2 - nx, x1 - nx], [y1 + ny, y2 + ny, y2 - ny, y1 - ny], 0, 0, 1, 1, [col, col, col, col]);
  }

  /** GM8 bm_* constants (normal/add/max/subtract) or extended (src, dest) pairs. */
  setBlendMode(mode: number) {
    const gl = this.gl;
    switch (mode) {
      case 1: this.setBlendFactors(gl.SRC_ALPHA, gl.ONE); break;
      case 2: this.setBlendFactors(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR); break;
      case 3: this.setBlendFactors(gl.ZERO, gl.ONE_MINUS_SRC_COLOR); break;
      default: this.setBlendFactors(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }
  setBlendExt(src: number, dst: number) {
    this.setBlendFactors(this.factor(src), this.factor(dst));
  }
  factor(n: number): number {
    const gl = this.gl;
    return [gl.ONE, gl.ZERO, gl.ONE, gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
      gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA, gl.DST_COLOR, gl.ONE_MINUS_DST_COLOR, gl.SRC_ALPHA_SATURATE][n] ?? gl.ONE;
  }
  setBlendFactors(src: number, dst: number) {
    if (this.blend[0] === src && this.blend[1] === dst) return;
    this.flush();
    this.blend = [src, dst];
    this.gl.blendFuncSeparate(src, dst, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  /** Map the room-space rectangle (vx, vy, vw, vh), rotated by angle, onto a viewport in the current target. */
  setView(vx: number, vy: number, vw: number, vh: number, angle: number, px: number, py: number, pw: number, ph: number) {
    this.flush();
    const gl = this.gl;
    const th = this.target.h;
    gl.viewport(px, this.target.fb ? py : th - py - ph, pw, ph);
    const flip = this.target.fb ? -1 : 1;
    const sx = 2 / vw, sy = (-2 / vh) * flip;
    const cx = vx + vw / 2, cy = vy + vh / 2;
    const a = (angle * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    // translate(-cx,-cy) -> rotate(angle) -> scale
    const m = this.proj;
    m[0] = c * sx; m[1] = -s * sy; m[2] = 0;
    m[3] = s * sx; m[4] = c * sy; m[5] = 0;
    m[6] = (-cx * c - cy * s) * sx; m[7] = (cx * s - cy * c) * sy; m[8] = 1;
    gl.uniformMatrix3fv(this.uProj, false, m);
  }

  clear(colour: number) {
    this.flush();
    const gl = this.gl;
    gl.clearColor((colour & 255) / 255, ((colour >> 8) & 255) / 255, ((colour >> 16) & 255) / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  setTarget(fb: WebGLFramebuffer | null, w: number, h: number) {
    this.flush();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
    this.target = { fb, w, h };
  }
}
