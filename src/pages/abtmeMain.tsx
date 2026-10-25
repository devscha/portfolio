import { useEffect, useRef, useState, type CSSProperties } from 'react'

import prof1 from '../assets/profileImg/profimg1.svg'  
import prof2 from '../assets/profileImg/profimg2.svg' 
import prof3 from '../assets/profileImg/profimg3.svg'
import star8 from '../assets/elements/Star 8.svg' 

const CSS = `
.about {
  --ink: #000000;
  --sky: #ABD2FB;
  --periwinkle: #7692FF;
  --blue: #1B90F0;
  --royal: #1C2BC2;
  --navy: #0A1542;

  /*rename to match your @font-face names in index.css*/
  --font-head: 'Seafont', serif;
  --font-sub: 'Gallient', serif;
  --font-body: 'Google Sans', system-ui, sans-serif;

  --u: calc(100cqw / 2294);
  --dir: 1;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: relative;
  width: 100%;
  aspect-ratio: 2294 / 1624;
  container-type: inline-size;
  overflow: hidden;
  overflow: clip;
  isolation: isolate;
  background: transparent; /* the fixed grid background in index.css shows through */
  color: var(--ink);
  font-family: var(--font-body);
}
.about *,
.about *::before,
.about *::after { box-sizing: border-box; }
.about h1, .about p, .about figure { margin: 0; }
.about--from-left { --dir: -1; }

/*  positioning helpers  */
.about .a  { position: absolute; left: calc(var(--x) * var(--u)); top: calc(var(--y) * var(--u)); }
.about .s  { width: calc(var(--w) * var(--u)); height: calc(var(--h) * var(--u)); }
.about .sw { width: calc(var(--w) * var(--u)); }

/*  sideways pan-in  */
.about .pan {
  translate: calc(var(--dir) * var(--pan, 20) * 1vw) 0;
  opacity: 0;
  transition: translate 1.25s var(--ease) var(--d, 0s), opacity 0.7s ease var(--d, 0s);
  will-change: translate, opacity;
}
.about.is-in .pan { translate: 0 0; opacity: 1; }
.pan--bg    { --pan: 14; --d: 0s; }
.pan--photo { --pan: 30; }
.pan--hl    { --pan: 40; --d: 0.18s; }
.pan--copy  { --pan: 26; --d: 0.4s; }
.photo--1 { --d: 0.1s; }
.photo--2 { --d: 0.18s; }
.photo--3 { --d: 0.26s; }
.w--ideas { --d: 0.24s; }
.w--to    { --d: 0.3s; }
.w--life  { --d: 0.36s; }

@media (prefers-reduced-motion: reduce) {
  .about .pan { transition: none; translate: 0 0; opacity: 1; }
}

/*  Figma smart-guides (blue dashed)  */
.guide { --t: 2; --dl: 12; --dg: 8; }
.guide--1, .guide--3, .guide--6 {
  width: calc(var(--w) * var(--u));
  height: calc(var(--t) * var(--u));
  background: repeating-linear-gradient(90deg, var(--blue) 0 calc(var(--dl) * var(--u)), transparent 0 calc((var(--dl) + var(--dg)) * var(--u)));
}
.guide--2, .guide--4, .guide--5, .guide--7 {
  width: calc(var(--t) * var(--u));
  height: calc(var(--h) * var(--u));
  background: repeating-linear-gradient(180deg, var(--blue) 0 calc(var(--dl) * var(--u)), transparent 0 calc((var(--dl) + var(--dg)) * var(--u)));
}
.guide--1 { --x: 0;   --y: 330;  --w: 259; }
.guide--2 { --x: 259; --y: 452;  --h: 317; }
.guide--3 { --x: 0;   --y: 769;  --w: 381; }
.guide--4 { --x: 215; --y: 769;  --h: 322; }
.guide--5 { --x: 667; --y: 1060; --h: 115; }
.guide--6 { --x: 555; --y: 1245; --w: 203; }
.guide--7 { --x: 376; --y: 1397; --h: 103; }

/*  crosshairs (zero-size anchor at the centre point)  */
.xh { width: 0; height: 0; color: var(--ink); }
.xh i { position: absolute; background: currentColor; }
.xh__l { top: calc(var(--th) * -0.5 * var(--u)); right: calc(var(--g) * var(--u)); width: calc((var(--l) - var(--g)) * var(--u)); height: calc(var(--th) * var(--u)); }
.xh__r { top: calc(var(--th) * -0.5 * var(--u)); left:  calc(var(--g) * var(--u)); width: calc((var(--r) - var(--g)) * var(--u)); height: calc(var(--th) * var(--u)); }
.xh__t { left: calc(var(--th) * -0.5 * var(--u)); bottom: calc(var(--g) * var(--u)); height: calc((var(--t) - var(--g)) * var(--u)); width: calc(var(--th) * var(--u)); }
.xh__b { left: calc(var(--th) * -0.5 * var(--u)); top:    calc(var(--g) * var(--u)); height: calc((var(--b) - var(--g)) * var(--u)); width: calc(var(--th) * var(--u)); }

.xh--tr   { --x: 2080; --y: 30;   --l: 60; --r: 60; --t: 30; --b: 60; --g: 15; --th: 7; }
.xh--left { --x: 45;   --y: 553;  --l: 45; --r: 82; --t: 80; --b: 82; --g: 22; --th: 6; }
.xh--dot  { --x: 193;  --y: 127;  --l: 22; --r: 22; --t: 29; --b: 29; --g: 0;  --th: 3; }
.xh--dot::after {
  content: '';
  position: absolute;
  width: calc(32 * var(--u));
  height: calc(32 * var(--u));
  left: calc(-16 * var(--u));
  top: calc(-16 * var(--u));
  border-radius: 50%;
  background: currentColor;
}
.xh--s1 { --x: 762;  --y: 1177; --l: 30; --r: 30; --t: 30; --b: 30; --g: 8; --th: 2.4; }
.xh--s2 { --x: 1520; --y: 1007; --l: 18; --r: 18; --t: 18; --b: 18; --g: 6; --th: 2; }

/*  photos (your SVGs already include the blue select box)  */
.photo { position: absolute; margin: 0; }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; display: block; }

/* box = design frame grown by the outer handle size so nothing is clipped */
.photo--1 { --x: 252; --y: 210;  --w: 279; --h: 249; }
.photo--2 { --x: 374; --y: 484;  --w: 586; --h: 583; }
.photo--3 { --x: 200; --y: 1084; --w: 362; --h: 320; }

/*  headline boxes (black)  */
.hlbox { position: absolute; --c: var(--ink); --hs: 11; --hb: 1.8; --fb: 2.2; --lt: 2.2; }
.hlbox--a { --x: 645;  --y: 251; --w: 687; --h: 209; }
.hlbox--b { --x: 1626; --y: 340; --w: 480; --h: 227; }
.hlbox--b::after {
  content: '';
  position: absolute;
  inset: 0;
  border: calc(var(--fb) * var(--u)) solid var(--c);
  pointer-events: none;
}
.hlbox .ln { position: absolute; background: var(--ink); }
.hlbox .ln--t { left: 0; top: 0; width: 100%; height: calc(var(--lt) * var(--u)); }
.hlbox .ln--l { left: 0; top: 0; height: 100%; width: calc(var(--lt) * var(--u)); }
.hlbox .ln--r { right: 0; top: 0; height: 50.7%; width: calc(var(--lt) * var(--u)); }
.hlbox .ln--d {
  left: 0; top: 50.7%; width: 100%; height: calc(var(--lt) * 0.7 * var(--u));
  background: repeating-linear-gradient(90deg, var(--ink) 0 calc(9 * var(--u)), transparent 0 calc(14 * var(--u)));
}
.hlbox .caret { position: absolute; left: 82.3%; top: 6.5%; height: 87%; width: calc(1.6 * var(--u)); background: rgba(0, 0, 0, 0.35); }

.h {
  position: absolute;
  z-index: 2;
  left: calc(var(--hx) * 100%);
  top: calc(var(--hy) * 100%);
  width: calc(var(--hs) * var(--u));
  height: calc(var(--hs) * var(--u));
  transform: translate(-50%, -50%);
  background: #fff;
  border: calc(var(--hb) * var(--u)) solid var(--c);
}

/*  headline words (Seafont)  */
.about .w {
  --bl: 0.86; /* baseline nudge: raise it to move words up, lower it to move them down */
  position: absolute;
  left: calc(var(--x) * var(--u));
  top: calc(var(--by) * var(--u));
  transform: translateY(calc(var(--bl) * -1em));
  font-family: var(--font-head);
  font-weight: 400;
  font-size: calc(var(--fs) * var(--u));
  line-height: 1;
  white-space: nowrap;
}
.w--let   { --x: 686;  --by: 352; --fs: 111; }
.w--your  { --x: 686;  --by: 457; --fs: 111; }
.w--ideas { --x: 1012; --by: 522; --fs: 174; }
.w--to    { --x: 1476; --by: 522; --fs: 99; }
.w--life  { --x: 1647; --by: 522; --fs: 221; }

/*  eyebrow (Gallient)  */
.eyebrow {
  --x: 905; --y: 157; --w: 457; --fs: 44;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  font-family: var(--font-sub);
  font-size: calc(var(--fs) * var(--u));
  line-height: 1;
  white-space: nowrap;
}
.stars { display: inline-flex; align-items: center; gap: 0.18em; }
.spark { display: block; flex: none; }

/*  bio (Google Sans)  */
.bio {
  --x: 1000; --y: 591; --w: 1090;
  font-size: calc(34.5 * var(--u));
  line-height: calc(55.5 * var(--u));
  text-align: left;
}
.bio .ln { display: block; white-space: nowrap; }
.bio__m { display: none; }
.rule {
  --x: 1540; --y: 1006; --w: 685;
  width: calc(var(--w) * var(--u));
  height: calc(1.6 * var(--u));
  background: repeating-linear-gradient(90deg, var(--ink) 0 calc(9 * var(--u)), transparent 0 calc(15 * var(--u)));
}

/*  pills (same feel as the navbar buttons)  */
.about .pills {
  --x: 998; --y: 1119;
  --pgap: 77; --ph: 88; --pfs: 54; --pb: 1.6;
  --pw1: 336; --pw2: 221; --pw3: 258;
  --primary: var(--color-primary, #1B90F0);
  z-index: 5;
  display: flex;
  gap: calc(var(--pgap) * var(--u));
}
.about .pill {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--ph) * var(--u));
  margin: 0;
  padding: 0;
  border: calc(var(--pb) * var(--u)) solid var(--ink);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-sub);
  font-size: calc(var(--pfs) * var(--u));
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 0 #0000;
  -webkit-tap-highlight-color: transparent;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.about .pill--education { width: calc(var(--pw1) * var(--u)); }
.about .pill--skills    { width: calc(var(--pw2) * var(--u)); }
.about .pill--works     { width: calc(var(--pw3) * var(--u)); }

/* hover: blue + small shadow  (navbar: hover:bg-neutral-100 hover:shadow-sm) */
@media (hover: hover) {
  .about .pill:hover {
    background: #1B90F0;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
}

/* pressed: shrink slightly (navbar: whileTap scale 0.94) */
.about .pill:active {
  transform: scale(0.94);
}

/* clicked: primary blue, white text, shadow (navbar: bg-primary text-white shadow-md) */
.about .pill.is-active,
.about .pill.is-active:hover,
.about .pill:active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.about .pill:focus-visible { outline: calc(3 * var(--u)) solid var(--periwinkle); outline-offset: calc(5 * var(--u)); }

/* touch / small screens: no sticky blue after a tap, only the quick press flash */
@media (hover: hover) {
  .about .pill:hover {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
}
  
/*  bottom-right stars  */
.bigstar   { --x: 1968; --y: 1275; --w: 218; --h: 217; display: block; object-fit: contain; }
.smallstar { --x: 1985; --y: 1430; --w: 45;  --h: 45;  display: block; }

/* MOBILE (720-wide frame) */
@media (max-width: 800px) {
  .about {
    --u: calc(100cqw / 720);
    aspect-ratio: 720 / 1604;
  }

  .guide { --t: 1.3; --dl: 6; --dg: 4; }
  .guide--1 { --x: 0;   --y: 467; --w: 155; }
  .guide--2 { --x: 156; --y: 536; --h: 62; }
  .guide--3 { --x: 0;   --y: 717; --w: 119; }
  .guide--4 { --x: 380; --y: 465; --h: 133; }
  .guide--5 { --x: 602; --y: 716; --h: 54; }
  .guide--6 { --x: 444; --y: 822; --w: 60; }
  .guide--7 { display: none; }

  .xh--tr   { --x: 618; --y: 24;  --l: 41; --r: 42; --t: 24; --b: 41; --g: 13; --th: 3.5; }
  .xh--left { --x: 35;  --y: 594; --l: 35; --r: 47; --t: 46; --b: 46; --g: 14; --th: 3.5; }
  .xh--dot  { display: none; }
  .xh--s1   { --x: 604; --y: 823;  --l: 17; --r: 17; --t: 17; --b: 17; --g: 5; --th: 1.5; }
  .xh--s2   { --x: 154; --y: 1298; --l: 11; --r: 11; --t: 11; --b: 11; --g: 4; --th: 1.2; }

  .photo--1 { --x: 150; --y: 397; --w: 163; --h: 144; }
  .photo--2 { --x: 114; --y: 594; --w: 335; --h: 332; }
  .photo--3 { --x: 496; --y: 536; --w: 211; --h: 185; }

  .hlbox { --hs: 7; --hb: 1.2; --fb: 1.3; --lt: 1.3; }
  .hlbox--a { --x: 55;  --y: 246; --w: 288; --h: 89; }
  .hlbox--b { --x: 463; --y: 284; --w: 202; --h: 96; }
  .hlbox .ln--d { background: repeating-linear-gradient(90deg, var(--ink) 0 calc(5 * var(--u)), transparent 0 calc(8 * var(--u))); }
  .hlbox .caret { width: calc(1 * var(--u)); }

  .w--let   { --x: 73;  --by: 289; --fs: 48; }
  .w--your  { --x: 73;  --by: 334; --fs: 48; }
  .w--ideas { --x: 208; --by: 360; --fs: 73; }
  .w--to    { --x: 402; --by: 360; --fs: 40; }
  .w--life  { --x: 473; --by: 360; --fs: 90; }

  .eyebrow { --x: 220; --y: 202; --w: 280; --fs: 27; }

  .bio {
    --x: 30; --y: 971; --w: 660;
    font-size: calc(21 * var(--u));
    line-height: calc(34 * var(--u));
    text-align: center;
  }
  .bio__d { display: none; }
  .bio__m { display: block; }
  .rule {
    --x: 165; --y: 1297; --w: 392;
    height: calc(1.2 * var(--u));
    background: repeating-linear-gradient(90deg, var(--ink) 0 calc(5 * var(--u)), transparent 0 calc(8 * var(--u)));
  }

  .about .pills {
    --x: 47; --y: 1365;
    --pgap: 48; --ph: 55; --pfs: 34; --pb: 1.2;
    --pw1: 210; --pw2: 138; --pw3: 161;
  }
  .about .pill:focus-visible { outline-width: calc(2 * var(--u)); outline-offset: calc(3 * var(--u)); }

  .bigstar, .smallstar { display: none; }
}
`

