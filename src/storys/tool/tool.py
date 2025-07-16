import sys
import os
import re
import json

def parse_scene_text(filepath):
    scenes = {}
    current_scene = None
    scene_data = {}

    with open(filepath, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            m = re.match(r'^\[(.+)\]$', line)
            if m:
                # 新しいシーン開始
                if current_scene:
                    scenes[current_scene] = scene_data
                current_scene = m.group(1)
                scene_data = {}
                continue
            # key=value形式
            if '=' in line:
                key, val = line.split('=', 1)
                scene_data[key.strip()] = val.strip()
        # 最後のシーンを保存
        if current_scene:
            scenes[current_scene] = scene_data
    return scenes

def convert_to_ts(scenes, export_name="testScenes"):
    # scenes の各シーン辞書を整形する
    out = {}
    for scene_id, data in scenes.items():
        # textは必須（無ければ空文字）
        text = data.get('text', '').replace('\\n', '\n')

        # nextは未指定ならundefinedにする
        next_id = data.get('next')
        if not next_id:
            next_val = "undefined"
        else:
            next_val = f'"{next_id}"'

        # backgroundは未指定でundefined
        bg = data.get('background')
        background_val = f'"{bg}"' if bg else "undefined"

        # imagesは未指定でundefined。指定あれば配列文字列に
        imgs = data.get('images')
        if imgs:
            imgs_list = [img.strip() for img in imgs.split(',') if img.strip()]
            if imgs_list:
                images_val = "[" + ",".join(f'"{i}"' for i in imgs_list) + "]"
            else:
                images_val = "undefined"
        else:
            images_val = "undefined"

        # choicesは空配列が基本。指定あれば配列に変換
        choices_val = "[]"
        choice_str = data.get('choice')
        if choice_str:
            choice_items = [c.strip() for c in choice_str.split(';') if c.strip()]
            choice_list = []
            for item in choice_items:
                parts = [p.strip() for p in item.split(',', 1)]
                if len(parts) == 2:
                    label, nextid = parts
                    choice_list.append(f'{{ label: "{label}", nextId: "{nextid}" }}')
            if choice_list:
                choices_val = "[" + ",".join(choice_list) + "]"

        # 組み立て
        out[scene_id] = f"""  {{
    text: `{text}`,
    choices: {choices_val},
    next: {next_val},
    images: {images_val},
    background: {background_val}
  }}"""
    # 全体結合
    # ts_content = "export const testScenes = {\n" + ",\n".join(f'"{k}":{v}' for k,v in out.items()) + "\n} as const;"
    ts_content = f"export const {export_name} = {{\n" + ",\n".join(f'"{k}":{v}' for k,v in out.items()) + "\n} as const;"
    return ts_content

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_scenes.py input.txt")
        sys.exit(1)
    input_path = sys.argv[1]

    # 入力ファイル名から拡張子除いたベース名を取得
    base = os.path.basename(input_path)
    export_name = os.path.splitext(base)[0]

    # 出力ファイル名は入力の拡張子だけ.tsに変える
    output_path = os.path.splitext(input_path)[0] + ".ts"

    scenes = parse_scene_text(input_path)
    ts = convert_to_ts(scenes, export_name)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts)
    print(f"Converted {len(scenes)} scenes from '{input_path}' to '{output_path}' with export name '{export_name}'")
