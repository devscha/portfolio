import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import starNavy from "../assets/elements/star Navy.svg";
import starGradient from "../assets/elements/Star Gradient.svg";

// Top designs + more designs
import imgPeekDark from "../assets/graphicWorks/Mascot Teaser.svg";
import imgPeekCherry from "../assets/graphicWorks/Mascot Reveal.svg";
import imgErika from "../assets/graphicWorks/FINAL DRAFT_ APPROVED !.svg";
import imgPup from "../assets/graphicWorks/EVENTS & HOLIDAY.svg"; 
import imgEnvelope from "../assets/graphicWorks/HALLOWEEN SPECIAL PUBMAT.svg";
import imgNokia from "../assets/graphicWorks/HALLOWEEN SPECIAL PUBMAT (1).svg";
import imgLooking from "../assets/graphicWorks/v3.svg";
import imgAttention from "../assets/graphicWorks/v2.svg";
import imgFinals from "../assets/graphicWorks/v2 1.svg";
import imgTablet from "../assets/graphicWorks/end of sem.svg";
import imgWriteEnv from "../assets/graphicWorks/Frame 1.svg";
import imgWriteRead from "../assets/graphicWorks/final.svg";

// Post covers (carousel)
import cover1 from "../assets/imgCarousel/POST COVERS.svg";
import cover2 from "../assets/imgCarousel/POST COVERS (1).svg";
import cover3 from "../assets/imgCarousel/POST COVERS (2).svg";

const SCRIPT_FONT = "'Your Script Font', 'Edwardian Script ITC' , 'Cursive'";

/* Turn on to print each picture's file name on its tile (for checking the order) */
const SHOW_FILE_NAMES = false;

const ease = [0.65, 0, 0.35, 1] as const;
const PAN = 70; 
const LOOP_SECONDS = 45; 

/*  The works  */

type Item = { id: string; src: string; file: string; alt: string };
const mk = (id: string, src: string, file: string, alt: string): Item => ({ id, src, file, alt });

const ITEMS: Record<string, Item> = {
  peekDark: mk("peekDark", imgPeekDark, "Mascot Teaser.svg", "Peek A Boo teaser"),
  peekCherry: mk("peekCherry", imgPeekCherry, "Mascot Reveal.svg", "Peek A Boo mascot reveal"),
  erika: mk("erika", imgErika, "HALLOWEEN SPECIAL PUBMAT (1).svg", "Happiest birthday Erika"),
  pup: mk("pup", imgPup, "mystic-grain.svg", "PUP Walkout Against Corruption"),
  envelope: mk("envelope", imgEnvelope, "EVENTS & HOLIDAY.svg", "Halloween special: envelope"),
  nokia: mk("nokia", imgNokia, "HALLOWEEN SPECIAL PUBMAT.svg", "Halloween special: Nokia message"),
  looking: mk("looking", imgLooking, "FINAL DRAFT_ APPROVED !.svg", "BSIT 2-1 is looking for transferees, shiftees and irregulars"),
  attention: mk("attention", imgAttention, "v2 1.svg", "Attention 2nd sem na"),
  finals: mk("finals", imgFinals, "end of sem.svg", "Finals na"),
  tablet: mk("tablet", imgTablet, "Frame 1.svg", "11:11 tablet message"),
  writeEnv: mk("writeEnv", imgWriteEnv, "v2.svg", "Write your feelings: QR envelope"),
  writeRead: mk("writeRead", imgWriteRead, "v3.svg", "Write your feelings: read the message"),
};

const COVERS: Item[] = [
  mk("c1", cover1, "POST COVERS.svg", "Celebrants of the month, August 2026"),
  mk("c2", cover2, "POST COVERS (1).svg", "Celebrants of the month, December 2025"),
  mk("c3", cover3, "POST COVERS (2).svg", "Meet the officers post cover"),
];

const KEYWORD_ROWS = [
  ["Y2K", "FRUTIGERAERO"],
  ["GRADIENT", "CUTOUTS"],
  ["RED VELVET", "RETRO"],
];

/*  Layout data (numbers are pixels in the Figma frame)  */

