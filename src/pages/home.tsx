import { useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import wordmark from "../assets/elements/PORTFOLIO.svg";
import cursorIcon from "../assets/elements/cursor.svg";
import starAim from "../assets/elements/star aim.svg";
import starGradient from "../assets/elements/Star Gradient.svg";
import starNavy from "../assets/elements/star Navy.svg";
import starBlack from "../assets/elements/starBlack.svg";
import starTech from "../assets/elements/starTech.svg";

const swatches = ["#0A1542", "#1C2BC2", "#1B90F0", "#7692FF", "#ABD2FB", "#FFFFFF"];
const ease = [0.65, 0, 0.35, 1] as const;

// Pans up from the bottom once `ready` is true
const rise = (delay = 0) => ({
  hidden: { y: 90, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1, ease, delay } },
});
const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease, delay: 0.6 } },
};

// 1 unit = 1% of the Figma frame width
const u = (n: number) => `calc(var(--u) * ${n})`;

/* Layout data (x, y = % of section; w = units) */

type Part = { src: string; x: number; y: number; w: number }; // % inside a cluster box
type Star = {
  src?: string;
  kind?: "dot";
  parts?: Part[];
  x: number;
  y: number;
  w: number;
  box?: boolean;
};
type Line = {
  dir: "h" | "v";
  x: number;
  y: number;
  len: number;
  tone: "blue" | "violet" | "faint" | "bold";
};
type BubbleCfg = {
  text: string;
  x: number;
  y: number;
  font: number;
  fill: string;
  arrow: "below" | "above";
};
type Scene = {
  unit: string;
  palette: { x: number; y: number; d: number };
  word: { x: number; y: number; w: number };
  stars: Star[];
  lines: Line[];
  bubbles: BubbleCfg[];
};

// Sparkle clusters, positioned inside their own square box
const sparkleA: Part[] = [
  { src: starBlack, x: 50, y: 49, w: 98 },
  { src: starNavy, x: 24.5, y: 22, w: 16 },
  { src: starAim, x: 75, y: 79, w: 12 },
];
const sparkleB: Part[] = [
  { src: starBlack, x: 50, y: 50, w: 100 },
  { src: starAim, x: 72, y: 30, w: 12 },
  { src: starNavy, x: 27, y: 80, w: 16 },
];

const desktop: Scene = {
  unit: "min(1vw, 1.4svh)",
  palette: { x: 6.2, y: 8.6, d: 5.1 },
  word: { x: 46, y: 41.7, w: 39.4 },
  stars: [
    { src: starTech, x: 58.3, y: 3.7, w: 5.5 },
    { src: starTech, x: 87.9, y: 1.1, w: 2.7 },
    { src: starTech, x: 35.2, y: 8.1, w: 2.7 },
    { src: starTech, x: 1.5, y: 42.5, w: 5.5 },
    { src: starTech, x: 99.4, y: 90.6, w: 5.5 },
    { src: starTech, x: 25, y: 30.6, w: 1.4 },
    { src: starTech, x: 66.6, y: 61.8, w: 1.6 },
    { kind: "dot", x: 26, y: 28.6, w: 1.1 },
    { kind: "dot", x: 9.2, y: 89.8, w: 1.9 },
    { kind: "dot", x: 88.4, y: 84.1, w: 1.9 },
    { parts: sparkleB, x: 78.4, y: 19.1, w: 9.3 },
    { parts: sparkleA, x: 18, y: 73.2, w: 9.5, box: true },
    ...[28.1, 34, 39.9, 45.8, 51.5].map((y) => ({ src: starNavy, x: 92.4, y, w: 3.1 })),
    { src: starGradient, x: 92.4, y: 77, w: 27.6 },
  ],
  lines: [
    { dir: "v", x: 92.4, y: 7.7, len: 50, tone: "violet" },
    { dir: "h", x: 0, y: 21.1, len: 6.3, tone: "blue" },
    { dir: "h", x: 9, y: 73.2, len: 5.85, tone: "bold" },
    { dir: "v", x: 18, y: 61, len: 7.45, tone: "bold" },
    ],
  bubbles: [
    { text: "Design with me, ano tara?", x: 20.05, y: 8.9, font: 0.9, fill: "#1B90F0", arrow: "below" },
    { text: "by Charlotte Arriane S. De Vera", x: 71.8, y: 66.7, font: 0.86, fill: "#3652A3", arrow: "above" },
  ],
};

