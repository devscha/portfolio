import { useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import ringUiux from "../assets/elements/UIUX BTN.svg";
import ringGraphic from "../assets/elements/gw btn.svg";
import starBlack from "../assets/elements/starBlack.svg";
import starNavy from "../assets/elements/star Navy.svg";
import starTech from "../assets/elements/starTech.svg";

// Where the page starts before panning into place ("-40%" would enter from the left)
const ENTER_FROM = "40%";

// 1 unit = 1% of the Figma frame width (used only for decorations at the screen edges)
const u = (n: number) => `calc(var(--u) * ${n})`;

const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ---------- Layout data ----------
   Items marked `edge` sit against the browser edges (sizes in units).
   Everything else sits inside the centered stage, which keeps the Figma
   frame's proportions (x, y, w are % of the stage). */

type Mark = { kind: "tech" | "sparkle" | "dot"; x: number; y: number; w: number; edge?: boolean };
type Seg = { x1: number; y1: number; x2: number; y2: number; dashed?: boolean };
type Badge = {
  id: string;
  target: string;
  label: string;
  ring: string;
  x: number;
  y: number;
  d: number; // ring diameter, % of stage width
  dir: 1 | -1; // rotation direction
  speed: number; // seconds per turn
  line1: string;
  pos: { top: string; left?: string; right?: string };
  main: number; // font size in cqw
  sub: number; // font size in cqw
  indent: number; // cqw
  gap: number; // cqw
  align: "start" | "end";
};
type Title = {
  x: number;
  y: number;
  w: number;
  ratio: number;
  cY: number;
  ofY: number;
  wY: number;
  starL: number;
  starR: number;
  sw: number;
  cFont: number;
  wFont: number;
};
type Big = { x: number; y: number; w: number; bw: number; bh: number; r: number; sw: number; edge?: boolean };
type Scene = {
  unit: string;
  stageWidth: string;
  ratio: string;
  big: Big;
  marks: Mark[];
  segs: Seg[];
  handles: { x: number; y: number }[];
  badges: Badge[];
  title: Title;
};

const desktop: Scene = {
  unit: "min(1vw, 1.4svh)",
  stageWidth: "min(100vw, calc(100svh * 2296 / 1623))",
  ratio: "2296 / 1623",
  big: { x: 8.45, y: 3.9, w: 6.2, bw: 142, bh: 186, r: 32, sw: 5, edge: true },
  marks: [
    { kind: "tech", x: 92.3, y: 7.7, w: 4.6, edge: true },
    { kind: "sparkle", x: 86.2, y: 24.5, w: 3.1 },
    { kind: "dot", x: 71.5, y: 24.5, w: 1.8 },
    { kind: "sparkle", x: 7.1, y: 42.5, w: 3.1, edge: true },
    { kind: "tech", x: 9.4, y: 46.5, w: 2.3, edge: true },
    { kind: "dot", x: 33.2, y: 67.4, w: 1.9 },
    { kind: "tech", x: 82.1, y: 51.6, w: 2.3 },
    { kind: "dot", x: 92.8, y: 88.5, w: 1.8, edge: true },
  ],
  segs: [
    { x1: 29.75, y1: 23.7, x2: 35.06, y2: 23.7 },
    { x1: 35.06, y1: 23.7, x2: 45.6, y2: 34.3, dashed: true },
    { x1: 70.6, y1: 46.3, x2: 80.1, y2: 52.7 },
    { x1: 80.1, y1: 52.7, x2: 80.1, y2: 56.6, dashed: true },
  ],
  handles: [
    { x: 45.6, y: 34.3 },
    { x: 70.6, y: 46.3 },
  ],
  badges: [
    {
      id: "uiux", target: "uiux-works", label: "View UI/UX designs", ring: ringUiux,
      x: 19.55, y: 30.3, d: 22.65, dir: 1, speed: 45,
      line1: "UI/UX", pos: { top: "32.7%", left: "18.8%" },
      main: 22, sub: 12.3, indent: 6.7, gap: -1.9, align: "start",
    },
    {
      id: "graphic", target: "graphic-works", label: "View graphic designs", ring: ringGraphic,
      x: 79.3, y: 73.3, d: 23.8, dir: -1, speed: 55,
      line1: "GRAPHIC", pos: { top: "36.1%", right: "22.2%" },
      main: 16.5, sub: 10.4, indent: 0, gap: 0, align: "end",
    },
  ],
  title: { x: 49.7, y: 48.1, w: 30.5, ratio: 700 / 390, cY: 9.7, ofY: 35.6, wY: 80, starL: 24.1, starR: 76.1, sw: 12.9, cFont: 12.6, wFont: 29.6 },
};

const mobile: Scene = {
  unit: "min(1vw, 0.45svh)",
  stageWidth: "min(100vw, calc(100svh * 720 / 1625))",
  ratio: "720 / 1625",
  big: { x: 15.6, y: 2.7, w: 12.4, bw: 89, bh: 118, r: 20, sw: 4 },
  marks: [
    { kind: "tech", x: 96.9, y: 6.6, w: 5.8 },
    { kind: "dot", x: 77.5, y: 8.2, w: 3.3 },
    { kind: "sparkle", x: 86.8, y: 15.8, w: 5.8 },
    { kind: "sparkle", x: 6.8, y: 31.3, w: 5.6 },
    { kind: "tech", x: 11.25, y: 33.7, w: 4.4 },
    { kind: "tech", x: 87.9, y: 60.9, w: 4.7 },
    { kind: "tech", x: 8.75, y: 90.2, w: 27.8 },
    { kind: "dot", x: 91.1, y: 88, w: 7.2 },
  ],
  segs: [
    { x1: 40.3, y1: 19.3, x2: 48.6, y2: 19.3 },
    { x1: 48.6, y1: 19.3, x2: 69.4, y2: 33, dashed: true },
    { x1: 59.3, y1: 54.8, x2: 72.9, y2: 59.4 },
    { x1: 72.9, y1: 59.4, x2: 72.9, y2: 61.7, dashed: true },
  ],
  handles: [
    { x: 69.4, y: 33 },
    { x: 59.3, y: 54.8 },
  ],
  badges: [
    {
      id: "uiux", target: "uiux-works", label: "View UI/UX designs", ring: ringUiux,
      x: 23.3, y: 22.8, d: 36.9, dir: 1, speed: 45,
      line1: "UI/UX", pos: { top: "34.6%", left: "18.8%" },
      main: 20.3, sub: 12.4, indent: 7.5, gap: -1.9, align: "start",
    },
    {
      id: "graphic", target: "graphic-works", label: "View graphic designs", ring: ringGraphic,
      x: 71.25, y: 71.4, d: 43.5, dir: -1, speed: 55,
      line1: "GRAPHIC", pos: { top: "35.9%", right: "21.6%" },
      main: 17.3, sub: 10.5, indent: 0, gap: -0.6, align: "end",
    },
  ],
  title: { x: 49.2, y: 44.9, w: 55.6, ratio: 400 / 230, cY: 11.5, ofY: 36.3, wY: 78.3, starL: 24, starR: 76.3, sw: 12.5, cFont: 13.3, wFont: 30 },
};

/* ---------- Small pieces ---------- */

// Crosshair with a solid dot in the middle
function DotCross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M10 0V20M0 10H20" stroke="#0A0A0A" strokeWidth="1.1" fill="none" />
      <circle cx="10" cy="10" r="3.4" fill="#0A0A0A" />
    </svg>
  );
}

