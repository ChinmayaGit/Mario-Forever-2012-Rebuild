// Web Audio replacement for SXMS.dll (the game's FMOD-based sound DLL).
// Effects: numbered sample slots played with pan/volume 0..255. Music: one streamed channel.

const SAMPLE_RATE = 44100;

interface Channel {
  src: AudioBufferSourceNode;
  gain: GainNode;
  pan: StereoPannerNode;
  start: number;
  rate: number;
  ended: boolean;
}

export class Audio {
  ctx: AudioContext;
  master: GainNode;
  sfxMaster: GainNode;
  slots = new Map<number, AudioBuffer>();
  pending = new Map<string, Promise<AudioBuffer | null>>();
  channels = new Map<number, Channel>();
  nextChannel = 1;
  music: HTMLAudioElement | null = null;
  musicGain: GainNode;
  musicNode: MediaElementAudioSourceNode | null = null;
  musicLoop = false;
  musicVolume = 1;
  unsupported: Set<string>;

  constructor(unsupported: string[]) {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.sfxMaster = this.ctx.createGain();
    this.sfxMaster.connect(this.master);
    this.musicGain = this.ctx.createGain();
    this.musicGain.connect(this.master);
    this.unsupported = new Set(unsupported.map((f) => f.toLowerCase()));
    const resume = () => { if (this.ctx.state !== "running") void this.ctx.resume(); this.music?.play().catch(() => {}); };
    addEventListener("keydown", resume);
    addEventListener("pointerdown", resume);
  }

  static url(path: string): string {
    return path.replace(/^\.\//, "").replace(/\\/g, "/");
  }

  decode(path: string): Promise<AudioBuffer | null> {
    const url = Audio.url(path);
    let p = this.pending.get(url);
    if (!p) {
      p = fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
        .then((b) => this.ctx.decodeAudioData(b))
        .catch(() => null);
      this.pending.set(url, p);
    }
    return p;
  }

  load(slot: number, path: string) {
    void this.decode(path).then((buf) => { if (buf) this.slots.set(slot, buf); });
    return 1;
  }

  play(slot: number, pan: number, volume: number, freq: number): number {
    const buf = this.slots.get(slot);
    if (!buf) return -1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const rate = freq > 0 ? freq / SAMPLE_RATE : 1;
    src.playbackRate.value = rate;
    const gain = this.ctx.createGain();
    gain.gain.value = Math.max(0, Math.min(255, volume)) / 255;
    const p = this.ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, (pan - 128) / 128));
    src.connect(gain).connect(p).connect(this.sfxMaster);
    const id = this.nextChannel++;
    const ch: Channel = { src, gain, pan: p, start: this.ctx.currentTime, rate, ended: false };
    src.onended = () => { ch.ended = true; this.channels.delete(id); };
    src.start();
    this.channels.set(id, ch);
    return id;
  }

  stop(channel: number) {
    const ch = this.channels.get(channel);
    if (ch) { try { ch.src.stop(); } catch {} this.channels.delete(channel); }
  }
  volume(channel: number, v: number) {
    const ch = this.channels.get(channel);
    if (ch) ch.gain.gain.value = Math.max(0, Math.min(255, v)) / 255;
  }
  setPan(channel: number, v: number) {
    const ch = this.channels.get(channel);
    if (ch) ch.pan.pan.value = Math.max(-1, Math.min(1, (v - 128) / 128));
  }
  /** Position in samples (get=1) or restart at a sample offset (get=0). */
  position(get: number, channel: number, pos: number): number {
    const ch = this.channels.get(channel);
    if (!ch) return 0;
    if (get) return (this.ctx.currentTime - ch.start) * ch.rate * SAMPLE_RATE;
    const buf = ch.src.buffer!;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = ch.rate;
    src.connect(ch.gain);
    try { ch.src.onended = null; ch.src.stop(); } catch {}
    src.onended = () => { ch.ended = true; this.channels.delete(channel); };
    const offset = pos / SAMPLE_RATE;
    src.start(0, Math.min(offset, buf.duration));
    ch.src = src;
    ch.start = this.ctx.currentTime - offset / ch.rate;
    return 1;
  }
  masterVolume(v: number) { this.sfxMaster.gain.value = Math.max(0, Math.min(255, v)) / 255; }

  playMusic(path: string) {
    this.stopMusic();
    const url = Audio.url(path);
    if (this.unsupported.has(url.split("/").pop()!.toLowerCase())) return 0;
    const el = new window.Audio(url);
    el.loop = this.musicLoop;
    el.crossOrigin = "anonymous";
    this.music = el;
    this.musicNode = this.ctx.createMediaElementSource(el);
    this.musicNode.connect(this.musicGain);
    el.play().catch(() => {});
    return 1;
  }
  stopMusic() {
    if (this.music) { this.music.pause(); this.musicNode?.disconnect(); this.music = null; this.musicNode = null; }
  }
  pauseMusic() {
    if (!this.music) return;
    if (this.music.paused) this.music.play().catch(() => {}); else this.music.pause();
  }
  toggleLoop(): number {
    this.musicLoop = !this.musicLoop;
    if (this.music) this.music.loop = this.musicLoop;
    return this.musicLoop ? 1 : 0;
  }
  setMusicVolume(v: number) {
    this.musicVolume = Math.max(0, Math.min(255, v)) / 255;
    this.musicGain.gain.value = this.musicVolume;
  }
  musicTime(): number { return this.music ? this.music.currentTime * 1000 : 0; }
  musicPlaying(): number { return this.music && !this.music.paused && !this.music.ended ? 1 : 0; }
}
