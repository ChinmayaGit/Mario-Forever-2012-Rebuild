# Summarise a CDP Profiler.stop JSON: self time per function, top N.
import json, sys, collections
d = json.load(open(sys.argv[1]))
p = d.get("profile", d)
nodes = {n["id"]: n for n in p["nodes"]}
dt = collections.Counter()
deltas = p["timeDeltas"]
for sid, delta in zip(p["samples"], deltas):
    dt[sid] += delta
selft = collections.Counter()
for nid, t in dt.items():
    cf = nodes[nid]["callFrame"]
    key = f'{cf["functionName"] or "(anon)"} {cf["url"].split("/")[-1]}:{cf["lineNumber"]}'
    selft[key] += t
total = sum(selft.values())
for k, v in selft.most_common(int(sys.argv[2]) if len(sys.argv) > 2 else 30):
    print(f"{v/1000:8.1f}ms {100*v/total:5.1f}%  {k}")
