import { useEffect, useState, useRef} from 'react';
import { scenes } from './story';
import './App.css';

/**
 * Appコンポーネント全体の役割：
 * ・シーンIDに応じたテキストのアニメーション表示
 * ・選択肢の表示と選択処理
 * ・テキストログの管理と表示
 */
function App() {
  const [sceneId, setSceneId] = useState<keyof typeof scenes | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scene = sceneId ? scenes[sceneId] : null;
  const fullText = scene ? scene.text : '';

  const [log, setLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  
  const isChoiceTime = scene &&  !isTyping && scene.choices.length > 0;
  const indicatorSymbol = isChoiceTime ? '△' : '▼';

  const sceneKeys = Object.keys(scenes);
  const currentIndex = sceneId ? sceneKeys.indexOf(sceneId) : 0;

  const progressPercent = sceneId?.includes('end')
    ? 100
    : ((currentIndex) / (sceneKeys.length - 1)) * 100;

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isSkipping, setIsSkipping] = useState(false);

  const imageList = scene?.images || [];
  const backgroundImage  = scene?.background || '';

  // シーンが変わったらテキスト表示アニメーションを開始する処理
  useEffect(() => {
    setShowChoices(false);
    setDisplayedText('');
    setCharIndex(0);

    //最初のシーンではログをリセットする。
    if(sceneId == "start"){
      setLog([]);
    }

    //文章を表示させるまでにちょっと遅延させる。
    const timer = setTimeout(() => {
      if(scene != null){
        showText(scene.text);
      }      
    }, 800);
    return () => clearTimeout(timer);

    // console.log('現在のsceneId:', sceneId);
    // console.log('choices:', scenes[sceneId].choices);
  }, [sceneId]);

  // charIndexの変化に応じて画面に表示するテキストを更新する処理
  useEffect(() => {
    setDisplayedText(fullText.slice(0, charIndex));
  }, [charIndex, fullText]);

  //シーン切り替え時に背景画像変更//////////////////////////////////////////////////////////
  useEffect(() => {
    const root = document.getElementById('root');
    if (root && scene?.background) {
      root.style.backgroundImage = `url(${scene.background})`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
      root.style.backgroundRepeat = 'no-repeat';
    }
  }, [scene]);  

  //タイプアニメーション//////////////////////////////////////////////////////////
  const showText = (text: string) => {
    setDisplayedText('');
    setCharIndex(0);
    setIsTyping(true);

    let index = 0;
    const id = setInterval(() => {
      index++;
      setCharIndex(index);

      if (index >= text.length) {
        clearInterval(id);
        setIsTyping(false);
        setShowChoices(true);
        setLog((prev) => {
          if (prev.length > 0 && prev[prev.length - 1] === text) {
            return prev;
          }
          return [...prev, text];
        });
      }
    }, 60);

    typingIntervalRef.current = id;
  };

  //テキストボックスのクリックイベント//////////////////////////////////////////////////////////
  const handleTextClick = () => {
    if (isSkipping || isTyping) return;

    // タイプアニメーションが終わっている状態
    if (scene!.choices.length > 0) setShowChoices(true);

    if (scene!.next) {
      setSceneId(scene!.next);
    }
  };

  //スキップボタン（▶）
  const handleSkipClick = () => {
    if (!isTyping) return;

    setIsSkipping(true);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setCharIndex(fullText.length);
    setIsTyping(false);
    setLog((prev) => [...prev, fullText]);


    setTimeout(() => setIsSkipping(false), 200);
  };


  ////////////////////////////////////////////////////////////
  return (
    <>
      {!isGameStarted ? (
        <div className="start-screen">
          <h1>ピカボットの日常</h1>
          <button onClick={() => {
            setIsGameStarted(true);
            setTimeout(() => {
              setSceneId('start');
            }, 500);
          }}>ゲーム開始</button>
        </div>
      ) : (
        <>
          <div className={`choice-container ${showChoices ? 'show' : ''}`}>
            {showChoices && scene!.choices.length > 0 &&
              scene!.choices.map((choice, idx) => (
                <button key={idx} 
                  onClick={() => {
                      setLog((prev) => [...prev, `▶${choice.label}`]);

                      if (choice.nextId === 'reload') {
                        window.location.reload();
                        return;
                      }

                      setSceneId(choice.nextId);
                  }}>
                  {choice.label}
                </button>
              ))}
          </div>

          {imageList.length > 0 && (
            <div className="scene-images">
              {imageList.slice(0, 2).map((src, idx) => (
                <img key={idx} src={src} alt={`scene-img-${idx}`} className="scene-image" />
              ))}
            </div>
          )}

          <div className="text-box" onClick={handleTextClick}>
            <div className="global-progress-wrapper">
              <div
                className="global-progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p>{displayedText}</p>        

            <span className={`next-indicator ${isChoiceTime ? 'stopped' : ''}`}>
              {indicatorSymbol}
            </span>

          </div>

          {/* スキップボタン */}
          <button className={`skip-button ${isTyping ? 'enabled' : 'disabled'}`}
                  onClick={handleSkipClick}
          >
            ▶
          </button>

          <button className="log-button" onClick={() => setShowLog((prev) => !prev)}>ログ</button>

          {/* ログモーダル */}
          {showLog && (
            <div className="log-modal" onClick={() => setShowLog(false)}>
              <div className="log-content" onClick={e => e.stopPropagation()}>
                <h2>テキストログ</h2>
                <div className="log-list">
                  {log.map((text, idx) => (
                    <p key={idx} className={text.trim().startsWith('▶') ? 'log-choice' : ''}>
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              <button className="close-button" onClick={() => setShowLog(false)}>閉じる</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
