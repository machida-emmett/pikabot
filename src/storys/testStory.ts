export const testScenes = {
  start: {
    text: "下部の▶をクリックで一括文字送りします。\nテキストボックスのクリックで次に進みます。",
    choices: [],
    next: "txt2",
    images: ['/public/images/img1.png','/public/images/img2.png'],
    background: "/public/images/bg1.png"
  },
  txt2: {
    text: "上の線は進捗状況を表しています。",
    choices: [],
    next: "txt3",
    images: ['/public/images/img3.png'],
    background: "/public/images/bg2.png"
  },
  txt3: {
    text: "選択肢も出せます。\nこんな感じで。",
    choices: [
      { label: "了解した。", nextId: "txt4" },
      { label: "小癪なり。", nextId: "txt5" },
      { label: "戻る。", nextId: "txt2" },
    ],
    next:undefined,
    images: undefined,
    background: "/public/images/bg3.png"
  },
  txt4: {
    text: "素直でよろしい。",
    choices: [],
    next: "txt6",
    images: undefined,
    background: undefined
  },
  txt5: {
    text: "小癪？生意気だね。",
    choices: [],
    next: "txt6",
    images: undefined,
    background: undefined
  },
  txt6: {
    text: "以上です。",
    choices: [{ label: "最初に戻る。", nextId: "start" },],
    next: "txt6",
    images: undefined,
    background: undefined
  },
} as const;