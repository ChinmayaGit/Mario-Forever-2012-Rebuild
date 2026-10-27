use gm8exe::{asset::CodeAction, GameAssets};
use serde_json::{json, Value};
use std::{
    env, fs,
    io::BufWriter,
    path::{Path, PathBuf},
};

const EVENT_TYPES: [&str; 12] = [
    "create", "destroy", "alarm", "step", "collision", "keyboard", "mouse", "other", "draw", "keypress",
    "keyrelease", "trigger",
];

fn s(p: &gm8exe::asset::PascalString) -> String {
    p.to_string()
}

fn safe(name: &str) -> String {
    name.chars().map(|c| if c.is_ascii_alphanumeric() || c == '_' || c == '-' { c } else { '_' }).collect()
}

fn write_png(path: &Path, w: u32, h: u32, color: png::ColorType, data: &[u8]) {
    let file = fs::File::create(path).expect("create png");
    let mut enc = png::Encoder::new(BufWriter::new(file), w, h);
    enc.set_color(color);
    enc.set_depth(png::BitDepth::Eight);
    enc.write_header().and_then(|mut wr| wr.write_image_data(data)).expect("write png");
}

/// GM8 stores pixels as BGRA.
fn bgra_to_rgba(data: &[u8]) -> Vec<u8> {
    let mut out = data.to_vec();
    for px in out.chunks_exact_mut(4) {
        px.swap(0, 2);
    }
    out
}

fn name_of<T>(list: &gm8exe::AssetList<T>, idx: i32, get: impl Fn(&T) -> String) -> Value {
    if idx < 0 {
        return Value::Null
    }
    match list.get(idx as usize) {
        Some(Some(a)) => Value::String(get(a)),
        _ => Value::Null,
    }
}

fn action_json(a: &CodeAction, assets: &GameAssets) -> Value {
    let params: Vec<String> = a.param_strings[..a.param_count].iter().map(s).collect();
    json!({
        "lib": a.lib_id,
        "id": a.id,
        "kind": a.action_kind,
        "exec": a.execution_type,
        "applies_to": a.applies_to,
        "applies_to_name": name_of(&assets.objects, a.applies_to, |o| s(&o.name)),
        "relative": a.is_relative,
        "not": a.invert_condition,
        "question": a.is_condition,
        "fn": s(&a.fn_name),
        "param_types": &a.param_types[..a.param_count],
        "params": params,
    })
}

fn event_label(ty: usize, sub: u32, assets: &GameAssets) -> String {
    match ty {
        4 => format!("collision:{}", name_of(&assets.objects, sub as i32, |o| s(&o.name)).as_str().unwrap_or("?")),
        _ => format!("{}:{}", EVENT_TYPES[ty], sub),
    }
}

