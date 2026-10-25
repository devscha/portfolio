import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import meScript from "../assets/elements/me-script.svg";
import iconFacebook from "../assets/elements/fb-icon.svg";
import iconGmail from "../assets/elements/gmail-icon.svg";
import iconPhone from "../assets/elements/phone-icon.svg";
import iconGithub from "../assets/elements/github-icon.svg";
import iconLinkedin from "../assets/elements/linkedin-icon.svg";
import starNavy from "../assets/elements/star Navy.svg";
import starTech from "../assets/elements/starTech.svg";

/* social links */
const LINKS = {
  facebook: "https://www.facebook.com/charlotte.devera21/", // 
  gmail:
    "https://mail.google.com/mail/?view=cm&fs=1&to=deveracharlotte08@gmail.com&su=Hello%20Charlotte!",
  phone: "tel:+639566604479", 
  github: "https://github.com/devscha", 
  linkedin: "https://www.linkedin.com/in/charlotte-arriane-de-vera-4175a4337/", 
};

const ease = [0.65, 0, 0.35, 1] as const;

const FIT = 0.62;

// Pans upward into view once, as the page is reached
const rise = (delay = 0) => ({
  hidden: { y: 70, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.9, ease, delay } },
});
const inView = { once: true, amount: 0.2 } as const;

/* Layout data (all numbers are pixels in the Figma frame)  */

type Img = { kind: "tech" | "navy"; x: number; y: number; w: number }; // x, y = center
type Dot = { x: number; y: number; w: number };
type Txt = { text: string; x: number; y: number; size: number; font: "heading" | "sub"; left?: boolean };
type Eyebrow = { text: string; x: number; y: number; size: number; sparkW: number; gap: number };
type Btn = {
  id: string;
  label: string;
  href: string;
  external: boolean;
  x: number; 
  y: number;
  w: number;
  h: number;
  r: number;
  icon: { src: string; x: number; y: number; w: number };
  texts: Txt[]; 
};
type Scene = {
  W: number;
  H: number;
  unit: string;
  stageWidth: string;
  edgeImgs: Img[];
  edgeBig: { x: number; y: number; bw: number; bh: number; r: number; sw: number };
  imgs: Img[];
  dots: Dot[];
  eyebrow: Eyebrow;
  texts: Txt[];
  me: { x: number; y: number; w: number };
  btns: Btn[];
};

const desktop: Scene = {
  W: 2296,
  H: 1623,
  unit: "min(1vw, 1.4svh)",
  stageWidth: "min(100vw, calc(100svh * 2296 / 1623))",
  edgeImgs: [
    { kind: "tech", x: 69, y: 48, w: 240 },
    { kind: "tech", x: 2212, y: 581, w: 198 },
    { kind: "navy", x: 0, y: 935, w: 236 },
    { kind: "navy", x: 2296, y: 930, w: 262 },
  ],
  edgeBig: { x: 2150, y: 1548, bw: 253, bh: 334, r: 56, sw: 12 },
  imgs: [
    { kind: "tech", x: 353, y: 728, w: 88 },
    { kind: "navy", x: 305, y: 796, w: 38 },
    { kind: "navy", x: 155, y: 1500, w: 68 },
    { kind: "tech", x: 209, y: 1440, w: 40 },
  ],
  dots: [{ x: 2093, y: 366, w: 38 }],
  eyebrow: { text: "CONTACTS", x: 1133, y: 137, size: 48, sparkW: 92, gap: 34 },
  texts: [
    { text: "REACH", x: 440, y: 380, size: 200, font: "heading", left: true },
    { text: "YOU CAN CONTACT ME THROUGH MY SOCIAL LINKS BELOW.", x: 1142, y: 794, size: 52, font: "heading" },
  ],
  me: { x: 1360, y: 479, w: 630 },
  btns: [
    {
      id: "facebook", label: "Facebook", href: LINKS.facebook, external: true,
      x: 352, y: 886, w: 774, h: 150, r: 55,
      icon: { src: iconFacebook, x: 436, y: 957, w: 42 },
      texts: [
        { text: "CHARLOTTE DE VERA", x: 0, y: 0, size: 52, font: "heading" },
        { text: "FACEBOOK", x: 0, y: 0, size: 30, font: "sub" },
      ],
    },
    {
      id: "gmail", label: "Gmail", href: LINKS.gmail, external: true,
      x: 1158, y: 886, w: 774, h: 150, r: 55,
      icon: { src: iconGmail, x: 1248, y: 963, w: 86 },
      texts: [
        { text: "DEVERACHARLOTTE08@GMAIL.COM", x: 0, y: 0, size: 36, font: "heading" },
        { text: "GMAIL", x: 0, y: 0, size: 30, font: "sub" },
      ],
    },
    {
      id: "github", label: "GitHub", href: LINKS.github, external: true,
      x: 560, y: 1091, w: 161, h: 149, r: 45,
      icon: { src: iconGithub, x: 640, y: 1166, w: 109 },
      texts: [],
    },
    {
      id: "linkedin", label: "LinkedIn", href: LINKS.linkedin, external: true,
      x: 770, y: 1091, w: 161, h: 149, r: 45,
      icon: { src: iconLinkedin, x: 856, y: 1166, w: 87 },
      texts: [],
    },
    {
      id: "phone", label: "Phone", href: LINKS.phone, external: false,
      x: 979, y: 1091, w: 774, h: 149, r: 55,
      icon: { src: iconPhone, x: 1080, y: 1166, w: 90 },
      texts: [
        { text: "09566604479", x: 0, y: 0, size: 62, font: "sub" },
        { text: "PHONE", x: 0, y: 0, size: 30, font: "sub" },
      ],
    },
  ],
};

