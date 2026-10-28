// Peer-to-peer race: both players play the same stage in their own game, see each other as a ghost Mario,
// and compare coins, defeated enemies (weighted by type), time and deaths at the end.
// PeerJS's public server is only used to exchange connection details; game data goes directly between browsers.
import Peer, { type DataConnection } from "peerjs";
import type { LevelInfo } from "../runtime/assets.ts";
import type { Game } from "../runtime/game.ts";
import type { Instance } from "../runtime/instance.ts";
import { h, openPanel, toast, type Panel } from "./panel.ts";

const WORLDS = ["Grassland", "Desert", "Water", "Rocky", "Cloudy", "Jungle", "Ghostly", "Lava"];
const PEER_PREFIX = "mf2012-race-";
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const STEPS_PER_SECOND = 60;
const GHOST_EVERY = 3;

/** Points per defeated enemy, first matching pattern wins. */
const KILL_POINTS: [RegExp, number][] = [
  [/boss|big|mega|thromb|sciskacz|chomp|bowser|wiatrak|walec/i, 500],
  [/hammer|bros|boomerang|lakitu|dry_bones|pokey|bomb|rex|monty|porcu|spikey|jelectro|pumpkin/i, 300],
  [/troopa|koopa|buzzy|bullet|pirania|cheep|fish|flame/i, 200],
  [/./, 100],
];
export const SCORING = { coin: 50, finish: 3000, timeBonus: 3000, timePerSecond: 15, death: -500 };

interface Stats {
  name: string;
  coins: number;
  kills: Record<string, number>;
  killPoints: number;
  deaths: number;
  steps: number;
  finished: boolean;
  done: boolean;
}

type Msg =
  | { t: "hello"; name: string }
  | { t: "level"; room: number }
  | { t: "start"; room: number }
  | { t: "ghost"; room: number; f: number[][] }
  | { t: "stats"; s: Stats }
  | { t: "lobby" };

const freshStats = (name: string): Stats => ({ name, coins: 0, kills: {}, killPoints: 0, deaths: 0, steps: 0, finished: false, done: false });

export function score(s: Stats) {
  const seconds = s.steps / STEPS_PER_SECOND;
  const parts = {
    coins: s.coins * SCORING.coin,
    kills: s.killPoints,
    finish: s.finished ? SCORING.finish : 0,
    time: s.finished ? Math.max(0, Math.round(SCORING.timeBonus - seconds * SCORING.timePerSecond)) : 0,
    deaths: s.deaths * SCORING.death,
  };
  return { ...parts, total: parts.coins + parts.kills + parts.finish + parts.time + parts.deaths };
}

const killValue = (enemy: string) => KILL_POINTS.find(([re]) => re.test(enemy.replace(/^o_(enemy_)?/, "")))![1];
const isCorpse = (name: string) => name === "o_enemy_kill" || /_lezy2?$/.test(name) || name === "o_rex_nalesnik" || name.startsWith("o_enemy_dry_bones_clash");
const isEnemy = (name: string) => /^o_(enemy|lakitu|pirania|cheep|boss)/.test(name) && !isCorpse(name);
const fmtTime = (steps: number) => {
  const s = steps / STEPS_PER_SECOND;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};

export class Multiplayer {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private host = false;
  private name = localStorage.getItem("mf2012:race-name") || "Player";
  private level: LevelInfo | null = null;
  private me = freshStats(this.name);
  private them = freshStats("Opponent");
  private racing = false;
  private counting = false;
  private ghost: { room: number; f: number[][] } | null = null;
  private lastCoins = 0;
  private panel: Panel | null = null;
  private hud = h("div", { id: "race-hud", hidden: true });
  private countdown = h("div", { id: "countdown", hidden: true });
  private giveUp = h("button", { class: "hud-btn", hidden: true, onclick: () => this.finish(false) }, "Give up");
  private tap: { target: Instance | null; out: number[][] } = { target: null, out: [] };
  private animObj: number;
  private titleRoom: number;