type PillKey = 'education' | 'skills' | 'works'
type Pt = readonly [number, number]

interface AbtmeMainProps {
  /** Force the entrance on/off (e.g. when your sideways-pan panel is in view). Omit to auto-trigger on scroll. */
  active?: boolean
  /** Side the page pans in from. */
  from?: 'right' | 'left'
  /** Called when Education / Skills / Works is clicked. */
  onSelect?: (key: PillKey) => void
}

const PILLS: { key: PillKey; label: string }[] = [
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'works', label: 'Works' },
]

// Line breaks copied from the Figma frames
const BIO_DESKTOP = [
  'Hi! I’m Charlotte De Vera, a junior Information Technology student at',
  'PUP Sta. Mesa. As a junior designer and developer, I love bringing',
  'ideas to life through Figma and Adobe Illustrator. In my free time, I',
  'create graphic posters and practice art, and I’m an active member',
  'of several university organizations, mostly serving as a junior',
  'designer. I’m currently honing my graphic design and UI/UX skills.',
  'Designing has always been a part of me, and I’m excited to keep',
  'growing through every project!',
]

const BIO_MOBILE = [
  'Hi! I’m Charlotte De Vera, a junior Information Technology',
  'student at PUP Sta. Mesa. As a junior designer and',
  'developer, I love bringing ideas to life through Figma and',
  'Adobe Illustrator. In my free time, I create graphic posters',
  'and practice art, and I’m an active member of several',
  'university organizations, mostly serving as a junior',
  'designer. I’m currently honing my graphic design and UI/',
  'UX skills. Designing has always been a part of me, and I’m',
  'excited to keep growing through every project!',
]