const mobile: Scene = {
  W: 720,
  H: 1600,
  unit: "min(1vw, 0.45svh)",
  stageWidth: "min(100vw, calc(100svh * 720 / 1600))",
  edgeImgs: [
    { kind: "tech", x: 33, y: 39, w: 126 },
    { kind: "tech", x: 700, y: 704, w: 76 },
    { kind: "navy", x: 0, y: 915, w: 190 },
    { kind: "navy", x: 720, y: 915, w: 190 },
  ],
  edgeBig: { x: 623, y: 1517, bw: 174, bh: 234, r: 38, sw: 9 },
  imgs: [
    { kind: "tech", x: 145, y: 625, w: 50 },
    { kind: "navy", x: 117, y: 664, w: 21 },
    { kind: "navy", x: 72, y: 1500, w: 85 },
    { kind: "tech", x: 140, y: 1423, w: 48 },
  ],
  dots: [{ x: 637, y: 309, w: 28 }],
  eyebrow: { text: "CONTACTS", x: 352, y: 170, size: 33, sparkW: 56, gap: 20 },
  texts: [
    { text: "REACH", x: 140, y: 366, size: 96, font: "heading", left: true },
    { text: "YOU CAN CONTACT ME", x: 383, y: 747, size: 34, font: "heading" },
    { text: "THROUGH MY SOCIAL LINKS", x: 383, y: 777, size: 34, font: "heading" },
    { text: "BELOW.", x: 383, y: 807, size: 34, font: "heading" },
  ],
  me: { x: 441, y: 530, w: 427 },
  btns: [
    {
      id: "facebook", label: "Facebook", href: LINKS.facebook, external: true,
      x: 187, y: 866, w: 393, h: 75, r: 30,
      icon: { src: iconFacebook, x: 228, y: 903, w: 20 },
      texts: [
        { text: "CHARLOTTE DE VERA", x: 0, y: 0, size: 26, font: "heading" },
        { text: "FACEBOOK", x: 0, y: 0, size: 15, font: "sub" },
      ],
    },
    {
      id: "gmail", label: "Gmail", href: LINKS.gmail, external: true,
      x: 187, y: 962, w: 393, h: 75, r: 30,
      icon: { src: iconGmail, x: 231, y: 1000, w: 45 },
      texts: [
        { text: "DEVERACHARLOTTE08@GMAIL.COM", x: 0, y: 0, size: 17, font: "heading" },
        { text: "GMAIL", x: 0, y: 0, size: 15, font: "sub" },
      ],
    },
    {
      id: "phone", label: "Phone", href: LINKS.phone, external: false,
      x: 187, y: 1064, w: 393, h: 75, r: 30,
      icon: { src: iconPhone, x: 239, y: 1101, w: 46 },
      texts: [
        { text: "09566604479", x: 0, y: 0, size: 30, font: "heading" },
        { text: "PHONE", x: 0, y: 0, size: 15, font: "sub" },
      ],
    },
    {
      id: "github", label: "GitHub", href: LINKS.github, external: true,
      x: 254, y: 1168, w: 107, h: 97, r: 30,
      icon: { src: iconGithub, x: 308, y: 1217, w: 72 },
      texts: [],
    },
    {
      id: "linkedin", label: "LinkedIn", href: LINKS.linkedin, external: true,
      x: 393, y: 1168, w: 107, h: 97, r: 30,
      icon: { src: iconLinkedin, x: 451, y: 1217, w: 60 },
      texts: [],
    },
  ],
};