  constructor(private game: Game, hudBar: HTMLElement) {
    document.body.append(this.hud, this.countdown);
    hudBar.prepend(this.giveUp);
    const objIndex = (n: string) => game.manifest.objects.findIndex((o) => o?.name === n);
    this.animObj = objIndex("obj_mario_anim");
    this.titleRoom = this.roomIndex("room_title_screen_and_options");
    game.onSpawn = (creator, obj) => this.spawned(creator, obj);
    game.onStep = () => this.step();
    game.onDrawWorld = () => this.drawGhost();
    game.redirectRoom = (to) => this.redirect(to);
  }

  /** Panels replaced or closed by the race flow itself don't count as the player dismissing them. */
  private switching = false;
  private show(title: string, onDismiss: () => void, closable = true) {
    this.switching = true;
    try {
      return this.panel = openPanel(this.game, title, { closable, onClose: () => { if (!this.switching) onDismiss(); } });
    } finally { this.switching = false; }
  }
  private closePanel() {
    this.switching = true;
    try { this.panel?.close(); } finally { this.switching = false; }
  }

  private roomIndex(name: string) { return this.game.manifest.rooms.findIndex((r) => r?.name === name); }
  private objName(i: number) { return this.game.manifest.objects[i]?.name ?? ""; }
  private get G() { return this.game.G as Record<string, any>; }

  // ---------------------------------------------------------------- connection
  open() {
    if (this.conn?.open) { this.lobby(); return; }
    const p = this.show("Multiplayer race", () => this.disconnect());
    const nameIn = h("input", { type: "text", value: this.name, maxlength: 12, style: "text-transform:none;letter-spacing:0" }) as HTMLInputElement;
    nameIn.addEventListener("input", () => { this.name = nameIn.value.trim() || "Player"; localStorage.setItem("mf2012:race-name", this.name); });
    const codeIn = h("input", { type: "text", maxlength: 5, placeholder: "CODE", size: 7 }) as HTMLInputElement;
    const status = h("p", { class: "muted" });
    p.body.append(
      h("p", {}, "Race a friend on any stage. You both play the same level at the same time and see each other as a ghost. Coins, defeated enemies (tougher enemies are worth more), finish time and deaths decide the winner."),
      h("label", { class: "field" }, h("span", {}, "Your name"), nameIn),
      h("h3", {}, "Host"),
      h("div", { class: "row" }, h("button", { class: "btn accent", onclick: () => this.create(status) }, "Create room")),
      h("h3", {}, "Join"),
      h("div", { class: "row" }, codeIn, h("button", { class: "btn", onclick: () => this.join(codeIn.value, status) }, "Join room")),
      status,
    );
  }

  private create(status: HTMLElement) {
    this.disconnect();
    const code = Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
    status.textContent = "Creating room…";
    const peer = this.peer = new Peer(PEER_PREFIX + code);
    peer.on("open", () => {
      status.replaceChildren("Room code: ", h("span", { class: "code" }, code), h("br"), "Send this code to your friend. Waiting for them to join…");
    });
    peer.on("connection", (c) => {
      if (this.conn?.open) { c.close(); return; }
      this.host = true;
      this.attach(c);
    });
    peer.on("error", (e) => { status.className = "error"; status.textContent = `Connection error: ${e.message}`; });
  }

  private join(raw: string, status: HTMLElement) {
    const code = raw.trim().toUpperCase();
    if (code.length !== 5) { status.className = "error"; status.textContent = "Enter the 5-letter room code."; return; }
    this.disconnect();
    status.className = "muted";
    status.textContent = "Connecting…";
    const peer = this.peer = new Peer();
    peer.on("open", () => {
      this.host = false;
      this.attach(peer.connect(PEER_PREFIX + code, { reliable: true }));
    });
    peer.on("error", (e) => {
      status.className = "error";
      status.textContent = e.type === "peer-unavailable" ? "No room with that code." : `Connection error: ${e.message}`;
    });
  }

