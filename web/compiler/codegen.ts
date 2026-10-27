// GML AST -> JavaScript. Generated functions have the shape `function (s, o, a)` where `s` is the
// executing instance, `o` the "other" instance and `a` the argument array (scripts only).
// Runtime handles referenced by generated code: rt (helpers), R (built-in globals), G (global.*),
// F (built-in functions), S (scripts).

import type { Expr, Stmt } from "./parser.ts";
import { CONSTANTS, GLOBAL_ARRAYS, GLOBAL_VARS, INSTANCE_ARRAYS, INSTANCE_VARS } from "./builtins.ts";

export interface Symbols {
  assets: Map<string, number>;
  scripts: Set<string>;
  functions: Set<string>;
}

const num = (n: number) => (Object.is(n, -0) ? "0" : Number.isFinite(n) ? String(n) : "0");

export class Codegen {
  sym: Symbols;
  locals = new Set<string>();
  tmp = 0;
  unknownFns = new Set<string>();
  constructor(sym: Symbols) { this.sym = sym; }

  fn(body: Stmt[]): string {
    this.locals = new Set();
    this.tmp = 0;
    const collect = (s: Stmt) => {
      switch (s.k) {
        case "var": s.names.forEach((n) => this.locals.add(n)); break;
        case "block": s.body.forEach(collect); break;
        case "if": collect(s.then); if (s.else) collect(s.else); break;
        case "while": case "repeat": case "with": collect(s.body); break;
        case "do": collect(s.body); break;
        case "for": collect(s.init); collect(s.step); collect(s.body); break;
        case "switch": s.body.forEach(collect); break;
      }
    };
    body.forEach(collect);
    const code = body.map((s) => this.stmt(s, false)).join("\n");
    const usesLocals = this.locals.size > 0 && /\bL\./.test(code);
    return (usesLocals ? "const L={};\n" : "") + code + "\nreturn 0;";
  }

  // ---- expressions ----
  expr(e: Expr): string {
    switch (e.k) {
      case "num": return num(e.v);
      case "str": return JSON.stringify(e.v);
      case "id": return this.readId(e.name);
      case "field": return this.readField(e.obj, e.name);
      case "index": return this.readIndex(e);
      case "call": return this.call(e.name, e.args);
      case "un": {
        const v = this.expr(e.e);
        if (e.op === "!") return `(rt.t(${v})?0:1)`;
        if (e.op === "~") return `(~rt.r(${v}))`;
        return `(-${v})`;
      }
      case "bin": {
        const a = this.expr(e.a), b = this.expr(e.b);
        switch (e.op) {
          case "+": case "-": case "*": return `(${a}${e.op}${b})`;
          case "/": return `rt.fdiv(${a},${b})`;
          case "div": return `rt.div(${a},${b})`;
          case "mod": return `rt.mod(${a},${b})`;
          case "&": case "|": case "^": case "<<": case ">>": return `(rt.r(${a})${e.op}rt.r(${b}))`;
          case "&&": return `(rt.t(${a})&&rt.t(${b})?1:0)`;
          case "||": return `(rt.t(${a})||rt.t(${b})?1:0)`;
          case "^^": return `(rt.t(${a})!==rt.t(${b})?1:0)`;
          case "==": return `rt.eq(${a},${b})`;
          case "!=": return `(rt.eq(${a},${b})?0:1)`;
          case "<": case ">": case "<=": case ">=": return `(${a}${e.op}${b}?1:0)`;
        }
        throw new Error("bad op " + e.op);
      }
    }
  }

  readId(n: string): string {
    if (this.locals.has(n)) return `(L.$${n}??0)`;
    if (/^argument\d+$/.test(n)) return `(a[${n.slice(8)}]??0)`;
    if (INSTANCE_VARS.has(n)) return `s.${n}`;
    if (INSTANCE_ARRAYS.has(n)) return `s.${n}[0]`;
    if (GLOBAL_VARS.has(n)) return `R.${n}`;
    if (GLOBAL_ARRAYS.has(n)) return `R.${n}[0]`;
    if (n in CONSTANTS) return num(CONSTANTS[n]);
    if (this.sym.assets.has(n)) return String(this.sym.assets.get(n));
    if (n === "argument") return `(a[0]??0)`;
    return `(s.$${n}??0)`;
  }

  /** Holder expression for `obj.` prefixes that resolve statically, or null for runtime lookup. */
  holder(obj: Expr): string | null {
    if (obj.k === "id") {
      if (obj.name === "global") return "G";
      if (obj.name === "self") return "s";
      if (obj.name === "other") return "o";
    }
    if (obj.k === "num" && obj.v === -5) return "G";
    return null;
  }

