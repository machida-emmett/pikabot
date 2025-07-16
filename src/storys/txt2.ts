export const txt2 = {
"start":  {
    text: `pythonでツール作ってみたよ。`,
    choices: [],
    next: "txt2",
    images: ["/public/images/img1.png","/public/images/img2.png"],
    background: "/public/images/bg1.png"
  },
"txt2":  {
    text: `うまく出力されとるかね。`,
    choices: [],
    next: "txt3",
    images: ["/public/images/img3.png"],
    background: "/public/images/bg2.png"
  },
"txt3":  {
    text: `選択肢も出せます。
こんな感じで。`,
    choices: [{ label: "やるじゃん", nextId: "txt4" },{ label: "よゆーだよね～", nextId: "txt5" },{ label: "戻る。", nextId: "txt2" }],
    next: undefined,
    images: undefined,
    background: "/public/images/bg3.png"
  },
"txt4":  {
    text: `まあほとんどAIが書いてるけどね。`,
    choices: [],
    next: "txt6",
    images: undefined,
    background: undefined
  },
"txt5":  {
    text: `時代はAIですよ。`,
    choices: [],
    next: "txt6",
    images: undefined,
    background: undefined
  },
"txt6":  {
    text: `以上です。`,
    choices: [{ label: "最初に戻る。", nextId: "start" },{ label: "まだ遊び足りないよ～", nextId: "txt7" }],
    next: undefined,
    images: undefined,
    background: undefined
  },
"txt7":  {
    text: `ほなもっと遊ぼうか？
改行もできちゃうぜ。`,
    choices: [],
    next: "txt8",
    images: undefined,
    background: undefined
  },
"txt8":  {
    text: `うーん書きやすのか？これ？？
感じもつかめたのでここらで終わるか。`,
    choices: [{ label: "最初に戻る。", nextId: "start" }],
    next: undefined,
    images: undefined,
    background: undefined
  }
} as const;