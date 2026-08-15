import { useEffect, useState } from "react";
import { ArrowRight, Compass, RotateCcw, Sparkles } from "lucide-react";
import DarklandGameCanvas from "../components/DarklandGameCanvas";
import type { HudSnapshot } from "../game/GameWorld";

/** Style note: Darkland Night Park — stark cream type over charcoal game space, acid shard accents, compact expedition labels, and no copied channel branding. */
const initialHud: HudSnapshot = {
  shards: 0,
  total: 3,
  state: "explore",
  prompt: "",
  objective: "Найди три осколка памяти.",
};

export default function Home() {
  const [started, setStarted] = useState(() => new URLSearchParams(window.location.search).has("demo"));
  const [hud, setHud] = useState(initialHud);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    setDemo(new URLSearchParams(window.location.search).has("demo"));
  }, []);

  return (
    <main className={`darkland-app ${started ? "is-live" : "is-threshold"} ${hud.state === "complete" ? "is-complete" : ""}`}>
      <DarklandGameCanvas demo={demo && started} onHud={setHud} />
      <div className="darkland-vignette" aria-hidden="true" />
      {!started && (
        <section className="darkland-threshold" aria-label="Вход в игру">
          <div className="threshold-meta"><span>DARKLAND / ORIGINAL GAME</span><span>FIELD TEST 01</span></div>
          <div className="threshold-copy">
            <div className="mark-orbit"><span /><span /><span /></div>
            <p className="eyebrow">Кубический ночной парк</p>
            <h1>Ночь<br /><em>помнит</em></h1>
            <p className="threshold-description">Исследуй парк, собери три осколка памяти и открой Архивный дом.</p>
            <button className="enter-game" onClick={() => setStarted(true)}><span>Войти в парк</span><ArrowRight size={18} /></button>
          </div>
          <div className="threshold-footer"><span>WASD / DRAG / E</span><span>ОРИГИНАЛЬНАЯ ИГРОВАЯ СЦЕНА</span></div>
        </section>
      )}
      {started && (
        <>
          <header className="game-header">
            <div><span className="brand-dot" /> DARKLAND / NIGHT PARK</div>
            <div className="header-right"><span className="live-dot" /> LIVE WORLD <span className="header-divider">/</span> ARCHIVE HOUSE</div>
          </header>
          <aside className="game-rail">
            <div className="rail-caption">EXPEDITION</div>
            <div className="shard-count" aria-label={`${hud.shards} из ${hud.total} осколков`}><strong>{String(hud.shards).padStart(2, "0")}</strong><span>/ {String(hud.total).padStart(2, "0")}</span></div>
            <div className="rail-label">MEMORY SHARDS</div>
            <div className="shard-dots">{Array.from({ length: hud.total }).map((_, index) => <span key={index} className={index < hud.shards ? "found" : ""} />)}</div>
            <div className="rail-rule" />
            <div className="controls"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVE</span><span><kbd>E</kbd> COLLECT</span><span><kbd>R</kbd> RESET</span></div>
          </aside>
          <section className="objective-panel" aria-live="polite">
            <div className="objective-kicker"><Compass size={14} /> CURRENT OBJECTIVE</div>
            <h2>{hud.objective}</h2>
            {hud.prompt && <p className="interaction-prompt"><Sparkles size={14} /> {hud.prompt}</p>}
            {hud.state === "complete" && <p className="completion-copy">Ты прошёл через ночь. Архив сохранён.</p>}
          </section>
          <button className="reset-button" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "r" }))}><RotateCcw size={14} /> Сбросить маршрут</button>
          <footer className="game-footer"><span>ORIGINAL DARK PARK PROTOTYPE</span><span>{hud.state === "complete" ? "ROUTE COMPLETE" : "FIND THE THREE SHARDS"}</span></footer>
        </>
      )}
    </main>
  );
}
