// GML (GameMaker 8.x) lexer and parser. Mirrors the quirks of the GM8 runner:
// newlines are insignificant, semicolons optional, `=` compares inside expressions,
// `begin`/`end` are braces, `<>` is `!=`, `:=` assigns, and extra dots in numbers are ignored.

export type Tok =
  | { t: "id"; v: string; p: number }
  | { t: "num"; v: number; p: number }
  | { t: "str"; v: string; p: number }
  | { t: "op"; v: string; p: number }
  | { t: "kw"; v: string; p: number }
  | { t: "eof"; v: ""; p: number };

const KEYWORDS = new Set([
  "var", "globalvar", "if", "else", "with", "repeat", "do", "until", "while", "for", "switch",
  "case", "default", "break", "continue", "return", "exit",
]);
const WORD_OPS: Record<string, string> = {
  mod: "mod", div: "div", and: "&&", or: "||", xor: "^^", not: "!", then: "then", begin: "{", end: "}",
};

export function lex(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const n = src.length;
  const isId = (c: string) => /[A-Za-z0-9_]/.test(c);
  while (i < n) {
    const c = src[i];
    if (c <= " ") { i++; continue; }
    const p = i;
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      while (j < n && isId(src[j])) j++;
      const w = src.slice(i, j);
      i = j;
      if (KEYWORDS.has(w)) out.push({ t: "kw", v: w, p });
      else if (w in WORD_OPS) out.push({ t: "op", v: WORD_OPS[w], p });
      else out.push({ t: "id", v: w, p });
      continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      let seen = false, digits = "", frac = "";
      while (i < n && /[0-9.]/.test(src[i])) {
        if (src[i] === ".") seen = true;
        else if (seen) frac += src[i];
        else digits += src[i];
        i++;
      }
      out.push({ t: "num", v: parseFloat((digits || "0") + "." + (frac || "0")), p });
      continue;
    }
    if (c === '"' || c === "'") {
      const j = src.indexOf(c, i + 1);
      const end = j < 0 ? n : j;
      out.push({ t: "str", v: src.slice(i + 1, end), p });
      i = end + 1;
      continue;
    }
    if (c === "$") {
      let j = i + 1;
      while (j < n && /[0-9a-fA-F]/.test(src[j])) j++;
      const h = src.slice(i + 1, j);
      out.push({ t: "num", v: h ? parseInt(h, 16) : 0, p });
      i = j;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (two === "//") { while (i < n && src[i] !== "\n" && src[i] !== "\r") i++; continue; }
    if (two === "/*") { const j = src.indexOf("*/", i + 2); i = j < 0 ? n : j + 2; continue; }
    const twoOps: Record<string, string> = {
      "&&": "&&", "||": "||", "^^": "^^", "<<": "<<", ">>": ">>", "==": "==", "!=": "!=", "<=": "<=",
      ">=": ">=", "+=": "+=", "-=": "-=", "*=": "*=", "/=": "/=", "&=": "&=", "|=": "|=", "^=": "^=",
      "<>": "!=", ":=": "=",
    };
    if (two in twoOps) { out.push({ t: "op", v: twoOps[two], p }); i += 2; continue; }
    if ("!&()*+,-/:;<=>[]^{|}~.".includes(c)) { out.push({ t: "op", v: c, p }); i++; continue; }
    i++; // invalid character: the runner skips it
  }
  out.push({ t: "eof", v: "", p: n });
  return out;
}

export type Expr =
  | { k: "num"; v: number }
  | { k: "str"; v: string }
  | { k: "id"; name: string }
  | { k: "field"; obj: Expr; name: string }
  | { k: "index"; base: Expr; idx: Expr[] }
  | { k: "call"; name: string; args: Expr[] }
  | { k: "un"; op: string; e: Expr }
  | { k: "bin"; op: string; a: Expr; b: Expr };

