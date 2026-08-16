import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Grid3X3, Layers3, Menu, X } from "lucide-react";

/** Style note: Archive of Surface — bone paper, soot, graphite, oxidized blue, mineral gold, bas-relief edges, and quiet museum motion. */

type Work = {
  id: string;
  index: string;
  title: string;
  sourceLabel: string;
  room: string;
  material: string;
  photo: string;
  sketch: string;
  note: string;
  prehistory: string;
  orientation: "landscape" | "portrait";
};

const works: Work[] = [
  {
    id: "threshold",
    index: "01",
    title: "Фрагмент в работе",
    sourceLabel: "Фотодокументация / лист 01",
    room: "Порог",
    material: "мозаика, рабочее пространство",
    photo: "/manus-storage/01_process_mosaic_e441e8b2.jpg",
    sketch: "/manus-storage/archive-surface-01-process-mosaic_efb902db.png",
    note: "Фотография сохраняет не только изображение, но и расстояние между рукой, лесами и стеной.",
    prehistory: "До того как поверхность стала цельной, пространство существовало как набор разметок, обрезков и временных опор. Здесь посетитель входит не в завершённое произведение, а в момент его становления.",
    orientation: "landscape",
  },
  {
    id: "saint",
    index: "02",
    title: "Лицо среди tesserae",
    sourceLabel: "Фотодокументация / лист 01",
    room: "Лицо",
    material: "смальта, золотой и каменный фон",
    photo: "/manus-storage/02_saint_fragment_85fef67f.jpg",
    sketch: "/manus-storage/archive-surface-02-saint-fragment_8a63cf1c.png",
    note: "Контур лица считывается как архитектура: он собран из малых отклонений, а не из одной линии.",
    prehistory: "Камерный зал построен вокруг фрагмента, который нельзя увидеть целиком. Тень от рельефной рамы разрезает поле и напоминает: образ существует одновременно как лик и как поверхность.",
    orientation: "landscape",
  },
  {
    id: "angel",
    index: "03",
    title: "Жест и ответ",
    sourceLabel: "Фотодокументация / лист 02",
    room: "Диалог",
    material: "мозаичное панно, фрагмент композиции",
    photo: "/manus-storage/05_angel_mother_159042bf.jpg",
    sketch: "/manus-storage/archive-surface-05-angel-mother_abe8f710.png",
    note: "Белая драпировка переводит взгляд из фигуры в ритм плиток и обратно.",
    prehistory: "В этом зале стена отступает. Между двумя фигурами остаётся воздух, и именно он становится главным экспонатом: пространство ответа, пауза перед прикосновением.",
    orientation: "landscape",
  },
  {
    id: "gold",
    index: "04",
    title: "Золотое поле",
    sourceLabel: "Фотодокументация / лист 03",
    room: "Тессера",
    material: "золотая смальта, графитный контур",
    photo: "/manus-storage/09_saint_icon_274d7b88.jpg",
    sketch: "/manus-storage/archive-surface-09-saint-icon_bcda6d26.png",
    note: "Карандаш возвращает золоту его зерно: не блеск, а повторение малых квадратов.",
    prehistory: "Это самый тихий зал. Источник света падает сбоку, чтобы золотое поле не превращалось в сияющий фон. Посетитель видит, как лицо возникает из одинаковых элементов, нарушенных только ритмом взгляда.",
    orientation: "portrait",
  },
  {
    id: "fronton",
    index: "05",
    title: "Треугольник воздуха",
    sourceLabel: "Фотодокументация / лист 04",
    room: "Фронтон",
    material: "наружная мозаика, архитектурная ниша",
    photo: "/manus-storage/11_fronton_trinity_1f1e9986.jpg",
    sketch: "/manus-storage/archive-surface-11-fronton-trinity_3ffdbd31.png",
    note: "Архитектурный контур удерживает композицию так же, как рама удерживает лист.",
    prehistory: "Финальный зал раскрывает стену наружу. Фронтон здесь представлен как переход между интерьером и городом: изображение живёт в треугольнике, а вокруг него остаётся воздух фасада.",
    orientation: "landscape",
  },
];

function ReliefFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`relief-frame ${className}`}><div className="relief-inner">{children}</div></div>;
}