/* Small pieces */

const pc = (n: number, total: number) => `${(n / total) * 100}%`;
const cq = (n: number, W: number) => `${(n / W) * 100}cqw`;
const srcOf = (k: "tech" | "navy") => (k === "tech" ? starTech : starNavy);

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

// Absolutely positioned item that pans up into view
function Pop({
  left,
  top,
  width,
  anchor = "center",
  delay = 0,
  children,
}: {
  left: string;
  top: string;
  width?: string;
  anchor?: "center" | "left" | "tl";
  delay?: number;
  children: ReactNode;
}) {
  const translate = anchor === "tl" ? "0 0" : anchor === "left" ? "0 -50%" : "-50% -50%";
  return (
    <motion.div
      variants={rise(delay)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="absolute"
      style={{ left, top, width, translate }}
    >
      {children}
    </motion.div>
  );
}

// `size` lets a caller shrink the text below the Figma size (never above it)
function Label({ t, W, size }: { t: Txt; W: number; size?: number }) {
  return (
    <span
      className={`block whitespace-nowrap leading-none text-black ${
        t.font === "heading" ? "font-heading" : "font-sub"
      }`}
      style={{ fontSize: cq(size ?? t.size, W) }}
    >
      {t.text}
    </span>
  );
}

function ButtonLink({ b, W, H, delay }: { b: Btn; W: number; H: number; delay: number }) {
  const iconOnly = b.texts.length === 0;

  const padL = Math.round(b.h * 0.28);
  const gap = Math.round(b.h * 0.2);
  const padR = Math.round(b.h * 0.15);
  const avail = b.w - padL - b.icon.w - gap - padR;

  return (
    <Pop left={pc(b.x, W)} top={pc(b.y, H)} width={pc(b.w, W)} anchor="tl" delay={delay}>
      <motion.a
        href={b.href}
        target={b.external ? "_blank" : undefined}
        rel={b.external ? "noopener noreferrer" : undefined}
        aria-label={b.label}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="pointer-events-auto relative flex w-full items-center border border-black outline-none transition-[background-color,box-shadow] duration-200 hover:bg-neutral-50 hover:shadow-[0_10px_24px_rgba(10,21,66,0.10)] active:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-300"
        style={{
          aspectRatio: `${b.w} / ${b.h}`,
          borderRadius: cq(b.r, W),
          justifyContent: iconOnly ? "center" : undefined,
          paddingLeft: iconOnly ? 0 : cq(padL, W),
          paddingRight: iconOnly ? 0 : cq(padR, W),
        }}
      >
        <img
          src={b.icon.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="block shrink-0 select-none"
          style={{ width: cq(b.icon.w, W), marginRight: iconOnly ? 0 : cq(gap, W) }}
        />
        {!iconOnly && (
          <span
            className="flex min-w-0 flex-1 flex-col items-center"
            style={{ rowGap: cq(b.h * 0.06, W) }}
          >
            {b.texts.map((t, i) => (
              <Label
                key={i}
                t={t}
                W={W}
                size={Math.min(t.size, avail / (t.text.length * FIT))}
              />
            ))}
          </span>
        )}
      </motion.a>
    </Pop>
  );
}

/* One full layout (desktop or mobile) */
function SceneLayer({ scene, className }: { scene: Scene; className: string }) {
  const { W, H } = scene;
  const u = (px: number) => `calc(var(--u) * ${(px / W) * 100})`;
  const big = scene.edgeBig;
  const eb = scene.eyebrow;

  return (
    <div
      className={`pointer-events-none absolute inset-0 items-center justify-center ${className}`}
      style={{ "--u": scene.unit } as CSSProperties}
    >
      {/* Decorations that hug the screen edges */}
      {scene.edgeImgs.map((e, i) => (
        <Pop key={`e${i}`} left={pc(e.x, W)} top={pc(e.y, H)} width={u(e.w)} delay={0.05 * i}>
          <img src={srcOf(e.kind)} alt="" aria-hidden="true" draggable={false} className="block w-full select-none" />
        </Pop>
      ))}
      <Pop left={pc(big.x, W)} top={pc(big.y, H)} width={u(big.bw)} delay={0.2}>
        <BigDot bw={big.bw} bh={big.bh} r={big.r} sw={big.sw} />
      </Pop>

      {/* Stage: keeps the Figma frame's proportions so everything lines up */}
      <div
        className="relative [container-type:inline-size]"
        style={{ width: scene.stageWidth, aspectRatio: `${W} / ${H}` }}
      >
        {/* Small decorations */}
        {scene.imgs.map((m, i) => (
          <Pop key={`i${i}`} left={pc(m.x, W)} top={pc(m.y, H)} width={pc(m.w, W)} delay={0.3 + i * 0.04}>
            <img src={srcOf(m.kind)} alt="" aria-hidden="true" draggable={false} className="block w-full select-none" />
          </Pop>
        ))}
        {scene.dots.map((d, i) => (
          <Pop key={`d${i}`} left={pc(d.x, W)} top={pc(d.y, H)} width={pc(d.w, W)} delay={0.4}>
            <DotCross className="block w-full" />
          </Pop>
        ))}

        {/* ✦✦ CONTACTS ✦✦ */}
        <Pop left={pc(eb.x, W)} top={pc(eb.y, H)} delay={0}>
          <div className="flex items-center whitespace-nowrap" style={{ columnGap: cq(eb.gap, W) }}>
            <div className="shrink-0" style={{ width: cq(eb.sparkW, W) }}>
              <Sparks />
            </div>
            <Label t={{ text: eb.text, x: 0, y: 0, size: eb.size, font: "heading" }} W={W} />
            <div className="shrink-0" style={{ width: cq(eb.sparkW, W) }}>
              <Sparks reverse />
            </div>
          </div>
        </Pop>

        {/* Headline and intro text */}
        {scene.texts.map((t, i) => (
          <Pop
            key={`t${i}`}
            left={pc(t.x, W)}
            top={pc(t.y, H)}
            anchor={t.left ? "left" : "center"}
            delay={0.1 + (i + 1) * 0.06}
          >
            <Label t={t} W={W} />
          </Pop>
        ))}

        {/* "ME!" lettering */}
        <Pop left={pc(scene.me.x, W)} top={pc(scene.me.y, H)} width={pc(scene.me.w, W)} delay={0.2}>
          <h2 className="m-0">
            <img src={meScript} alt="Me!" draggable={false} className="block w-full select-none" />
          </h2>
        </Pop>

        {/* Link buttons */}
        {scene.btns.map((b, i) => (
          <ButtonLink key={b.id} b={b} W={W} H={H} delay={0.3 + i * 0.08} />
        ))}
      </div>
    </div>
  );
}

/* Page */
export default function Contacts() {
  return (
    <section id="contacts" className="relative min-h-svh overflow-hidden">
      <SceneLayer scene={desktop} className="hidden lg:flex" />
      <SceneLayer scene={mobile} className="flex lg:hidden" />
    </section>
  );
}