// Big bold crosshair with a filled dot
function BigDot({ bw, bh, r, sw }: { bw: number; bh: number; r: number; sw: number }) {
  return (
    <svg viewBox={`0 0 ${bw} ${bh}`} aria-hidden="true" className="block w-full">
      <path d={`M${bw / 2} 0V${bh}M0 ${bh / 2}H${bw}`} stroke="#000" strokeWidth={sw} fill="none" />
      <circle cx={bw / 2} cy={bh / 2} r={r} fill="#000" />
    </svg>
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

function MarkItem({ m, edge }: { m: Mark; edge: boolean }) {
  return (
    <div
      className="absolute"
      style={{ left: `${m.x}%`, top: `${m.y}%`, width: edge ? u(m.w) : `${m.w}%`, translate: "-50% -50%" }}
    >
      {m.kind === "dot" ? (
        <DotCross className="block w-full" />
      ) : (
        <img
          src={m.kind === "tech" ? starTech : starBlack}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="block w-full select-none"
        />
      )}
    </div>
  );
}

function BigItem({ big, edge }: { big: Big; edge: boolean }) {
  return (
    <div
      className="absolute"
      style={{ left: `${big.x}%`, top: `${big.y}%`, width: edge ? u(big.w) : `${big.w}%`, translate: "-50% -50%" }}
    >
      <BigDot bw={big.bw} bh={big.bh} r={big.r} sw={big.sw} />
    </div>
  );
}

function BadgeButton({ b }: { b: Badge }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="absolute"
      style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.d}%`, translate: "-50% -50%" }}
    >
      <motion.button
        type="button"
        aria-label={b.label}
        onClick={() => goTo(b.target)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="group pointer-events-auto relative block aspect-square w-full cursor-pointer rounded-full outline-none [container-type:inline-size] focus-visible:ring-2 focus-visible:ring-neutral-300"
      >
        {/* Light grey fill while pressed */}
        <span className="absolute inset-[5%] rounded-full bg-neutral-100 opacity-0 transition-opacity duration-200 group-active:opacity-100" />

        {/* Rotating ring (text stays still) */}
        <motion.img
          src={b.ring}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 size-full select-none"
          animate={reduce ? undefined : { rotate: 360 * b.dir }}
          transition={{ duration: b.speed, ease: "linear", repeat: Infinity }}
        />

        {/* Label */}
        <span
          className="absolute flex flex-col"
          style={{ ...b.pos, alignItems: b.align === "end" ? "flex-end" : "flex-start" }}
        >
          <span
            className="block whitespace-nowrap font-heading leading-none text-black"
            style={{ fontSize: `${b.main}cqw`, marginLeft: b.indent ? `${b.indent}cqw` : 0 }}
          >
            {b.line1}
          </span>
          <span
            className="block whitespace-nowrap font-sub leading-none text-black"
            style={{ fontSize: `${b.sub}cqw`, marginTop: `${b.gap}cqw` }}
          >
            DESIGNS
          </span>
        </span>
      </motion.button>
    </div>
  );
}

/* ---------- One full layout (desktop or mobile) ---------- */

function SceneLayer({ scene, className }: { scene: Scene; className: string }) {
  const t = scene.title;
  const edgeMarks = scene.marks.filter((m) => m.edge);
  const stageMarks = scene.marks.filter((m) => !m.edge);

  return (
    <div
      className={`pointer-events-none absolute inset-0 items-center justify-center ${className}`}
      style={{ "--u": scene.unit } as CSSProperties}
    >
      {/* Decorations that hug the screen edges */}
      {scene.big.edge && <BigItem big={scene.big} edge />}
      {edgeMarks.map((m, i) => (
        <MarkItem key={`e${i}`} m={m} edge />
      ))}

      {/* Stage: keeps the Figma frame's proportions so everything lines up */}
      <div className="relative" style={{ width: scene.stageWidth, aspectRatio: scene.ratio }}>
        {/* Connector lines */}
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {scene.segs.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="#000"
              strokeWidth="1"
              strokeDasharray={s.dashed ? "4 4" : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Square handles at the line ends */}
        {scene.handles.map((h, i) => (
          <span
            key={i}
            className="absolute border border-black bg-white"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: "max(6px, 0.5%)",
              aspectRatio: "1",
              translate: "-50% -50%",
            }}
          />
        ))}

        {!scene.big.edge && <BigItem big={scene.big} edge={false} />}
        {stageMarks.map((m, i) => (
          <MarkItem key={`s${i}`} m={m} edge={false} />
        ))}

        {/* Title: COLLECTION ✦✦ OF ✦✦ WORKS */}
        <h2
          aria-label="Collection of Works"
          className="absolute [container-type:inline-size]"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: `${t.w}%`,
            aspectRatio: `${t.ratio}`,
            translate: "-50% -50%",
          }}
        >
          <span
            className="absolute left-1/2 block whitespace-nowrap font-heading leading-none text-black"
            style={{ top: `${t.cY}%`, translate: "-50% -50%", fontSize: `${t.cFont}cqw` }}
          >
            COLLECTION
          </span>
          <span
            className="absolute left-1/2 block whitespace-nowrap font-heading leading-none text-black"
            style={{ top: `${t.ofY}%`, translate: "-50% -50%", fontSize: `${t.cFont}cqw` }}
          >
            OF
          </span>
          <span
            className="absolute block"
            style={{ left: `${t.starL}%`, top: `${t.ofY}%`, width: `${t.sw}cqw`, translate: "-50% -50%" }}
          >
            <Sparks />
          </span>
          <span
            className="absolute block"
            style={{ left: `${t.starR}%`, top: `${t.ofY}%`, width: `${t.sw}cqw`, translate: "-50% -50%" }}
          >
            <Sparks reverse />
          </span>
          <span
            className="absolute left-1/2 block whitespace-nowrap font-heading leading-none text-black"
            style={{ top: `${t.wY}%`, translate: "-50% -50%", fontSize: `${t.wFont}cqw` }}
          >
            WORKS
          </span>
        </h2>

        {/* Circular buttons */}
        {scene.badges.map((b) => (
          <BadgeButton key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Works() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll-linked sideways entrance: the page pans in as it reaches the top of the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const x = useTransform(scrollYProgress, [0, 1], [ENTER_FROM, "0%"]);
  const opacity = useTransform(scrollYProgress, [0.15, 1], [0, 1]);

  return (
    <section ref={ref} id="works" className="relative min-h-svh overflow-hidden">
      <motion.div
        style={{ x: reduce ? 0 : x, opacity: reduce ? 1 : opacity }}
        className="absolute inset-0"
      >
        <SceneLayer scene={desktop} className="hidden lg:flex" />
        <SceneLayer scene={mobile} className="flex lg:hidden" />
      </motion.div>
    </section>
  );
}