// Selection-handle positions as fractions of the frame (Figma look)
const BOX_A: Pt[] = [[0, 0], [0.5, 0], [1, 0], [1, 0.507], [0, 0.507], [0, 1]]
const BOX_B: Pt[] = [[0, 0], [1, 0], [0, 1], [1, 1]]

const SPARK = 'M12 0C12.9 7.2 16.8 11.1 24 12C16.8 12.9 12.9 16.8 12 24C11.1 16.8 7.2 12.9 0 12C7.2 11.1 11.1 7.2 12 0Z'
const STAR = 'M50 0C53 30 70 47 100 50C70 53 53 70 50 100C47 70 30 53 0 50C30 47 47 30 50 0Z'

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen] as const
}

function Handles({ points }: { points: ReadonlyArray<Pt> }) {
  return (
    <>
      {points.map(([x, y], i) => (
        <i key={i} className="h" style={{ '--hx': x, '--hy': y } as CSSProperties} />
      ))}
    </>
  )
}

function Spark({ size }: { size: number }) {
  return (
    <svg className="spark" viewBox="0 0 24 24" style={{ width: `${size}em`, height: `${size}em` }} aria-hidden="true">
      <path d={SPARK} fill="currentColor" />
    </svg>
  )
}

function Crosshair({ name }: { name: string }) {
  return (
    <span className={`a xh xh--${name} pan pan--bg`} aria-hidden="true">
      <i className="xh__l" />
      <i className="xh__r" />
      <i className="xh__t" />
      <i className="xh__b" />
    </span>
  )
}