type Txt = { text: string; x: number; y: number; size: number; left?: boolean; script?: boolean };
type Spot = { id: string; x: number; y: number; w: number }; // x, y = top-left
type Pt = { x: number; y: number; w: number }; // x, y = center
type Scene = {
  W: number;
  H: number;
  eyebrow: { x: number; y: number; size: number; sparkW: number; gap: number };
  headline: Txt[];
  intro: Txt[];
  tops: Spot[];
  kw: { x: number; y: number; size: number; tagsX: number; tagsY: number; tagSize: number };
  starA: Pt;
  starB: Pt;
  post: { x: number; y: number; size: number };
  carousel: { y: number; h: number; cardW: number; gap: number };
  more: { x: number; y: number; size: number };
  grid: { x: number; y: number; w: number; cols: number; gap: number; order: string[] };
};

const desktop: Scene = {
  W: 966,
  H: 2490,
  eyebrow: { x: 483, y: 62, size: 22, sparkW: 42, gap: 8 },
  headline: [
    { text: "GRAPHIC", x: 483, y: 158, size: 104 },
    { text: "DESIGNS", x: 483, y: 240, size: 52 },
  ],
  intro: [
    { text: "THESE ARE", x: 420, y: 411, size: 48, left: true },
    { text: "MY TOP", x: 420, y: 453, size: 48, left: true },
    { text: "4", x: 626, y: 462, size: 96, script: true },
    { text: "DESIGNS", x: 670, y: 450, size: 48, left: true },
  ],
  tops: [
    { id: "erika", x: 161, y: 369, w: 216 },
    { id: "peekDark", x: 419, y: 541, w: 206 },
    { id: "peekCherry", x: 136, y: 608, w: 256 },
    { id: "pup", x: 418, y: 786, w: 191 },
  ],
  kw: { x: 694, y: 607, size: 21, tagsX: 687, tagsY: 637, tagSize: 19 },
  starA: { x: 483, y: 1090, w: 88 },
  starB: { x: 483, y: 1577, w: 88 },
  post: { x: 496, y: 1215, size: 72 },
  carousel: { y: 1265, h: 196, cardW: 349, gap: 20 },
  more: { x: 490, y: 1698, size: 72 },
  grid: {
    x: 81,
    y: 1757,
    w: 804,
    cols: 4,
    gap: 14,
    // Same order as the Figma frame, row by row
    order: [
      "peekDark", "peekCherry", "erika", "pup",
      "envelope", "nokia", "looking", "attention",
      "finals", "tablet", "writeRead", "writeEnv",
    ],
  },
};

const mobile: Scene = {
  W: 720,
  H: 2650,
  eyebrow: { x: 360, y: 156, size: 34, sparkW: 68, gap: 12 },
  headline: [
    { text: "GRAPHIC", x: 360, y: 270, size: 118 },
    { text: "DESIGNS", x: 363, y: 373, size: 58 },
  ],
  intro: [
    { text: "THESE ARE", x: 290, y: 487, size: 37, left: true },
    { text: "MY TOP", x: 290, y: 519, size: 37, left: true },
    { text: "4", x: 462, y: 530, size: 70, script: true },
    { text: "DESIGNS", x: 500, y: 518, size: 37, left: true },
  ],
  tops: [
    { id: "erika", x: 71, y: 450, w: 182 },
    { id: "peekDark", x: 288, y: 595, w: 174 },
    { id: "peekCherry", x: 50, y: 651, w: 215 },
    { id: "pup", x: 287, y: 801, w: 162 },
  ],
  kw: { x: 489, y: 679, size: 17, tagsX: 484, tagsY: 704, tagSize: 15 },
  starA: { x: 367, y: 1065, w: 80 },
  starB: { x: 367, y: 1495, w: 80 },
  post: { x: 395, y: 1170, size: 56 },
  carousel: { y: 1216, h: 164, cardW: 291, gap: 16 },
  more: { x: 360, y: 1590, size: 52 },
  grid: {
    x: 57,
    y: 1665,
    w: 615,
    cols: 3,
    gap: 13,
    // Same order as the mobile Figma frame, row by row
    order: [
      "peekDark", "peekCherry", "erika",
      "pup", "envelope", "nokia",
      "finals", "attention", "tablet",
      "looking", "writeEnv", "writeRead",
    ],
  },
};