export type Stmt =
  | { k: "block"; body: Stmt[] }
  | { k: "var"; names: string[] }
  | { k: "globalvar"; names: string[] }
  | { k: "assign"; op: string; target: Expr; value: Expr }
  | { k: "expr"; e: Expr }
  | { k: "if"; cond: Expr; then: Stmt; else?: Stmt }
  | { k: "while"; cond: Expr; body: Stmt }
  | { k: "do"; body: Stmt; cond: Expr }
  | { k: "for"; init: Stmt; cond: Expr; step: Stmt; body: Stmt }
  | { k: "repeat"; count: Expr; body: Stmt }
  | { k: "with"; target: Expr; body: Stmt }
  | { k: "switch"; e: Expr; body: Stmt[] }
  | { k: "case"; e: Expr }
  | { k: "default" }
  | { k: "break" }
  | { k: "continue" }
  | { k: "exit" }
  | { k: "return"; e: Expr }
  | { k: "nop" };

const PREC: Record<string, number> = {
  "&&": 0, "||": 0, "^^": 0,
  "<": 1, ">": 1, "<=": 1, ">=": 1, "==": 1, "!=": 1, "=": 1,
  "&": 2, "|": 2, "^": 2,
  "<<": 3, ">>": 3,
  "+": 4, "-": 4,
  "*": 5, "/": 5, div: 5, mod: 5,
};
const ASSIGN_OPS = new Set(["=", "+=", "-=", "*=", "/=", "&=", "|=", "^="]);

export class ParseError extends Error {}

export class Parser {
  toks: Tok[];
  i = 0;
  src: string;
  constructor(src: string) {
    this.src = src;
    this.toks = lex(src);
  }
  peek(o = 0): Tok { return this.toks[Math.min(this.i + o, this.toks.length - 1)]; }
  next(): Tok { return this.toks[Math.min(this.i++, this.toks.length - 1)]; }
  isOp(v: string, o = 0) { const t = this.peek(o); return t.t === "op" && t.v === v; }
  isKw(v: string) { const t = this.peek(); return t.t === "kw" && t.v === v; }
  eatOp(v: string) { if (this.isOp(v)) { this.i++; return true; } return false; }
  expectOp(v: string) {
    if (!this.eatOp(v)) this.fail(`expected '${v}'`);
  }
  fail(msg: string): never {
    const t = this.peek();
    const line = this.src.slice(0, t.p).split("\n").length;
    throw new ParseError(`${msg} at line ${line} near '${this.src.slice(t.p, t.p + 30).replace(/\s+/g, " ")}'`);
  }

  program(): Stmt[] {
    const body: Stmt[] = [];
    while (this.peek().t !== "eof") {
      if (this.isOp("}")) { this.i++; continue; } // stray closers are ignored by the runner
      body.push(this.stmt());
    }
    return body;
  }