  private attach(c: DataConnection) {
    this.conn = c;
    c.on("open", () => { this.send({ t: "hello", name: this.name }); this.lobby(); });
    c.on("data", (d) => this.receive(d as Msg));
    c.on("close", () => {
      if (this.conn !== c) return;
      this.conn = null;
      toast("Your opponent left the race.");
      this.them.done = true;
      if (this.me.done) this.results();
      else if (!this.racing) this.closePanel();
    });
  }

  private disconnect() {
    this.conn?.close();
    this.peer?.destroy();
    this.conn = null;
    this.peer = null;
  }

  private send(m: Msg) { if (this.conn?.open) this.conn.send(m); }

  private receive(m: Msg) {
    switch (m.t) {
      case "hello": this.them.name = m.name; if (!this.racing) this.lobby(); break;
      case "level": this.level = this.game.manifest.levels.find((l) => l.room === m.room) ?? null; if (!this.racing) this.lobby(); break;
      case "start": this.level = this.game.manifest.levels.find((l) => l.room === m.room) ?? null; void this.start(); break;
      case "ghost": this.ghost = m; break;
      case "stats": this.them = m.s; this.renderHud(); if (this.them.done && this.me.done) this.results(); break;
      case "lobby": this.again(); break;
    }
  }

  // ---------------------------------------------------------------- lobby
  private lobby() {
    const p = this.show("Race lobby", () => (this.game.vfs.persist ? this.disconnect() : this.leave()));
    p.body.append(h("p", {}, h("b", {}, this.name), " (you) vs ", h("b", {}, this.them.name)));
    if (!this.host) {
      p.body.append(h("p", { class: "muted" }, this.level ? `Host picked ${this.level.name} ${this.level.title}. Waiting for the host to start…` : "Waiting for the host to pick a stage…"));
      return;
    }
    const list = h("div", { class: "levels" });
    const world = h("select", {}, ...WORLDS.map((w, i) => h("option", { value: i + 1, selected: (this.level?.map ?? 1) === i + 1 }, `World ${i + 1} · ${w}`))) as HTMLSelectElement;
    const startBtn = h("button", { class: "btn accent", disabled: !this.level, onclick: () => { if (this.level) { this.send({ t: "start", room: this.level.room }); void this.start(); } } }, "Start race") as HTMLButtonElement;
    const render = () => {
      list.replaceChildren();
      const levels = this.game.manifest.levels.filter((l) => l.map === +world.value)
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      for (const l of levels) {
        const b = h("button", { class: l.room === this.level?.room ? "selected" : "" }, h("span", { class: "num" }, l.name || "—"), l.title);
        b.addEventListener("click", () => { this.level = l; this.send({ t: "level", room: l.room }); startBtn.disabled = false; render(); });
        list.append(b);
      }
    };
    world.addEventListener("change", render);
    render();
    p.body.append(h("label", { class: "field" }, h("span", {}, "World"), world), list, h("div", { class: "row spread", style: "margin-top:12px" }, h("span", { class: "muted" }, "Pick a stage, then start."), startBtn));
  }

  // ---------------------------------------------------------------- race
  private resetGlobals() {
    const G = this.G, lvl = this.level!;
    Object.assign(G, {
      $return_name_of_map: this.roomIndex(`room_map_${lvl.map}`), $map_number: lvl.map,
      $chpoint_id: 0, $chpoint_sublevel: 0, $chpoint_lvl_selected: 0, $chpoint_canuse: 1,
      $mario_wszedl_do_etapu: 1, $mario_completed_stage: 0, $sequence_level_completed: 0,
      $zycia: 5, $game_over: 0, $pauza: 0,
      // What the world map's creation code would have set before entering a stage.
      $blokuj_ruch_na_title_screenie: 0, $blocker_ruchow_anim: 0, $przetransferuj_czas: 0, $przetransferuj_czas_slot: 0,
      $used_power_star_on_start: 0, $used_budzix_on_start: 0, $zostaw_ta_sama_muzyke_w_nast_etapie: 8714917489, $algorytm_KULKA: 0,
    });
  }