/* Small pieces  */

const cq = (n: number, W: number) => `${(n / W) * 100}cqw`;

// Pans up into view as it's scrolled to, and keeps panning up as it leaves
function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const stops = [0, 0.2, 0.8, 1];
  const y = useTransform(scrollYProgress, stops, reduce ? [0, 0, 0, 0] : [PAN, 0, 0, -PAN]);
  const opacity = useTransform(scrollYProgress, stops, reduce ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  return (
    // The outer box stays put (it's what we measure); only the inner one moves
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y, opacity }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

// Row of three navy stars (small, medium, large)
function Sparks({ reverse = false }: { reverse?: boolean }) {
  const sizes = reverse ? [36, 28, 11] : [11, 28, 36];
  return (
    <div className="flex items-center justify-between">
      {sizes.map((s, i) => (
        <img
          key={i}
          src={starNavy}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="select-none"
          style={{ width: `${s}%` }}
        />
      ))}
    </div>
  );
}

function Label({ t, W }: { t: Txt; W: number }) {
  return (
    <span
      className={`block whitespace-nowrap leading-none text-black ${t.script ? "" : "font-heading"}`}
      style={{ fontSize: cq(t.size, W), fontFamily: t.script ? SCRIPT_FONT : undefined }}
    >
      {t.text}
    </span>
  );
}

// "POST [C]OVERS" / "MORE [D]ESIGNS": a script capital sitting inside plain caps
function MixedTitle({
  before,
  glyph,
  after,
  size,
  W,
  glyphScale = 1.4,
  afterScale = 1,
  glyphGap = 0.08,
}: {
  before: string;
  glyph: string;
  after: string;
  size: number;
  W: number;
  glyphScale?: number;
  afterScale?: number;
  glyphGap?: number;
}) {
  return (
    <h2
      className="m-0 flex items-baseline whitespace-nowrap font-heading font-normal leading-none text-black"
      style={{ fontSize: cq(size, W) }}
    >
      <span style={{ marginRight: "0.14em" }}>{before}</span>
      <span
        style={{
          fontFamily: SCRIPT_FONT,
          fontSize: `${glyphScale}em`,
          lineHeight: 0,
          marginRight: `${glyphGap}em`,
        }}
      >
        {glyph}
      </span>
      <span style={{ fontSize: `${afterScale}em` }}>{after}</span>
    </h2>
  );
}
// Every picture is one of these: hover lifts it, click opens the popup
function Thumb({
  item,
  onOpen,
  grab = false,
}: {
  item: Item;
  onOpen: (i: Item) => void;
  grab?: boolean; // carousel pictures show a grab cursor because they can be dragged
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View ${item.alt} larger`}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`relative block h-full w-full overflow-hidden bg-white/40 outline-none transition-shadow duration-200 hover:shadow-[0_14px_30px_rgba(10,21,66,0.18)] focus-visible:ring-2 focus-visible:ring-[#0A1542] ${
        grab ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
      }`}
    >
      <img src={item.src} alt="" aria-hidden="true" draggable={false} className="block h-full w-full select-none object-cover" />
      {SHOW_FILE_NAMES && (
        <span className="absolute inset-x-0 bottom-0 bg-black/75 px-1 py-0.5 text-left text-[10px] leading-tight text-white">
          {item.file}
        </span>
      )}
    </motion.button>
  );
}

// Looping carousel: drifts on its own, can be dragged, glides after a flick
function DragCarousel({
  items,
  cardW,
  h,
  gap,
  W,
  onOpen,
}: {
  items: Item[];
  cardW: number;
  h: number;
  gap: number;
  W: number;
  onOpen: (i: Item) => void;
}) {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const setW = useRef(0); // width of one full set of covers
  const hovering = useRef(false);
  const reduce = useReducedMotion();
  const drag = useRef({ active: false, captured: false, moved: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, vel: 0 });

  // The track is two identical sets side by side, so half its width is one set
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      setW.current = el.offsetWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keeps the position inside one set, so the loop never runs out
  const wrap = (v: number) => {
    const w = setW.current;
    if (!w) return v;
    let m = v % w;
    if (m > 0) m -= w;
    return m;
  };

  useAnimationFrame((_, delta) => {
    const d = drag.current;
    const w = setW.current;
    if (!w || d.active) return;
    const dt = Math.min(delta, 50) / 1000;
    let v = x.get();
    if (Math.abs(d.vel) > 1) {
      v += d.vel * dt; // glide after a flick
      d.vel *= Math.pow(0.02, dt);
    } else {
      d.vel = 0;
    }
    if (!reduce && !hovering.current) v -= (w / LOOP_SECONDS) * dt; // slow drift
    x.set(wrap(v));
  });

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = drag.current;
    d.active = true;
    d.captured = false;
    d.moved = false;
    d.startX = e.clientX;
    d.startPos = x.get();
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.vel = 0;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return; // still just a click
      d.moved = true;
      d.captured = true;
      e.currentTarget.setPointerCapture(e.pointerId); // only captured once it's really a drag, so clicks still reach the pictures
    }
    const now = performance.now();
    const dt = (now - d.lastT) / 1000;
    if (dt > 0) {
      const inst = (e.clientX - d.lastX) / dt;
      d.vel = Math.max(-3000, Math.min(3000, d.vel * 0.6 + inst * 0.4));
    }
    d.lastX = e.clientX;
    d.lastT = now;
    x.set(wrap(d.startPos + dx));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.captured && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (performance.now() - d.lastT > 80) d.vel = 0; // held still before letting go: no flick
  };

  return (
    <div
      className="w-full"
      style={{ touchAction: "pan-y" }} // vertical swipes still scroll the page
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") hovering.current = true; // pause the drift under a mouse
      }}
      onPointerLeave={() => {
        hovering.current = false;
        const d = drag.current;
        if (d.active && !d.captured) d.active = false;
      }}
      onClickCapture={(e) => {
        // A drag shouldn't count as a click on whatever picture it ended on
        if (drag.current.moved) {
          e.stopPropagation();
          e.preventDefault();
          drag.current.moved = false;
        }
      }}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max">
        {[...items, ...items].map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className="shrink-0"
            style={{ width: cq(cardW, W), height: cq(h, W), marginRight: cq(gap, W) }}
          >
            <Thumb item={c} onOpen={onOpen} grab />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* One full layout (desktop or mobile) */

function SceneLayer({
  s,
  className,
  onOpen,
}: {
  s: Scene;
  className: string;
  onOpen: (i: Item) => void;
}) {
  const { W, H } = s;
  const px = (n: number) => `${(n / W) * 100}%`;
  const py = (n: number) => `${(n / H) * 100}%`;
  const eb = s.eyebrow;
  const center = "-50% -50%";

  return (
    <div className={className}>
      <div className="relative w-full [container-type:inline-size]" style={{ aspectRatio: `${W} / ${H}` }}>
        {/* ✦✦ WORKS ✦✦ */}
        <Reveal className="absolute" style={{ left: px(eb.x), top: py(eb.y), translate: center }}>
          <div className="flex items-center whitespace-nowrap" style={{ columnGap: cq(eb.gap, W) }}>
            <div className="shrink-0" style={{ width: cq(eb.sparkW, W) }}>
              <Sparks />
            </div>
            <Label t={{ text: "WORKS", x: 0, y: 0, size: eb.size }} W={W} />
            <div className="shrink-0" style={{ width: cq(eb.sparkW, W) }}>
              <Sparks reverse />
            </div>
          </div>
        </Reveal>

        {/* GRAPHIC / DESIGNS, then "These are my top 4 designs" */}
        {[...s.headline, ...s.intro].map((t, i) => (
          <Reveal
            key={`t${i}`}
            className="absolute"
            style={{ left: px(t.x), top: py(t.y), translate: t.left ? "0 -50%" : center }}
          >
            <Label t={t} W={W} />
          </Reveal>
        ))}

        {/* Top 4 */}
        {s.tops.map((p) => (
          <Reveal
            key={p.id}
            className="absolute"
            style={{ left: px(p.x), top: py(p.y), width: px(p.w), aspectRatio: "1 / 1" }}
          >
            <Thumb item={ITEMS[p.id]} onOpen={onOpen} />
          </Reveal>
        ))}

        {/* Keywords */}
        <Reveal className="absolute" style={{ left: px(s.kw.x), top: py(s.kw.y), translate: "0 -50%" }}>
          <span className="block whitespace-nowrap font-sub leading-none text-black" style={{ fontSize: cq(s.kw.size, W) }}>
            KEYWORDS:
          </span>
        </Reveal>
        <Reveal className="absolute" style={{ left: px(s.kw.tagsX), top: py(s.kw.tagsY) }}>
          <div className="flex flex-col" style={{ rowGap: cq(s.kw.tagSize * 0.25, W) }}>
            {KEYWORD_ROWS.map((row, i) => (
              <div key={i} className="flex" style={{ columnGap: cq(s.kw.tagSize * 0.3, W) }}>
                {row.map((k) => (
                  <span
                    key={k}
                    className="whitespace-nowrap rounded-full border border-black font-sub leading-none text-black"
                    style={{
                      fontSize: cq(s.kw.tagSize, W),
                      padding: `${cq(s.kw.tagSize * 0.22, W)} ${cq(s.kw.tagSize * 0.5, W)}`,
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Star divider, then POST COVERS */}
        <Reveal className="absolute" style={{ left: px(s.starA.x), top: py(s.starA.y), width: px(s.starA.w), translate: center }}>
          <img src={starGradient} alt="" aria-hidden="true" draggable={false} className="block w-full select-none" />
        </Reveal>
        <Reveal className="absolute" style={{ left: px(s.post.x), top: py(s.post.y), translate: center }}>
          <MixedTitle before="POST" glyph="C" after="OVERS" size={s.post.size} W={W} glyphScale={1.4} />
        </Reveal>

        {/* Carousel: runs the full width of the page */}
        <Reveal className="absolute left-0 w-full overflow-x-clip" style={{ top: py(s.carousel.y) }}>
          <DragCarousel
            items={COVERS}
            cardW={s.carousel.cardW}
            h={s.carousel.h}
            gap={s.carousel.gap}
            W={W}
            onOpen={onOpen}
          />
        </Reveal>

        {/* Star divider, then MORE DESIGNS */}
        <Reveal className="absolute" style={{ left: px(s.starB.x), top: py(s.starB.y), width: px(s.starB.w), translate: center }}>
          <img src={starGradient} alt="" aria-hidden="true" draggable={false} className="block w-full select-none" />
        </Reveal>
        <Reveal className="absolute" style={{ left: px(s.more.x), top: py(s.more.y), translate: center }}>
          <MixedTitle before="MORE" glyph="D" after="ESIGNS" size={s.more.size} W={W} glyphScale={1.6} afterScale={0.78} />
        </Reveal>

        {/* Grid of more designs */}
        <div
          className="absolute grid"
          style={{
            left: px(s.grid.x),
            top: py(s.grid.y),
            width: px(s.grid.w),
            gridTemplateColumns: `repeat(${s.grid.cols}, minmax(0, 1fr))`,
            gap: cq(s.grid.gap, W),
          }}
        >
          {s.grid.order.map((id) => (
            <Reveal key={id} className="aspect-square">
              <Thumb item={ITEMS[id]} onOpen={onOpen} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/*  Page  */

export default function GraphicWorks() {
  const [open, setOpen] = useState<Item | null>(null);

  // While the popup is open: Esc closes it and the page behind it doesn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section id="graphic-works" className="relative overflow-x-clip">
      <h2 className="sr-only">Graphic Designs</h2>

      <SceneLayer s={desktop} className="hidden lg:block" onOpen={setOpen} />
      <SceneLayer s={mobile} className="block lg:hidden" onOpen={setOpen} />

      {/* Popup. Rendered on <body> so the page's transforms can't shift it */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="gw-popup"
                role="dialog"
                aria-modal="true"
                aria-label={open.alt}
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setOpen(null)}
              >
                <motion.div
                  className="relative"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={open.src}
                    alt={open.alt}
                    draggable={false}
                    className="block max-h-[86svh] max-w-[92vw] object-contain shadow-2xl"
                  />
                  <button
                    type="button"
                    autoFocus
                    aria-label="Close"
                    onClick={() => setOpen(null)}
                    className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-xl leading-none text-black outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-[#0A1542]"
                  >
                    ×
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}