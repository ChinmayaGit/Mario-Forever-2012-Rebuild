import { allCode } from "./sources.ts";
import { parse } from "./parser.ts";

const { scripts, events, rooms } = allCode();
let ok = 0;
const errors: string[] = [];
for (const u of [...scripts, ...events, ...rooms]) {
  try {
    parse(u.src);
    ok++;
  } catch (e) {
    errors.push(`${u.id}: ${(e as Error).message}`);
  }
}
console.log(`parsed ${ok}, failed ${errors.length}`);
console.log(errors.slice(0, 40).join("\n"));