  private async start() {
    if (!this.level) return;
    this.closePanel();
    this.game.vfs.persist = false;
    this.me = freshStats(this.name);
    this.them = { ...freshStats(this.them.name) };
    this.ghost = null;
    this.racing = true;
    this.G.$rodzaj_mario = 0;
    this.resetGlobals();
    this.lastCoins = Number(this.G.$coins) || 0;
    this.game.audio.stopMusic();
    this.game.sceneChange = { room: this.level.room };
    this.counting = true;
    this.game.input.releaseAll();
    this.game.input.enabled = false;
    this.giveUp.hidden = false;
    this.renderHud();
    this.hud.hidden = false;
    this.countdown.hidden = false;
    for (const n of ["3", "2", "1"]) { this.countdown.textContent = n; await new Promise((r) => setTimeout(r, 900)); }
    this.countdown.textContent = "GO!";
    this.counting = false;
    this.game.input.enabled = true;
    setTimeout(() => { this.countdown.hidden = true; }, 600);
  }

  private finish(finished: boolean) {
    if (!this.racing || this.me.done) return;
    this.me.finished = finished;
    this.me.done = true;
    this.racing = false;
    this.giveUp.hidden = true;
    this.send({ t: "stats", s: this.me });
    if (!finished) this.game.sceneChange = { room: this.titleRoom };
    this.results();
  }

  /** Room changes to the world map end an attempt: either the stage was cleared or Mario died. */
  private redirect(to: number): number {
    if (!this.racing || !this.level) return to;
    if (!this.game.manifest.rooms[to]?.name.startsWith("room_map_")) return to;
    if (Number(this.G.$mario_completed_stage) === 1) {
      this.finish(true);
      return this.titleRoom;
    }
    this.me.deaths++;
    this.send({ t: "stats", s: this.me });
    const checkpoint = Number(this.G.$chpoint_id) !== 0 ? Number(this.G.$chpoint_sublevel) : 0;
    const keep = { id: this.G.$chpoint_id, sub: this.G.$chpoint_sublevel, sel: this.G.$chpoint_lvl_selected };
    this.resetGlobals();
    if (checkpoint) Object.assign(this.G, { $chpoint_id: keep.id, $chpoint_sublevel: keep.sub, $chpoint_lvl_selected: keep.sel });
    return checkpoint || this.level.room;
  }

  private spawned(creator: Instance, obj: number) {
    if (!this.racing) return;
    const by = this.objName(creator.object_index);
    if (!isCorpse(this.objName(obj)) || !isEnemy(by)) return;
    const type = by.replace(/^o_(enemy_)?/, "");
    this.me.kills[type] = (this.me.kills[type] ?? 0) + 1;
    this.me.killPoints += killValue(by);
  }

  private step() {
    const g = this.game;
    if (this.racing) {
      const coins = Number(this.G.$coins) || 0;
      let d = coins - this.lastCoins;
      if (d < -50) d += 100;
      if (d > 0) this.me.coins += d;
      this.lastCoins = coins;
      if (!this.counting && Number(this.G.$sequence_level_completed) !== 1 && Number(this.G.$mario_completed_stage) !== 1) this.me.steps++;
      if (g.frameCount % 30 === 0) { this.send({ t: "stats", s: this.me }); this.renderHud(); }
    }
    if (this.conn?.open && (this.racing || this.me.done)) {
      if (g.frameCount % GHOST_EVERY === 0) {
        this.send({ t: "ghost", room: g.room, f: this.tap.out.map((c) => c.map((v) => Math.round(v * 100) / 100)) });
      }
      this.tap.out = [];
      this.tap.target = g.byObject[this.animObj]?.find((i) => !i.destroyed) ?? null;
      g.spriteTap = this.tap;
    } else g.spriteTap = null;
  }