  stmt(): Stmt {
    const t = this.peek();
    if (t.t === "op") {
      if (t.v === ";") { this.i++; return { k: "nop" }; }
      if (t.v === "{") {
        this.i++;
        const body: Stmt[] = [];
        while (!this.isOp("}")) {
          if (this.peek().t === "eof") this.fail("unclosed block");
          body.push(this.stmt());
        }
        this.i++;
        return { k: "block", body };
      }
    }
    if (t.t === "kw") {
      this.i++;
      switch (t.v) {
        case "var":
        case "globalvar": {
          const names: string[] = [];
          do {
            const id = this.next();
            if (id.t !== "id") this.fail("expected identifier");
            names.push(id.v as string);
          } while (this.eatOp(","));
          this.eatOp(";");
          return { k: t.v as "var", names };
        }
        case "if": {
          const cond = this.expr();
          this.eatOp("then");
          const then = this.stmt();
          this.eatOp(";");
          if (this.isKw("else")) { this.i++; return { k: "if", cond, then, else: this.stmt() }; }
          return { k: "if", cond, then };
        }
        case "while": {
          const cond = this.expr();
          if (this.isKw("do")) this.i++;
          return { k: "while", cond, body: this.stmt() };
        }
        case "do": {
          const body = this.stmt();
          this.eatOp(";");
          if (!this.isKw("until")) this.fail("expected until");
          this.i++;
          const cond = this.expr();
          this.eatOp(";");
          return { k: "do", body, cond };
        }
        case "for": {
          this.expectOp("(");
          const init = this.isOp(";") ? { k: "nop" } as Stmt : this.stmt();
          this.eatOp(";");
          const cond = this.isOp(";") ? { k: "num", v: 1 } as Expr : this.expr();
          this.eatOp(";");
          const step = this.isOp(")") ? { k: "nop" } as Stmt : this.stmt();
          this.eatOp(";");
          this.expectOp(")");
          return { k: "for", init, cond, step, body: this.stmt() };
        }
        case "repeat": return { k: "repeat", count: this.expr(), body: this.stmt() };
        case "with": {
          const target = this.expr();
          if (this.isKw("do")) this.i++;
          return { k: "with", target, body: this.stmt() };
        }
        case "switch": {
          const e = this.expr();
          this.expectOp("{");
          const body: Stmt[] = [];
          while (!this.isOp("}")) {
            if (this.peek().t === "eof") this.fail("unclosed switch");
            if (this.isKw("case")) {
              this.i++;
              const ce = this.expr();
              this.expectOp(":");
              body.push({ k: "case", e: ce });
            } else if (this.isKw("default")) {
              this.i++;
              this.expectOp(":");
              body.push({ k: "default" });
            } else body.push(this.stmt());
          }
          this.i++;
          return { k: "switch", e, body };
        }
        case "break": this.eatOp(";"); return { k: "break" };
        case "continue": this.eatOp(";"); return { k: "continue" };
        case "exit": this.eatOp(";"); return { k: "exit" };
        case "return": { const e = this.expr(); this.eatOp(";"); return { k: "return", e }; }
        default: this.fail(`unexpected '${t.v}'`);
      }
    }
    // assignment or call
    const target = this.lvalue();
    if (target.k === "call") { this.eatOp(";"); return { k: "expr", e: target }; }
    const op = this.peek();
    if (op.t === "op" && (ASSIGN_OPS.has(op.v) || op.v === "==")) {
      this.i++;
      const value = this.expr();
      this.eatOp(";");
      return { k: "assign", op: op.v === "==" ? "=" : op.v, target, value };
    }
    this.fail("expected assignment");
  }

  // identifier chains: a, a.b, a[i], a.b[i,j], f(x), (expr).b
  lvalue(): Expr {
    let e = this.primary();
    for (;;) {
      if (this.isOp(".")) {
        this.i++;
        const id = this.next();
        if (id.t !== "id") this.fail("expected field name");
        e = { k: "field", obj: e, name: id.v as string };
      } else if (this.isOp("[") && (e.k === "id" || e.k === "field")) {
        this.i++;
        const idx = [this.expr()];
        if (this.eatOp(",")) idx.push(this.expr());
        this.expectOp("]");
        e = { k: "index", base: e, idx };
      } else break;
    }
    return e;
  }

  primary(): Expr {
    const t = this.next();
    if (t.t === "num") return { k: "num", v: t.v };
    if (t.t === "str") return { k: "str", v: t.v };
    if (t.t === "id") {
      if (this.isOp("(")) {
        this.i++;
        const args: Expr[] = [];
        if (!this.isOp(")")) {
          do { args.push(this.expr()); } while (this.eatOp(","));
        }
        this.expectOp(")");
        return { k: "call", name: t.v, args };
      }
      return { k: "id", name: t.v };
    }
    if (t.t === "op") {
      if (t.v === "(") { const e = this.expr(); this.expectOp(")"); return e; }
      if (t.v === "-" || t.v === "!" || t.v === "~" || t.v === "+") {
        const e = this.unary();
        return t.v === "+" ? e : { k: "un", op: t.v, e };
      }
    }
    this.i--;
    this.fail("unexpected token");
  }

  unary(): Expr {
    return this.lvalue();
  }

  expr(minPrec = 0): Expr {
    let a = this.lvalue();
    for (;;) {
      const t = this.peek();
      if (t.t !== "op" || !(t.v in PREC)) break;
      const prec = PREC[t.v];
      if (prec < minPrec) break;
      this.i++;
      const b = this.expr(prec + 1);
      a = { k: "bin", op: t.v === "=" ? "==" : t.v, a, b };
    }
    return a;
  }
}

export function parse(src: string): Stmt[] {
  return new Parser(src).program();
}
