import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Layers3, Menu, Share2, X, ZoomIn } from "lucide-react";

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
    photo: "/exhibition/01-process-photo.webp",
    sketch: "/exhibition/01-process-sketch.webp",
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
    photo: "/exhibition/02-saint-photo.webp",
    sketch: "/exhibition/02-saint-sketch.webp",
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
    photo: "/exhibition/03-angel-photo.webp",
    sketch: "/exhibition/03-angel-sketch.webp",
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
    photo: "/exhibition/04-gold-photo.webp",
    sketch: "/exhibition/04-gold-sketch.webp",
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
    photo: "/exhibition/05-fronton-photo.webp",
    sketch: "/exhibition/05-fronton-sketch.webp",
    note: "Архитектурный контур удерживает композицию так же, как рама удерживает лист.",
    prehistory: "Финальный зал раскрывает стену наружу. Фронтон здесь представлен как переход между интерьером и городом: изображение живёт в треугольнике, а вокруг него остаётся воздух фасада.",
    orientation: "landscape",
  },
];

const photoCatalog = [
  ["01-process", "Лист 01 / процесс"], ["02-saint", "Лист 01 / фрагмент"], ["03-ensemble", "Лист 01 / ансамбль"], ["04-architecture", "Лист 01 / архитектура"], ["05-angel", "Лист 02 / диалог"], ["06-workshop", "Лист 02 / мастерская"], ["07-facade", "Лист 02 / фасад"], ["08-drapery", "Лист 02 / драпировка"], ["09-saint-icon", "Лист 03 / икона"], ["10-saint-close", "Лист 03 / лицо"], ["11-fronton", "Лист 04 / фронтон"],
] as const;

function ReliefFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`relief-frame ${className}`}><div className="relief-inner">{children}</div></div>;
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.

  const [activeId, setActiveId] = useState("threshold");
  const [showSketch, setShowSketch] = useState(true);
  const [indexOpen, setIndexOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [catalogImage, setCatalogImage] = useState<string | null>(null);
  const [catalogIndex, setCatalogIndex] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [quoteArea, setQuoteArea] = useState(4);
  const [quoteType, setQuoteType] = useState<"panel" | "wall">("panel");
  const [materialType, setMaterialType] = useState<"smalti" | "mixed" | "ceramic">("smalti");
  const [designLevel, setDesignLevel] = useState<"standard" | "detailed">("detailed");
  const [installation, setInstallation] = useState<"included" | "client">("included");
  const [shareStatus, setShareStatus] = useState("");
  const contactMutation = trpc.contact.submit.useMutation({ onSuccess: () => setContactSent(true) });
  const shareExhibition = async () => {
    const shareData = { title: "Archive of Surface", text: "Интернет-экспозиция ручной мозаики и фотодокументации", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); setShareStatus("ССЫЛКА СКОПИРОВАНА"); }
    } catch { setShareStatus("СОХРАНИТЕ ССЫЛКУ В БРАУЗЕРЕ"); }
    window.setTimeout(() => setShareStatus(""), 2400);
  };
  const active = useMemo(() => works.find((work) => work.id === activeId) ?? works[0], [activeId]);
  const activeIndex = works.findIndex((work) => work.id === active.id);
  const next = works[(activeIndex + 1) % works.length];
  const previous = works[(activeIndex - 1 + works.length) % works.length];

  const quoteBand = quoteType === "panel" ? { low: 180000, high: 420000, label: "панно / умеренная сложность" } : { low: 350000, high: 900000, label: "монументальная стена / высокая сложность" };
  const materialFactor = materialType === "smalti" ? 1 : materialType === "mixed" ? 0.88 : 0.68;
  const designAddon = designLevel === "detailed" ? quoteArea * 60000 : quoteArea * 25000;
  const preparation = quoteArea * (quoteType === "wall" ? 45000 : 25000);
  const installationCost = installation === "included" ? quoteArea * (quoteType === "wall" ? 120000 : 70000) : 0;
  const logistics = 35000;
  const quoteLow = Math.round((quoteArea * quoteBand.low * materialFactor + designAddon + preparation + installationCost + logistics) * 0.9);
  const quoteHigh = Math.round((quoteArea * quoteBand.high * materialFactor + designAddon + preparation + installationCost + logistics) * 1.1);
  const exportQuote = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    printWindow.document.write(`<html lang="ru"><head><title>Ориентировочная смета — Archive of Surface</title><style>body{font-family:Georgia,serif;padding:48px;color:#151a21}h1{font-size:32px;font-weight:400}p{line-height:1.6}table{border-collapse:collapse;width:100%;max-width:680px}td{border-bottom:1px solid #ccc;padding:12px 0}td:last-child{text-align:right}small{color:#666}</style></head><body><h1>Archive of Surface</h1><p>Ориентировочная смета ручной мозаики</p><table><tr><td>Площадь</td><td>${quoteArea} м²</td></tr><tr><td>Формат</td><td>${quoteType === "panel" ? "панно" : "монументальная стена"}</td></tr><tr><td>Материал</td><td>${materialType === "smalti" ? "ручная смальта" : materialType === "mixed" ? "смальта + камень/керамика" : "керамическая мозаика"}</td></tr><tr><td>Проектирование</td><td>${designLevel === "detailed" ? "детальная композиция" : "стандартная композиция"}</td></tr><tr><td>Подготовка основания</td><td>включена</td></tr><tr><td>Монтаж</td><td>${installation === "included" ? "включён ориентировочно" : "выполняется заказчиком"}</td></tr><tr><td><strong>Ориентир</strong></td><td><strong>${quoteLow.toLocaleString("ru-RU")} — ${quoteHigh.toLocaleString("ru-RU")} ₽</strong></td></tr></table><p><small>Не является офертой. Итог зависит от эскиза, основания, материалов, доступа, логистики и письменного технического задания.</small></p><script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
  };
  const closeZoom = () => { setZoomOpen(false); setCatalogImage(null); setCatalogIndex(null); };
  const moveZoom = (direction: 1 | -1) => {
    if (catalogIndex !== null) {
      const nextIndex = (catalogIndex + direction + photoCatalog.length) % photoCatalog.length;
      setCatalogIndex(nextIndex);
      setCatalogImage(`/photo-catalog/${photoCatalog[nextIndex][0]}.webp`);
      return;
    }
    setActiveId(direction === 1 ? next.id : previous.id);
  };

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!zoomOpen && catalogIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeZoom();
      if (event.key === "ArrowLeft") moveZoom(-1);
      if (event.key === "ArrowRight") moveZoom(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomOpen, catalogIndex, active.id, next.id, previous.id]);

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
          <p className="hero-lede">Фото. Графит. Свет. Пять фрагментов стены.</p>
          <div className="hero-actions"><a className="scroll-cue" href="#works"><span>Смотреть архив</span><ArrowDown size={14} /></a><button className="share-cue" type="button" onClick={shareExhibition}><span>{shareStatus || "Поделиться выставкой"}</span><Share2 size={14} /></button></div>
        </div>
        <div className="hero-plate" aria-hidden="true"><span className="plate-shadow" /><span className="plate-line plate-line-one" /><span className="plate-line plate-line-two" /><span className="plate-line plate-line-red" /><span className="plate-caption">MATERIAL / MEMORY / HAND</span></div>
        <div className="hero-coordinates">55°45′ N<br />37°37′ E</div>
      </section>

      <section className="statement-strip">
        <span className="statement-index">A—00</span>
        <p>«Фотография фиксирует поверхность. Эскиз возвращает ей время.»</p>
        <span className="statement-type">CURATORIAL NOTE</span>
      </section>

      <section className="works-section" id="works">
        <div className="section-intro"><div><p className="kicker">АРХИВ / ПАРНЫЙ ПРОСМОТР</p><h2>Из стены<br />в лист.</h2></div><p className="section-description">Фото и карандашный этюд. Нажмите на изображение, чтобы увеличить.</p></div>
        <div className="work-nav" aria-label="Навигация по работам">
          {works.map((work) => <button key={work.id} className={work.id === active.id ? "is-active" : ""} onClick={() => setActiveId(work.id)}><span>{work.index}</span><b>{work.room}</b></button>)}
        </div>

        <article className="work-room reveal-on-scroll" aria-labelledby={`title-${active.id}`}>
          <div className="room-topline"><span>{active.sourceLabel}</span><span>ROOM {active.index} / {active.room.toUpperCase()}</span></div>
          <div className="work-grid">
            <div className="work-image-column">
              <button className="zoom-stage" onClick={() => setZoomOpen(true)} aria-label="Увеличить изображение">
                <ReliefFrame className={`work-frame ${active.orientation}`}>
                  <img src={showSketch ? active.sketch : active.photo} alt={`${active.title} — ${showSketch ? "карандашный этюд" : "фотодокументация"}`} />
                  <span className="frame-shadow" />
                </ReliefFrame>
                <span className="zoom-hint"><ZoomIn size={14} /> увеличить</span>
              </button>
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

      <section className="relief-section"><div className="relief-copy"><p className="kicker">ПОСЛЕДНИЙ ЗАЛ</p><h2>Вода<br />помнит<br /><em>ветер.</em></h2></div><div className="mill-scene reveal-on-scroll" aria-label="Сказочная водяная мельница"><div className="mill-horizon" /><div className="mill-hill" /><div className="mill-house"><span className="mill-roof" /><span className="mill-door" /><span className="mill-window" /></div><div className="mill-wheel"><span /><span /><span /><span /><span /><span /></div><div className="mill-water"><i /><i /><i /><i /></div><div className="mill-wind"><i /><i /><i /></div><span className="mill-caption">ВОДЯНАЯ МЕЛЬНИЦА / СКАЗКА</span></div></section>

      <section className="photo-catalog" id="catalog"><div className="catalog-heading"><p className="kicker">ПОЛНЫЙ ФОТОКАТАЛОГ</p><span>11 / 11</span></div><div className="catalog-grid">{photoCatalog.map(([id, label], index) => <button className="catalog-item reveal-on-scroll" key={id} onClick={() => { setCatalogIndex(index); setCatalogImage(`/photo-catalog/${id}.webp`); }} aria-label={`Увеличить ${label}`}><img src={`/photo-catalog/${id}.webp`} alt={label} loading={index > 3 ? "lazy" : "eager"} /><span>{String(index + 1).padStart(2, "0")} — {label}</span></button>)}</div></section>

      <section className="commission-section" id="commission"><div className="commission-copy"><p className="kicker">МАСТЕРСКАЯ / ЗАПРОС</p><h2>Обсудить<br /><em>панно.</em></h2><p>Локальный черновик заявки без публикации телефона. Укажите только то, что готовы передать.</p></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); contactMutation.mutate({ name: String(form.get("name") ?? ""), email: String(form.get("email") ?? ""), brief: String(form.get("brief") ?? ""), website: String(form.get("website") ?? "") }); }}><label>Имя <input name="name" autoComplete="name" placeholder="необязательно" /></label><label>Почта для ответа <input name="email" type="email" autoComplete="email" placeholder="необязательно" /></label><label>Кратко о проекте <textarea name="brief" rows={4} required minLength={10} placeholder="площадь, место, срок, характер изображения" /></label><input className="contact-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button type="submit" disabled={contactMutation.isPending}>{contactMutation.isPending ? "ОТПРАВКА…" : contactSent ? "ЗАЯВКА ОТПРАВЛЕНА" : "ОТПРАВИТЬ ЗАЯВКУ"} <ArrowUpRight size={14} /></button>{contactMutation.isError && <small className="form-error">Не удалось отправить заявку. Попробуйте позже.</small>}<small>Заявка передаётся владельцу через защищённый серверный канал. Телефон в форму не включён.</small></form></section>

      <section className="estimate-section" id="estimate"><div><p className="kicker">ПОРТФОЛИО / ОЦЕНКА</p><h2>Сколько<br /><em>поверхности?</em></h2><p className="estimate-disclaimer">Ориентир для обсуждения, не является офертой. Итог зависит от эскиза, основания, материалов, доступа и монтажа.</p></div><div className="estimate-panel"><label>Площадь, м² <input type="number" min="1" max="500" step="0.5" value={quoteArea} onChange={(event) => setQuoteArea(Number(event.target.value) || 1)} /></label><div className="estimate-switch"><button className={quoteType === "panel" ? "is-active" : ""} onClick={() => setQuoteType("panel")} type="button">ПАННО</button><button className={quoteType === "wall" ? "is-active" : ""} onClick={() => setQuoteType("wall")} type="button">СТЕНА</button></div><label>Материал <select value={materialType} onChange={(event) => setMaterialType(event.target.value as typeof materialType)}><option value="smalti">ручная смальта</option><option value="mixed">смальта + камень</option><option value="ceramic">керамическая мозаика</option></select></label><label>Композиция <select value={designLevel} onChange={(event) => setDesignLevel(event.target.value as typeof designLevel)}><option value="standard">стандартная</option><option value="detailed">детальная</option></select></label><label>Монтаж <select value={installation} onChange={(event) => setInstallation(event.target.value as typeof installation)}><option value="included">включить</option><option value="client">заказчик</option></select></label><p className="estimate-band">{quoteBand.label} / материал + проектирование + основание + логистика</p><strong>{quoteLow.toLocaleString("ru-RU")} — {quoteHigh.toLocaleString("ru-RU")} ₽</strong><small>ориентировочно: подготовка, логистика и выбранный монтаж учтены; не является офертой</small><button className="estimate-export" type="button" onClick={exportQuote}>ПЕЧАТЬ / СОХРАНИТЬ PDF <ArrowUpRight size={14} /></button></div></section>

      <footer className="archive-footer"><span>ARCHIVE OF SURFACE / 2026</span><span>BASED ON UPLOADED PHOTO DOCUMENTATION</span><span><a href="#top">UP</a> <ArrowUpRight size={13} /></span></footer>

      {(zoomOpen || catalogImage) && <div className="zoom-overlay" role="dialog" aria-modal="true" aria-label="Увеличенное изображение" onClick={closeZoom}><button className="zoom-close" onClick={closeZoom} aria-label="Закрыть"><X size={18} /></button><button className="zoom-nav zoom-nav-left" onClick={(event) => { event.stopPropagation(); moveZoom(-1); }} aria-label="Предыдущее изображение"><ChevronLeft size={26} /></button><img src={catalogImage ?? (showSketch ? active.sketch : active.photo)} alt={catalogImage ? "Увеличенная фотография из каталога" : `${active.title} — увеличенный вид`} onClick={(event) => event.stopPropagation()} /><button className="zoom-nav zoom-nav-right" onClick={(event) => { event.stopPropagation(); moveZoom(1); }} aria-label="Следующее изображение"><ChevronRight size={26} /></button><span>{catalogImage ? `${String((catalogIndex ?? 0) + 1).padStart(2, "0")} / ФОТОКАТАЛОГ` : `${active.index} / ${showSketch ? "ЭТЮД" : "ФОТО"}`}</span></div>}

      {indexOpen && <aside className="index-drawer" aria-label="Каталог выставки"><div className="drawer-head"><span>INDEX / WORKS</span><button onClick={() => setIndexOpen(false)} aria-label="Закрыть каталог"><X size={17} /></button></div><p className="drawer-note">Выборка из 38-страничного PDF-архива. Названия залов являются кураторскими, если иное не указано в источнике.</p>{works.map((work) => <button key={work.id} className={work.id === active.id ? "drawer-item is-active" : "drawer-item"} onClick={() => { setActiveId(work.id); setIndexOpen(false); }}><span>{work.index}</span><div><b>{work.title}</b><small>{work.material}</small></div></button>)}</aside>}
    </main>
  );
}