export default function Home() {
  const [activeId, setActiveId] = useState("threshold");
  const [showSketch, setShowSketch] = useState(true);
  const [indexOpen, setIndexOpen] = useState(false);
  const active = useMemo(() => works.find((work) => work.id === activeId) ?? works[0], [activeId]);
  const activeIndex = works.findIndex((work) => work.id === active.id);
  const next = works[(activeIndex + 1) % works.length];
  const previous = works[(activeIndex - 1 + works.length) % works.length];

  return (
    <main className="archive-site">
      <div className="paper-noise" aria-hidden="true" />
      <header className="archive-header">
        <a className="archive-mark" href="#top" aria-label="Архив поверхности">
          <span className="mark-square mark-square-light" /><span className="mark-square mark-square-dark" />
        </a>
        <div className="archive-wordmark"><span>ARCHIVE</span><b>OF SURFACE</b></div>
        <div className="header-meta"><span>ИНТЕРНЕТ-ЭКСПОЗИЦИЯ</span><span>38 / 01—04</span></div>
        <button className="index-toggle" onClick={() => setIndexOpen((value) => !value)} aria-expanded={indexOpen} aria-label="Открыть каталог"><Menu size={16} /><span>КАТАЛОГ</span></button>
      </header>

      <section className="hero-room" id="top">
        <div className="hero-copy">
          <p className="kicker">01 / ПЕРВЫЙ ЗАЛ</p>
          <h1>Поверхность<br /><em>помнит</em> руку.</h1>
          <p className="hero-lede">Выставочное пространство по материалам фотодокументации. Здесь мозаика рассматривается как изображение, рельеф и след мастерской одновременно.</p>
          <a className="scroll-cue" href="#works"><span>Смотреть архив</span><ArrowDown size={14} /></a>
        </div>
        <div className="hero-plate" aria-hidden="true"><span className="plate-shadow" /><span className="plate-line plate-line-one" /><span className="plate-line plate-line-two" /><span className="plate-caption">MATERIAL / MEMORY / HAND</span></div>
        <div className="hero-coordinates">55°45′ N<br />37°37′ E</div>
      </section>

      <section className="statement-strip">
        <span className="statement-index">A—00</span>
        <p>«Фотография фиксирует поверхность. Эскиз возвращает ей время.»</p>
        <span className="statement-type">CURATORIAL NOTE</span>
      </section>

      <section className="works-section" id="works">
        <div className="section-intro"><div><p className="kicker">АРХИВ / ПАРНЫЙ ПРОСМОТР</p><h2>Из стены<br />в лист.</h2></div><p className="section-description">Каждая работа показана в двух состояниях: документальный кадр и созданный по нему графитовый этюд. Этюд является интерпретацией, а не историческим оригиналом.</p></div>
        <div className="work-nav" aria-label="Навигация по работам">
          {works.map((work) => <button key={work.id} className={work.id === active.id ? "is-active" : ""} onClick={() => setActiveId(work.id)}><span>{work.index}</span><b>{work.room}</b></button>)}
        </div>

        <article className="work-room" aria-labelledby={`title-${active.id}`}>
          <div className="room-topline"><span>{active.sourceLabel}</span><span>ROOM {active.index} / {active.room.toUpperCase()}</span></div>
          <div className="work-grid">
            <div className="work-image-column">
              <ReliefFrame className={`work-frame ${active.orientation}`}>
                <img src={showSketch ? active.sketch : active.photo} alt={`${active.title} — ${showSketch ? "карандашный этюд" : "фотодокументация"}`} />
                <span className="frame-shadow" />
              </ReliefFrame>
              <div className="pair-overview" aria-label="Пара источник и интерпретативный этюд"><button className={showSketch ? "pair-thumb" : "pair-thumb is-selected"} onClick={() => setShowSketch(false)}><img src={active.photo} alt="Документальная фотография" /><span>ИСТОЧНИК / ФОТО</span></button><button className={showSketch ? "pair-thumb is-selected" : "pair-thumb"} onClick={() => setShowSketch(true)}><img src={active.sketch} alt="Интерпретативный карандашный этюд" /><span>ЭТЮД / ГРАФИТ</span></button></div><div className="image-caption"><span>{showSketch ? "ЭТЮД — ИНТЕРПРЕТАЦИЯ" : "ФОТО — ДОКУМЕНТ"}</span><button onClick={() => setShowSketch((value) => !value)}><Layers3 size={13} /> {showSketch ? "На фото" : "На эскиз"}</button></div>
            </div>
            <div className="work-text-column">
              <div className="room-number">{active.index}<span>—</span>{String(works.length).padStart(2, "0")}</div>
              <p className="kicker">{active.room}</p>
              <h3 id={`title-${active.id}`}>{active.title}</h3>
              <p className="material-note">{active.material}</p>
              <div className="text-rule" />
              <p className="work-note">{active.note}</p>
              <div className="prehistory"><span>ПРЕДЫСТОРИЯ ПРОСТРАНСТВА</span><p>{active.prehistory}</p></div>
              <div className="room-actions"><button onClick={() => setActiveId(previous.id)} aria-label="Предыдущая работа"><ChevronLeft size={16} /> {previous.index}</button><button onClick={() => setActiveId(next.id)} aria-label="Следующая работа">{next.index} <ChevronRight size={16} /></button></div>
            </div>
          </div>
        </article>
      </section>

      <section className="relief-section"><div className="relief-copy"><p className="kicker">МАТЕРИАЛЬНАЯ ПАМЯТЬ</p><h2>Рельеф —<br />это тень,<br /><em>оставшаяся</em><br />на стене.</h2></div><div className="relief-block"><span className="relief-glyph" /><span className="relief-glyph small" /><p>В экспозиции нет нейтрального фона. Бумага, рама и падающий свет становятся частью чтения: они показывают не только то, что изображено, но и как поверхность удерживает изображение.</p></div></section>

      <footer className="archive-footer"><span>ARCHIVE OF SURFACE / 2026</span><span>BASED ON UPLOADED PHOTO DOCUMENTATION</span><span><a href="#top">UP</a> <ArrowUpRight size={13} /></span></footer>

      {indexOpen && <aside className="index-drawer" aria-label="Каталог выставки"><div className="drawer-head"><span>INDEX / WORKS</span><button onClick={() => setIndexOpen(false)} aria-label="Закрыть каталог"><X size={17} /></button></div><p className="drawer-note">Выборка из 38-страничного PDF-архива. Названия залов являются кураторскими, если иное не указано в источнике.</p>{works.map((work) => <button key={work.id} className={work.id === active.id ? "drawer-item is-active" : "drawer-item"} onClick={() => { setActiveId(work.id); setIndexOpen(false); }}><span>{work.index}</span><div><b>{work.title}</b><small>{work.material}</small></div></button>)}</aside>}
    </main>
  );
}
