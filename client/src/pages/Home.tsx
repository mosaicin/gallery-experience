import { useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Maximize2, Moon, Mouse, Sparkles } from "lucide-react";
import GalleryCanvas from "../components/GalleryCanvas";

/** Style note: Nocturne Museum — dark room, amber beam, sparse serif title, compact mono metadata, and labels that feel like museum placards. */
const artworks = [
  { title: "Still / Moving", artist: "Mara Voss", year: "2026", note: "A study in patience", image: "/manus-storage/gallery-painting-one_e021c680.png" },
  { title: "Blue Interval", artist: "Noah Vale", year: "2025", note: "Light held in geometry", image: "/manus-storage/gallery-painting-two_b8354476.png" },
  { title: "Afterimage", artist: "Iris Calder", year: "2026", note: "What remains after looking", image: "/manus-storage/gallery-painting-three_6e637198.png" },
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [selected, setSelected] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n") setNightMode((value) => !value);
      if (event.key === "ArrowRight") setSelected((value) => (value + 1) % artworks.length);
      if (event.key === "ArrowLeft") setSelected((value) => (value - 1 + artworks.length) % artworks.length);
      if (event.key === "Enter" && !entered) setEntered(true);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [entered]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <main className={`gallery-app ${entered ? "is-entered" : "is-threshold"} ${nightMode ? "is-night" : ""}`}>
      <GalleryCanvas entered={entered} nightMode={nightMode} selected={selected} onSelect={setSelected} />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {!entered && (
        <section className="threshold" aria-label="Enter the gallery">
          <div className="threshold-topline"><span>EXHIBITION 01</span><span>OPEN AFTER DARK</span></div>
          <div className="threshold-center">
            <img className="threshold-mark" src="/manus-storage/gallery-mark_1277cef2.png" alt="" aria-hidden="true" />
            <div className="threshold-kicker"><span className="threshold-dot" /> A DIGITAL EXHIBITION</div>
            <h1>The Gallery</h1>
            <p>A room for looking slowly.</p>
            <button className="enter-button" onClick={() => setEntered(true)}>
              <span>Step past the threshold</span><ArrowDown size={15} strokeWidth={1.5} />
            </button>
            <div className="loading-line"><span /></div>
          </div>
          <div className="threshold-bottom"><span>SCROLL / WANDER / RETURN</span><span>© 2026 TG</span></div>
        </section>
      )}

      {entered && (
        <>
          <header className="gallery-header">
            <div className="brand-lockup">
              <img src="/manus-storage/gallery-mark_1277cef2.png" alt="The Gallery mark" />
              <span>The Gallery</span>
            </div>
            <div className="header-status"><span className="status-dot" />LIVE EXHIBITION <span className="status-divider">/</span> ROOM 01</div>
            <button className="icon-button" aria-label="Toggle fullscreen" onClick={toggleFullscreen}><Maximize2 size={16} /></button>
          </header>

          <aside className="control-rail">
            <div className="rail-label">NAVIGATION</div>
            <div className="key-cluster"><span /><div><kbd>W</kbd></div><span /><div><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div><span /></div>
            <div className="rail-line" />
            <div className="rail-help"><Mouse size={14} /><span>DRAG<br />TO LOOK</span></div>
            <button className={`rail-toggle ${nightMode ? "active" : ""}`} onClick={() => setNightMode((value) => !value)} aria-label="Toggle night mode"><Moon size={16} /><span>N</span></button>
          </aside>

          <section className="art-label" aria-live="polite">
            <div className="label-index">0{selected + 1} / 03</div>
            <h2>{artworks[selected].title}</h2>
            <div className="label-meta"><span>{artworks[selected].artist}</span><span>{artworks[selected].year}</span></div>
            <p>{artworks[selected].note}</p>
            <div className="label-actions">
              <button onClick={() => setSelected((value) => (value - 1 + artworks.length) % artworks.length)} aria-label="Previous artwork"><ChevronLeft size={16} /></button>
              <button onClick={() => setSelected((value) => (value + 1) % artworks.length)} aria-label="Next artwork"><ChevronRight size={16} /></button>
            </div>
          </section>

          <div className="gallery-footer">
            <div><Sparkles size={13} /> <span>USE ARROW KEYS TO MOVE BETWEEN WORKS</span></div>
            <div className="footer-progress"><span style={{ width: `${((selected + 1) / artworks.length) * 100}%` }} /></div>
          </div>

          <div className="mobile-exhibit-strip">
            {artworks.map((art, index) => <button key={art.title} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><img src={art.image} alt="" /><span>0{index + 1}</span></button>)}
          </div>
        </>
      )}
    </main>
  );
}