  key(name: string, holder: string | null): string {
    if (holder === "G") return "$" + name;
    return INSTANCE_VARS.has(name) || INSTANCE_ARRAYS.has(name) ? name : "$" + name;
  }

  readField(obj: Expr, name: string): string {
    const h = this.holder(obj);
    const k = this.key(name, h);
    if (h) return INSTANCE_ARRAYS.has(name) && h !== "G" ? `${h}.${k}[0]` : `(${h}.${k}??0)`;
    return `rt.get(${this.expr(obj)},${JSON.stringify(k)},s,o)`;
  }

  indexArgs(idx: Expr[]): string {
    return idx.length === 2 ? `${this.expr(idx[0])},${this.expr(idx[1])}` : `0,${this.expr(idx[0])}`;
  }

  readIndex(e: Extract<Expr, { k: "index" }>): string {
    const base = e.base;
    if (base.k === "id") {
      const n = base.name;
      if (n === "argument") return `(a[rt.r(${this.expr(e.idx[0])})]??0)`;
      if (this.locals.has(n)) return `rt.aget(L,"$${n}",${this.indexArgs(e.idx)})`;
      if (INSTANCE_ARRAYS.has(n)) return `(s.${n}[rt.r(${this.expr(e.idx[0])})]??0)`;
      if (GLOBAL_ARRAYS.has(n)) return `(R.${n}[rt.r(${this.expr(e.idx[e.idx.length - 1])})]??0)`;
      if (INSTANCE_VARS.has(n) || GLOBAL_VARS.has(n)) return this.readId(n);
      return `rt.aget(s,"$${n}",${this.indexArgs(e.idx)})`;
    }
    if (base.k === "field") {
      const h = this.holder(base.obj);
      const k = this.key(base.name, h);
      if (INSTANCE_ARRAYS.has(base.name) && h !== "G") {
        const tgt = h ?? `rt.inst1(${this.expr(base.obj)},s,o)`;
        return `(${tgt}.${k}[rt.r(${this.expr(e.idx[0])})]??0)`;
      }
      if (h) return `rt.aget(${h},${JSON.stringify(k)},${this.indexArgs(e.idx)})`;
      return `rt.agetT(${this.expr(base.obj)},${JSON.stringify(k)},${this.indexArgs(e.idx)},s,o)`;
    }
    throw new Error("bad index base");
  }

  call(name: string, args: Expr[]): string {
    const as = args.map((x) => this.expr(x));
    if (this.sym.scripts.has(name)) return `S.${name}(s,o,[${as.join(",")}])`;
    if (!this.sym.functions.has(name)) this.unknownFns.add(name);
    return `F.${name}(s,o${as.map((x) => "," + x).join("")})`;
  }