const mobile: Scene = {
  unit: "min(1vw, 0.45svh)",
  palette: { x: 13.5, y: 7.6, d: 10.1 },
  word: { x: 48.8, y: 42.4, w: 73.2 },
  stars: [
    { src: starTech, x: 3.9, y: 1.6, w: 1.9 },
    { src: starAim, x: 6.9, y: 3.75, w: 2.5 },
    { src: starTech, x: 57, y: 4.7, w: 8.1 },
    { src: starTech, x: 98.3, y: 3.75, w: 3.5 },
    { parts: sparkleB, x: 85.1, y: 11.75, w: 12.8 },
    { src: starTech, x: 10.3, y: 35.9, w: 2.8 },
    { kind: "dot", x: 12.1, y: 34.7, w: 1.7 },
    { src: starTech, x: 3.75, y: 49.1, w: 7.8 },
    { parts: sparkleA, x: 28.3, y: 63.6, w: 14.4, box: true },
    { kind: "dot", x: 15.3, y: 71.6, w: 2.5 },
    ...[71.6, 73.75, 75.8, 77.9].map((y) => ({ src: starNavy, x: 91, y, w: 3.6 })),
    { src: starGradient, x: 91, y: 88.75, w: 29.7 },
    { kind: "dot", x: 86.5, y: 91.5, w: 1.8 },
    { src: starTech, x: 98.3, y: 93.75, w: 4.4 },
  ],
  lines: [
    { dir: "h", x: 0, y: 15.6, len: 13.5, tone: "blue" },
    { dir: "v", x: 91, y: 64.4, len: 18.6, tone: "violet" },
    { dir: "h", x: 15, y: 63.6, len: 9.1, tone: "bold" },
    { dir: "v", x: 28.3, y: 59, len: 3.4, tone: "bold" },
    ],
  bubbles: [
    { text: "Design with me, ano tara?", x: 41.1, y: 7.9, font: 1.85, fill: "#1B90F0", arrow: "below" },
    { text: "by Charlotte Arriane S. De Vera", x: 77.6, y: 61.3, font: 1.68, fill: "#3652A3", arrow: "above" },
  ],
};

/* Small pieces */

const lineStyle = {
  blue: "border-dashed border-primary/60",
  violet: "border-dashed border-periwinkle/70",
  faint: "border-solid border-sky/40",
  bold: "border-dashed border-[#7CB9FA]",
} as const;