/// Human-readable dump of an object's events, with GML code inline.
fn object_gml(obj: &gm8exe::asset::Object, assets: &GameAssets) -> String {
    let mut out = String::new();
    for (ty, list) in obj.events.iter().enumerate() {
        for (sub, actions) in list {
            out += &format!("#event {}\n", event_label(ty, *sub, assets));
            for a in actions {
                if a.lib_id == 1 && a.id == 603 {
                    if a.applies_to != -1 {
                        out += &format!("// applies_to {}\n", a.applies_to);
                    }
                    out += &s(&a.param_strings[0]);
                    out += "\n";
                } else {
                    let params: Vec<String> = a.param_strings[..a.param_count].iter().map(s).collect();
                    out += &format!(
                        "// DnD lib={} id={} fn={} applies_to={} relative={} not={} params={:?}\n",
                        a.lib_id,
                        a.id,
                        s(&a.fn_name),
                        a.applies_to,
                        a.is_relative,
                        a.invert_condition,
                        params
                    );
                }
            }
            out += "\n";
        }
    }
    out
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("usage: gm8export <game.exe> <outdir>");
        std::process::exit(2);
    }
    let data = fs::read(&args[1]).expect("read exe");
    let assets = gm8exe::reader::from_exe(data, None::<fn(&str)>, false, true).expect("parse exe");
    let out = PathBuf::from(&args[2]);
    for d in ["sprites", "backgrounds", "scripts", "objects", "rooms", "sounds", "fonts"] {
        fs::create_dir_all(out.join(d)).unwrap();
    }

    // Sprites. Collision masks are bit-packed row by row (LSB first) into masks.bin.
    let mut mask_bin: Vec<u8> = Vec::new();
    let mut sprites = Vec::new();
    for (i, sp) in assets.sprites.iter().enumerate() {
        let Some(sp) = sp else { sprites.push(Value::Null); continue };
        let name = s(&sp.name);
        let dir = out.join("sprites").join(safe(&name));
        fs::create_dir_all(&dir).unwrap();
        for (f, frame) in sp.frames.iter().enumerate() {
            write_png(&dir.join(format!("{f}.png")), frame.width, frame.height, png::ColorType::Rgba, &bgra_to_rgba(&frame.data));
        }
        let mut masks = Vec::new();
        for col in sp.colliders.iter() {
            let offset = mask_bin.len();
            let mut bits = vec![0u8; (col.data.len() + 7) / 8];
            for (i, &b) in col.data.iter().enumerate() {
                if b {
                    bits[i / 8] |= 1 << (i % 8);
                }
            }
            mask_bin.extend_from_slice(&bits);
            masks.push(json!({
                "w": col.width, "h": col.height,
                "left": col.bbox_left, "right": col.bbox_right, "top": col.bbox_top, "bottom": col.bbox_bottom,
                "offset": offset,
            }));
        }
        let (w, h) = sp.frames.first().map(|f| (f.width, f.height)).unwrap_or((0, 0));
        sprites.push(json!({
            "index": i, "name": name, "dir": safe(&s(&sp.name)),
            "width": w, "height": h, "frames": sp.frames.len(),
            "origin_x": sp.origin_x, "origin_y": sp.origin_y,
            "per_frame_masks": sp.per_frame_colliders, "masks": masks,
        }));
    }
    fs::write(out.join("sprites.json"), serde_json::to_string_pretty(&sprites).unwrap()).unwrap();
    fs::write(out.join("masks.bin"), &mask_bin).unwrap();

    // Backgrounds
    let mut bgs = Vec::new();
    for (i, bg) in assets.backgrounds.iter().enumerate() {
        let Some(bg) = bg else { bgs.push(Value::Null); continue };
        let name = s(&bg.name);
        if let Some(d) = &bg.data {
            write_png(&out.join("backgrounds").join(format!("{}.png", safe(&name))), bg.width, bg.height, png::ColorType::Rgba, &bgra_to_rgba(d));
        }
        bgs.push(json!({ "index": i, "name": name, "file": safe(&name), "width": bg.width, "height": bg.height }));
    }
    fs::write(out.join("backgrounds.json"), serde_json::to_string_pretty(&bgs).unwrap()).unwrap();

    // Scripts
    let mut scripts = Vec::new();
    for (i, sc) in assets.scripts.iter().enumerate() {
        let Some(sc) = sc else { scripts.push(Value::Null); continue };
        let name = s(&sc.name);
        fs::write(out.join("scripts").join(format!("{}.gml", safe(&name))), sc.source.0.as_ref()).unwrap();
        scripts.push(json!({ "index": i, "name": name }));
    }
    fs::write(out.join("scripts.json"), serde_json::to_string_pretty(&scripts).unwrap()).unwrap();

    // Sounds
    let mut sounds = Vec::new();
    for (i, snd) in assets.sounds.iter().enumerate() {
        let Some(snd) = snd else { sounds.push(Value::Null); continue };
        let name = s(&snd.name);
        let ext = s(&snd.extension);
        if let Some(d) = &snd.data {
            fs::write(out.join("sounds").join(format!("{}{}", safe(&name), ext)), d.as_ref()).unwrap();
        }
        sounds.push(json!({
            "index": i, "name": name, "ext": ext, "source": s(&snd.source),
            "kind": snd.kind as u32, "volume": snd.volume, "pan": snd.pan,
        }));
    }
    fs::write(out.join("sounds.json"), serde_json::to_string_pretty(&sounds).unwrap()).unwrap();

    // Fonts
    let mut fonts = Vec::new();
    for (i, f) in assets.fonts.iter().enumerate() {
        let Some(f) = f else { fonts.push(Value::Null); continue };
        let name = s(&f.name);
        if f.map_width > 0 && f.map_height > 0 {
            let rgba: Vec<u8> = f.pixel_map.iter().flat_map(|&a| [255, 255, 255, a]).collect();
            write_png(&out.join("fonts").join(format!("{}.png", safe(&name))), f.map_width, f.map_height, png::ColorType::Rgba, &rgba);
        }
        let glyphs: Vec<&[u32]> = f.dmap.chunks(6).collect();
        fonts.push(json!({
            "index": i, "name": name, "sys_name": s(&f.sys_name), "size": f.size, "bold": f.bold, "italic": f.italic,
            "range_start": f.range_start, "range_end": f.range_end, "glyphs": glyphs,
        }));
    }
    fs::write(out.join("fonts.json"), serde_json::to_string_pretty(&fonts).unwrap()).unwrap();

    // Objects
    let mut objects = Vec::new();
    for (i, obj) in assets.objects.iter().enumerate() {
        let Some(obj) = obj else { objects.push(Value::Null); continue };
        let name = s(&obj.name);
        let mut events = Vec::new();
        for (ty, list) in obj.events.iter().enumerate() {
            for (sub, actions) in list {
                events.push(json!({
                    "type": EVENT_TYPES[ty], "type_id": ty, "sub": sub,
                    "label": event_label(ty, *sub, &assets),
                    "actions": actions.iter().map(|a| action_json(a, &assets)).collect::<Vec<_>>(),
                }));
            }
        }
        fs::write(out.join("objects").join(format!("{}.gml", safe(&name))), object_gml(obj, &assets)).unwrap();
        objects.push(json!({
            "index": i, "name": name,
            "sprite": name_of(&assets.sprites, obj.sprite_index, |x| s(&x.name)),
            "mask": name_of(&assets.sprites, obj.mask_index, |x| s(&x.name)),
            "parent": name_of(&assets.objects, obj.parent_index, |x| s(&x.name)),
            "solid": obj.solid, "visible": obj.visible, "depth": obj.depth, "persistent": obj.persistent,
            "events": events,
        }));
    }
    fs::write(out.join("objects.json"), serde_json::to_string(&objects).unwrap()).unwrap();

    // Rooms
    let mut room_index = Vec::new();
    for (i, room) in assets.rooms.iter().enumerate() {
        let Some(room) = room else { room_index.push(Value::Null); continue };
        let name = s(&room.name);
        let obj_name = |id: i32| name_of(&assets.objects, id, |x| s(&x.name));
        let bg_name = |id: i32| name_of(&assets.backgrounds, id, |x| s(&x.name));
        let r = json!({
            "index": i, "name": name, "caption": s(&room.caption),
            "width": room.width, "height": room.height, "speed": room.speed, "persistent": room.persistent,
            "bg_colour": room.bg_colour.as_hexstring(), "clear_screen": room.clear_screen,
            "creation_code": s(&room.creation_code),
            "backgrounds": room.backgrounds.iter().map(|b| json!({
                "visible": b.visible_on_start, "foreground": b.is_foreground, "bg": bg_name(b.source_bg),
                "x": b.xoffset, "y": b.yoffset, "tile_h": b.tile_horz, "tile_v": b.tile_vert,
                "hspeed": b.hspeed, "vspeed": b.vspeed, "stretch": b.stretch,
            })).collect::<Vec<_>>(),
            "views_enabled": room.views_enabled,
            "views": room.views.iter().map(|v| json!({
                "visible": v.visible, "x": v.source_x, "y": v.source_y, "w": v.source_w, "h": v.source_h,
                "port_x": v.port_x, "port_y": v.port_y, "port_w": v.port_w, "port_h": v.port_h,
                "hborder": v.following.hborder, "vborder": v.following.vborder,
                "hspeed": v.following.hspeed, "vspeed": v.following.vspeed, "follow": obj_name(v.following.target),
            })).collect::<Vec<_>>(),
            "instances": room.instances.iter().map(|n| json!({
                "x": n.x, "y": n.y, "obj": obj_name(n.object), "id": n.id, "code": s(&n.creation_code),
                "xscale": n.xscale, "yscale": n.yscale, "blend": n.blend, "angle": n.angle,
            })).collect::<Vec<_>>(),
            "tiles": room.tiles.iter().map(|t| json!({
                "x": t.x, "y": t.y, "bg": bg_name(t.source_bg), "tx": t.tile_x, "ty": t.tile_y,
                "w": t.width, "h": t.height, "depth": t.depth, "id": t.id,
                "xscale": t.xscale, "yscale": t.yscale, "blend": t.blend,
            })).collect::<Vec<_>>(),
        });
        fs::write(out.join("rooms").join(format!("{}.json", safe(&name))), serde_json::to_string(&r).unwrap()).unwrap();
        room_index.push(json!({
            "index": i, "name": name, "file": safe(&name), "width": room.width, "height": room.height,
            "instances": room.instances.len(), "tiles": room.tiles.len(),
        }));
    }
    fs::write(out.join("rooms.json"), serde_json::to_string_pretty(&room_index).unwrap()).unwrap();

    let room_order: Vec<Value> = assets.room_order.iter().map(|&r| name_of(&assets.rooms, r, |x| s(&x.name))).collect();
    let st = &assets.settings;
    let game = json!({
        "version": format!("{:?}", assets.version),
        "game_id": assets.game_id,
        "room_order": room_order,
        "library_init_strings": assets.library_init_strings.iter().map(s).collect::<Vec<_>>(),
        "constants": assets.constants.iter().map(|c| json!({"name": s(&c.name), "value": s(&c.expression)})).collect::<Vec<_>>(),
        "settings": {
            "fullscreen": st.fullscreen, "scaling": st.scaling, "interpolate_pixels": st.interpolate_pixels,
            "clear_colour": st.clear_colour, "display_cursor": st.display_cursor,
            "zero_uninitialized_vars": st.zero_uninitialized_vars, "swap_creation_events": st.swap_creation_events,
        },
    });
    fs::write(out.join("game.json"), serde_json::to_string_pretty(&game).unwrap()).unwrap();
    println!(
        "exported {} sprites, {} backgrounds, {} scripts, {} objects, {} rooms, {} sounds",
        sprites.len(), bgs.len(), scripts.len(), objects.len(), room_index.len(), sounds.len()
    );
}