  // ---- statements ----
  assign(target: Expr, op: string, valueExpr: Expr): string {
    const value = this.expr(valueExpr);
    const combine = (cur: string) => {
      switch (op) {
        case "=": return value;
        case "+=": return `${cur}+${value}`;
        case "-=": return `${cur}-${value}`;
        case "*=": return `${cur}*${value}`;
        case "/=": return `rt.fdiv(${cur},${value})`;
        case "&=": return `rt.r(${cur})&rt.r(${value})`;
        case "|=": return `rt.r(${cur})|rt.r(${value})`;
        case "^=": return `rt.r(${cur})^rt.r(${value})`;
      }
      throw new Error("bad assign " + op);
    };
    if (target.k === "id") {
      const n = target.name;
      if (/^argument\d+$/.test(n)) return `a[${n.slice(8)}]=${combine(this.readId(n))};`;
      if (this.locals.has(n)) return `L.$${n}=${combine(this.readId(n))};`;
      if (INSTANCE_VARS.has(n)) return `s.${n}=${combine(`s.${n}`)};`;
      if (INSTANCE_ARRAYS.has(n)) return `s.${n}[0]=${combine(`s.${n}[0]`)};`;
      if (GLOBAL_VARS.has(n)) return `R.${n}=${combine(`R.${n}`)};`;
      if (GLOBAL_ARRAYS.has(n)) return `R.${n}[0]=${combine(`R.${n}[0]`)};`;
      return `s.$${n}=${combine(this.readId(n))};`;
    }
    if (target.k === "field") {
      const h = this.holder(target.obj);
      const k = this.key(target.name, h);
      if (h) return `${h}.${k}=${combine(`(${h}.${k}??0)`)};`;
      const t = `_t${this.tmp++}`;
      return `{const ${t}=${this.expr(target.obj)};rt.set(${t},${JSON.stringify(k)},${combine(`rt.get(${t},${JSON.stringify(k)},s,o)`)},s,o);}`;
    }
    if (target.k === "index") {
      const base = target.base;
      const t = `_t${this.tmp++}`;
      if (base.k === "id") {
        const n = base.name;
        if (n === "argument") return `{const ${t}=rt.r(${this.expr(target.idx[0])});a[${t}]=${combine(`(a[${t}]??0)`)};}`;
        if (INSTANCE_ARRAYS.has(n) || GLOBAL_ARRAYS.has(n)) {
          const h = INSTANCE_ARRAYS.has(n) ? "s" : "R";
          return `{const ${t}=rt.r(${this.expr(target.idx[target.idx.length - 1])});${h}.${n}[${t}]=${combine(`(${h}.${n}[${t}]??0)`)};}`;
        }
        if (INSTANCE_VARS.has(n) || GLOBAL_VARS.has(n)) return this.assign(base, op, valueExpr);
        const h = this.locals.has(n) ? "L" : "s";
        return `{const ${t}=[${this.indexArgs(target.idx)}];rt.aset(${h},"$${n}",${t}[0],${t}[1],${combine(`rt.aget(${h},"$${n}",${t}[0],${t}[1])`)});}`;
      }
      if (base.k === "field") {
        const h = this.holder(base.obj);
        const k = this.key(base.name, h);
        if (INSTANCE_ARRAYS.has(base.name) && h !== "G") {
          const o2 = `_t${this.tmp++}`;
          if (h) return `{const ${t}=rt.r(${this.expr(target.idx[0])});${h}.${k}[${t}]=${combine(`(${h}.${k}[${t}]??0)`)};}`;
          return `{const ${o2}=${this.expr(base.obj)};const ${t}=rt.r(${this.expr(target.idx[0])});for(const _i of rt.targets(${o2},s,o)){_i.${k}[${t}]=${combine(`(_i.${k}[${t}]??0)`)};}}`;
        }
        if (h) return `{const ${t}=[${this.indexArgs(target.idx)}];rt.aset(${h},${JSON.stringify(k)},${t}[0],${t}[1],${combine(`rt.aget(${h},${JSON.stringify(k)},${t}[0],${t}[1])`)});}`;
        const o2 = `_t${this.tmp++}`;
        return `{const ${o2}=${this.expr(base.obj)};const ${t}=[${this.indexArgs(target.idx)}];for(const _i of rt.targets(${o2},s,o)){rt.aset(_i,${JSON.stringify(k)},${t}[0],${t}[1],${combine(`rt.aget(_i,${JSON.stringify(k)},${t}[0],${t}[1])`)});}}`;
      }
    }
    // Assigning to a call or literal is a no-op in practice; evaluate the value for side effects.
    return `${value};`;
  }

  stmt(s: Stmt, inLoop: boolean): string {
    switch (s.k) {
      case "nop": case "var": case "globalvar": case "case": case "default": return "";
      case "block": return `{${s.body.map((x) => this.stmt(x, inLoop)).join("\n")}}`;
      case "assign": return this.assign(s.target, s.op, s.value);
      case "expr": return this.expr(s.e) + ";";
      case "if": return `if(rt.t(${this.expr(s.cond)}))${this.wrap(s.then, inLoop)}${s.else ? `else ${this.wrap(s.else, inLoop)}` : ""}`;
      case "while": return `while(rt.t(${this.expr(s.cond)}))${this.wrap(s.body, true)}`;
      case "do": return `do${this.wrap(s.body, true)}while(!rt.t(${this.expr(s.cond)}));`;
      case "for": return `{${this.stmt(s.init, false)}\nfor(;rt.t(${this.expr(s.cond)});(()=>{${this.stmt(s.step, false)}})())${this.wrap(s.body, true)}}`;
      case "repeat": {
        const t = `_r${this.tmp++}`;
        return `for(let ${t}=rt.r(${this.expr(s.count)});${t}>0;${t}--)${this.wrap(s.body, true)}`;
      }
      case "with": {
        const t = `_w${this.tmp++}`;
        return `{const ${t}s=s,${t}o=o;for(const ${t} of rt.targets(${this.expr(s.target)},s,o)){if(${t}.destroyed)continue;s=${t};o=${t}s;${this.stmt(s.body, true)}}s=${t}s;o=${t}o;}`;
      }
      case "switch": {
        const parts = s.body.map((x) => {
          if (x.k === "case") return `case ${this.expr(x.e)}:`;
          if (x.k === "default") return "default:";
          return this.stmt(x, true);
        });
        return `switch(rt.sw(${this.expr(s.e)})){${parts.join("\n")}}`;
      }
      case "break": return inLoop ? "break;" : "return 0;";
      case "continue": return inLoop ? "continue;" : "return 0;";
      case "exit": return "return 0;";
      case "return": return `return ${this.expr(s.e)};`;
    }
  }

  wrap(s: Stmt, inLoop: boolean): string {
    const c = this.stmt(s, inLoop);
    return s.k === "block" ? c : `{${c}}`;
  }
}