  private drawGhost() {
    const gh = this.ghost, g = this.game;
    if (!gh || gh.room !== g.room || !(this.racing || this.me.done)) return;
    g.renderer.setBlendMode(0);
    for (const [spr, sub, x, y, xs, ys, angle, colour, alpha] of gh.f) {
      const s = g.assets.sprites[spr];
      if (!s) continue;
      // Tint towards green so the ghost reads as the other player.
      const r = (colour & 255) * 0.55, gr = ((colour >> 8) & 255), b = ((colour >> 16) & 255) * 0.6;
      g.drawSprite(s, sub, x, y, xs, ys, angle, (Math.round(b) << 16) | (gr << 8) | Math.round(r), alpha * 0.6);
    }
    g.renderer.setBlendMode(g.blendMode);
  }

  private renderHud() {
    const line = (s: Stats, you: boolean) => h("div", {},
      h("b", {}, you ? "You" : s.name), ` · coins ${s.coins} · enemies ${s.killPoints} · ${fmtTime(s.steps)}`,
      s.deaths ? ` · deaths ${s.deaths}` : "", s.done ? (s.finished ? " · finished" : " · gave up") : "");
    this.hud.replaceChildren(line(this.me, true), line(this.them, false));
  }

  // ---------------------------------------------------------------- results
  private results() {
    this.hud.hidden = true;
    this.giveUp.hidden = true;
    const waiting = !this.them.done && !!this.conn?.open;
    const p = this.show(waiting ? "Waiting for opponent" : "Race results", () => this.leave(), !waiting);
    if (waiting) {
      p.body.append(h("p", {}, this.me.finished ? `You finished in ${fmtTime(this.me.steps)}!` : "You gave up."), h("p", { class: "muted" }, `${this.them.name} is still racing…`));
      return;
    }
    const a = score(this.me), b = score(this.them);
    const row = (label: string, x: string | number, y: string | number) => h("tr", {}, h("td", {}, label), h("td", {}, String(x)), h("td", {}, String(y)));
    const kills = (s: Stats) => Object.values(s.kills).reduce((n, k) => n + k, 0);
    const winner = a.total === b.total ? "It's a draw!" : a.total > b.total ? `${this.me.name} wins!` : `${this.them.name} wins!`;
    p.body.append(
      h("div", { class: "winner" }, winner),
      h("p", { class: "muted", style: "text-align:center" }, `${this.level?.name ?? ""} ${this.level?.title ?? ""}`),
      h("table", { class: "results" },
        h("tr", {}, h("th", {}, ""), h("th", {}, `${this.me.name} (you)`), h("th", {}, this.them.name)),
        row(`Coins (×${SCORING.coin})`, `${this.me.coins} → ${a.coins}`, `${this.them.coins} → ${b.coins}`),
        row("Enemies defeated", `${kills(this.me)} → ${a.kills}`, `${kills(this.them)} → ${b.kills}`),
        row("Finished", this.me.finished ? `yes → ${a.finish}` : "no", this.them.finished ? `yes → ${b.finish}` : "no"),
        row("Time", `${fmtTime(this.me.steps)} → ${a.time}`, `${fmtTime(this.them.steps)} → ${b.time}`),
        row(`Deaths (${SCORING.death})`, `${this.me.deaths} → ${a.deaths}`, `${this.them.deaths} → ${b.deaths}`),
        h("tr", { class: "total" }, h("td", {}, "Total"), h("td", {}, String(a.total)), h("td", {}, String(b.total))),
      ),
      h("p", { class: "muted" }, "Tougher enemies are worth more: 100 for basic enemies up to 500 for big ones and bosses. Finishing faster earns a bigger time bonus."),
      h("div", { class: "row spread" },
        h("button", { class: "btn", onclick: () => p.close() }, "Leave"),
        this.conn?.open ? h("button", { class: "btn accent", onclick: () => { this.send({ t: "lobby" }); this.again(); } }, "Race again") : null),
    );
  }

  private again() {
    this.me = freshStats(this.name);
    this.them = { ...freshStats(this.them.name) };
    this.lobby();
  }

  /** Leaving restarts the page so the single-player game comes back with the saves untouched. */
  private leave() {
    this.disconnect();
    location.reload();
  }
}