// Figma-style selection box with corner handles
function SelectBox({ className = "", faint = false }: { className?: string; faint?: boolean }) {
  const tone = faint ? "border-primary/35" : "border-primary/70";
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute border ${tone} ${className}`}>
      {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map(
        (p) => (
          <i key={p} className={`absolute size-[6px] border bg-white ${tone} ${p}`} />
        )
      )}
    </span>
  );
}

// Crosshair with a solid dot in the middle
function DotCross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M10 0V20M0 10H20" stroke="#0A0A0A" strokeWidth="1.1" fill="none" />
      <circle cx="10" cy="10" r="3.4" fill="#0A0A0A" />
    </svg>
  );
}

// Cursor from your Figma export
function Cursor({ flip, style }: { flip: boolean; style: CSSProperties }) {
  return (
    <img
      src={cursorIcon}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="absolute w-[1.7em] select-none"
      style={{ ...style, transform: flip ? "scaleY(-1)" : undefined }}
    />
  );
}

function Bubble({ b, state, delay }: { b: BubbleCfg; state: "hidden" | "show"; delay: number }) {
  const below = b.arrow === "below";
  return (
    <motion.div
      variants={rise(delay)}
      initial="hidden"
      animate={state}
      className="absolute"
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        translate: "-50% -50%",
        fontSize: `max(7px, ${u(b.font)})`,
      }}
    >
      <div
        className="relative flex items-center whitespace-nowrap border border-royal px-[1.2em] py-[0.5em] font-sans font-normal leading-[1.2] text-white"
        style={{
          background: b.fill,
          // one squared corner, next to the cursor
          borderRadius: below ? "999px 999px 999px 0.15em" : "0.15em 999px 999px 999px",
        }}
      >
        {b.text}
        <span className="ml-[0.3em] inline-block h-[1.1em] w-[0.09em] bg-white/90" />
        <Cursor
          flip={!below}
          style={below ? { left: "-1.24em", top: "calc(100% - 0.38em)" } : { left: "-1.14em", top: "-1.12em" }}
        />
      </div>
    </motion.div>
  );
}

/* One full layout (desktop or mobile) */
function SceneLayer({
  scene,
  state,
  className,
}: {
  scene: Scene;
  state: "hidden" | "show";
  className: string;
}) {
  const { palette: p, word: w } = scene;

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ "--u": scene.unit } as CSSProperties}
    >
      {/* Dashed guide lines */}
            {scene.lines.map((l, i) => (
                <motion.span
                    key={i}
                    variants={fade}
                    initial="hidden"
                    animate={state}
                    className={`absolute ${
                    l.dir === "h" ? "border-t" : "border-l"
                    } ${lineStyle[l.tone]}`}
                    style={{
                    left: `${l.x}%`,
                    top: `${l.y}%`,
                    width: l.dir === "h" ? `${l.len}%` : 0,
                    height: l.dir === "v" ? `${l.len}%` : 0,
                    }}
                />
                ))}

      {/* Sparkles, crosshairs and clusters */}
      {scene.stars.map((s, i) => (
        <motion.div
          key={i}
          variants={rise(0.1 + i * 0.03)}
          initial="hidden"
          animate={state}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: u(s.w), translate: "-50% -50%" }}
        >
          {s.kind === "dot" ? (
            <DotCross className="block w-full" />
          ) : s.parts ? (
            <div className="relative aspect-square w-full">
              {s.parts.map((part, j) => (
                <img
                  key={j}
                  src={part.src}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute select-none"
                  style={{
                    left: `${part.x}%`,
                    top: `${part.y}%`,
                    width: `${part.w}%`,
                    translate: "-50% -50%",
                  }}
                />
              ))}
              {s.box && <SelectBox className="inset-0" />}
            </div>
          ) : (
            <img src={s.src} alt="" aria-hidden="true" draggable={false} className="block w-full select-none" />
          )}
        </motion.div>
      ))}

      {/* Palette circles */}
      <motion.div
        variants={rise(0.15)}
        initial="hidden"
        animate={state}
        className="absolute"
        style={{ left: `${p.x}%`, top: `${p.y}%`, width: u(p.d) }}
      >
        <div className="relative">
          {swatches.map((c, i) => (
            <span
              key={c}
              className="block aspect-square w-full rounded-full shadow-[0_4px_10px_rgba(10,21,66,0.15)]"
              style={{ background: c, marginTop: i ? "-50%" : 0 }}
            />
          ))}
          <SelectBox className="inset-0" />
        </div>
      </motion.div>

      {/* Wordmark + sphere + 2026 */}
      <motion.div
        variants={rise(0)}
        initial="hidden"
        animate={state}
        className="absolute [container-type:inline-size]"
        style={{ left: `${w.x}%`, top: `${w.y}%`, width: u(w.w), translate: "-50% -50%" }}
      >
        <img src={wordmark} alt="Portfolio" draggable={false} className="block w-full select-none" />

        {/* Box around the sphere */}
        <SelectBox className="left-[74%] top-[58.9%] h-[27.6%] w-[25.8%]" />

        {/* 2026 with its own box */}
        <div className="absolute left-[91.9%] top-[29%] flex h-[24.6%] w-[15.8%] items-center justify-center">
          <span className="text-center font-heading text-[10.9cqw] leading-[1.05] text-black">
            20
            <br />
            26
          </span>
          <SelectBox faint className="inset-0" />
        </div>
      </motion.div>

      {/* Text bubbles */}
      {scene.bubbles.map((b, i) => (
        <Bubble key={i} b={b} state={state} delay={0.4 + i * 0.1} />
      ))}
    </div>
  );
}

/*  Page  */
export default function Home({ ready }: { ready: boolean }) {
  const state = ready ? "show" : "hidden";

  // Scroll-linked sideways pan: content slides left and fades as you leave the page
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative min-h-svh overflow-hidden">
      <motion.div style={{ x, opacity }} className="absolute inset-0">
        <SceneLayer scene={desktop} state={state} className="hidden lg:block" />
        <SceneLayer scene={mobile} state={state} className="lg:hidden" />
      </motion.div>
    </section>
  );
}