export default function AbtmeMain({ active, from = 'right', onSelect }: AbtmeMainProps) {
  const [ref, seen] = useInView<HTMLElement>(0.2)
  const [picked, setPicked] = useState<PillKey | null>(null)
  const isIn = active ?? seen

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPicked(null)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return (
    <>
      <style>{CSS}</style>
      <section
        id="about"
        ref={ref}
        className={`about about--from-${from}${isIn ? ' is-in' : ''}`}
        aria-labelledby="about-title"
      >
        {/* Figma smart-guides */}
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <i key={n} className={`a guide guide--${n} pan pan--bg`} aria-hidden="true" />
        ))}

        {/* Crosshairs */}
        <Crosshair name="tr" />
        <Crosshair name="left" />
        <Crosshair name="dot" />
        <Crosshair name="s1" />
        <Crosshair name="s2" />

        {/* Photos: 1 = top, 2 = centre, 3 = winking (select boxes come from the SVGs) */}
        {[
          { n: 1, src: prof3, alt: 'Portrait of Charlotte looking at the camera' },
          { n: 2, src: prof2, alt: 'Charlotte in round glasses and a white cardigan, resting her chin on her hand' },
          { n: 3, src: prof1, alt: 'Close-up of Charlotte winking in glasses' },
        ].map(({ n, src, alt }) => (
          <figure key={n} className={`a s photo photo--${n} pan pan--photo`}>
            <img src={src} alt={alt} />
          </figure>
        ))}

        {/* Headline selection boxes */}
        <div className="a s hlbox hlbox--a pan pan--hl" aria-hidden="true">
          <i className="ln ln--t" />
          <i className="ln ln--l" />
          <i className="ln ln--r" />
          <i className="ln ln--d" />
          <Handles points={BOX_A} />
        </div>
        <div className="a s hlbox hlbox--b pan pan--hl" aria-hidden="true">
          <i className="caret" />
          <Handles points={BOX_B} />
        </div>

        {/* Eyebrow */}
        <p className="a sw eyebrow pan pan--copy">
          <span className="stars" aria-hidden="true">
            <Spark size={0.27} />
            <Spark size={0.64} />
            <Spark size={0.86} />
          </span>
          <span>ABOUT ME</span>
          <span className="stars" aria-hidden="true">
            <Spark size={0.86} />
            <Spark size={0.64} />
            <Spark size={0.27} />
          </span>
        </p>

        {/* Headline */}
        <h1 id="about-title" className="hl">
          <span className="w w--let pan pan--hl">{"LET'S BRING"}</span>
          <span className="w w--your pan pan--hl">YOUR</span>
          <span className="w w--ideas pan pan--hl">IDEAS</span>
          <span className="w w--to pan pan--hl">TO</span>
          <span className="w w--life pan pan--hl">LIFE</span>
        </h1>

        {/* Bio: fixed line breaks per layout (only one version is shown at a time) */}
        <p className="a sw bio pan pan--copy">
          <span className="bio__d">
            {BIO_DESKTOP.map((line) => (
              <span key={line} className="ln">{line}</span>
            ))}
          </span>
          <span className="bio__m">
            {BIO_MOBILE.map((line) => (
              <span key={line} className="ln">{line}</span>
            ))}
          </span>
        </p>

        <i className="a rule pan pan--copy" aria-hidden="true" />

        {/* Buttons */}
        <div className="a pills pan pan--copy" role="group" aria-label="More about me">
          {PILLS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`pill pill--${key}${picked === key ? ' is-active' : ''}`}
              onClick={() => {
                setPicked(key)
                onSelect?.(key)
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bottom-right stars (desktop only) */}
        <img className="a s bigstar pan pan--bg" src={star8} alt="" aria-hidden="true" />
        <svg className="a s smallstar pan pan--bg" viewBox="-2 -2 104 104" aria-hidden="true">
          <path d={STAR} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="2" />
        </svg>
      </section>
    </>
  )
}