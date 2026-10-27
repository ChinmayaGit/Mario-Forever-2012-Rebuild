# Decode a CDP Runtime.evaluate response holding a PNG data URL into a file.
import base64, json, sys
d = json.load(open(sys.argv[1]))
v = d["result"]["value"]
open(sys.argv[2], "wb").write(base64.b64decode(v.split(",", 1)[1]))
