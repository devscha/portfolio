import { useEffect, useRef, useState, type CSSProperties } from 'react'

import star8 from '../assets/elements/Star 8.svg'

const CSS = `
.det {
  --ink: #000;
  --sky: #ABD2FB;
  --blue: #1B90F0;
  --periwinkle: #7692FF;

  /* match your @font-face names in index.css */
  --font-head: 'Seafont', serif;
  --font-sub: 'Gallient', serif;
  --font-body: 'Google Sans', system-ui, sans-serif;

  --u: calc(100cqw / 2294);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --exit: -1; /* -1 = exits to the left, 1 = exits to the right */
  --o: 0; /* mobile only: how far down the Skills frame sits */

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
.det--exit-right { --exit: 1; }
.det .d-anchor { position: absolute; left: 0; width: 1px; height: 1px; visibility: hidden; pointer-events: none; top: calc((130 + var(--o)) * var(--u)); }
.det *, .det *::before, .det *::after { box-sizing: border-box; }
.det h2, .det p, .det ul, .det li { margin: 0; padding: 0; }
.det ul { list-style: none; }

/*  motion: rises from below on entry, pans sideways on exit  */
.det .d-pan {
  --d: 0s; --rise: 14vh; --pan: 22;
  transition: translate 1.2s var(--ease) var(--d), opacity 0.7s ease var(--d);
  will-change: translate, opacity;
}
.det[data-state='below'] .d-pan { translate: 0 var(--rise); opacity: 0; }
.det[data-state='in']    .d-pan { translate: 0 0; opacity: 1; }
.det[data-state='past']  .d-pan { translate: calc(var(--exit) * var(--pan) * 1vw) 0; opacity: 0; }
.d-pan--bg    { --rise: 8vh;  --pan: 12; --d: 0s; }
.d-pan--panel { --rise: 18vh; --pan: 30; --d: 0.12s; }
.d-pan--copy  { --rise: 12vh; --pan: 24; --d: 0.3s; }
@media (prefers-reduced-motion: reduce) {
  .det .d-pan { transition: none; translate: 0 0 !important; opacity: 1 !important; }
}

/*  decor placement: desktop = --d*, mobile Education = --e*, mobile Skills = --s*  */
.det .d-at {
  --x: var(--dx); --y: var(--dy); --w: var(--dw);
  position: absolute; display: none;
  left: calc(var(--x) * var(--u));
  top: calc(var(--y) * var(--u));
}
@media (min-width: 801px) { .det .d-at.on-d { display: block; } }

.det .d-line { --t: 2; --dl: 9; --dg: 7; }
.det .d-line--h {
  width: calc(var(--w) * var(--u)); height: calc(var(--t) * var(--u));
  background: repeating-linear-gradient(90deg, rgba(0,0,0,.75) 0 calc(var(--dl) * var(--u)), transparent 0 calc((var(--dl) + var(--dg)) * var(--u)));
}
.det .d-line--v {
  width: calc(var(--t) * var(--u)); height: calc(var(--w) * var(--u));
  background: repeating-linear-gradient(180deg, rgba(0,0,0,.75) 0 calc(var(--dl) * var(--u)), transparent 0 calc((var(--dl) + var(--dg)) * var(--u)));
}
.det .d-cross, .det .d-bstar, .det .d-kstar { width: calc(var(--w) * var(--u)); height: calc(var(--w) * var(--u)); color: var(--ink); }
.det .d-cross svg, .det .d-kstar svg { display: block; width: 100%; height: 100%; }
.det .d-bstar img { display: block; width: 100%; height: 100%; object-fit: contain; }

/*  eyebrow  */
.det .d-eyebrow {
  position: absolute; left: calc(990 * var(--u)); top: calc(188 * var(--u)); width: calc(460 * var(--u));
  transform: translateY(-50%);
  display: flex; align-items: center; justify-content: center; gap: 0.5em;
  font-family: var(--font-sub); font-size: calc(44 * var(--u)); line-height: 1; white-space: nowrap;
}
.det .d-stars { display: inline-flex; align-items: center; gap: 0.18em; }
.det .d-spark { display: block; flex: none; }

/*  panels (inner sizes use --u2 = --u x --k so each panel scales as in the mobile frames)  */
.det .d-panel {
  --k: 1; --u2: calc(var(--u) * var(--k));
  --bw: 2.4; --hs: 14; --hb: 2;
  position: absolute;
  left: calc(var(--px) * var(--u)); top: calc(var(--py) * var(--u));
  width: calc(var(--pw) * var(--u)); height: calc(var(--ph) * var(--u));
}
.det .d-panel::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  border: calc(var(--bw) * var(--u)) solid var(--ink);
}
.det .d-panel--edu { --px: 211;  --py: 302; --pw: 932; --ph: 846; }
.det .d-panel--skl { --px: 1331; --py: 300; --pw: 762; --ph: 846; }

.det .d-hd {
  position: absolute; z-index: 2;
  width: calc(var(--hs) * var(--u)); height: calc(var(--hs) * var(--u));
  background: #fff; border: calc(var(--hb) * var(--u)) solid var(--ink);
  transform: translate(-50%, -50%);
}
.det .d-hd--tl { left: 0; top: 0; }
.det .d-hd--tr { left: 100%; top: 0; border-radius: 50%; }
.det .d-hd--bl { left: 0; top: 100%; border-radius: 50%; }
.det .d-hd--br { left: 100%; top: 100%; }

.det .d-head {
  position: absolute;
  left: calc(var(--hx) * var(--u2)); top: calc(var(--hy) * var(--u2));
  transform: translateY(-0.86em); /* top = baseline */
  font-family: var(--font-head); font-weight: 400;
  font-size: calc(var(--fs, 100) * var(--u2)); line-height: 1; white-space: nowrap;
}
.det .d-mk { position: absolute; width: calc(44 * var(--u2)); height: calc(44 * var(--u2));
  left: calc((var(--cx) - 22) * var(--u2)); top: calc((var(--cy) - 22) * var(--u2)); color: var(--ink); }
.det .d-mk svg { display: block; width: 100%; height: 100%; }
.det .d-spine {
  position: absolute; width: calc(2 * var(--u2));
  left: calc((var(--cx) - 1) * var(--u2)); top: calc(var(--cy) * var(--u2)); height: calc(var(--len) * var(--u2));
  background: repeating-linear-gradient(180deg, rgba(0,0,0,.7) 0 calc(8 * var(--u2)), transparent 0 calc(15 * var(--u2)));
}
.det .d-sq, .det .d-edu li::before, .det .d-chips li::before {
  content: ''; position: absolute; z-index: 1;
  width: calc(20 * var(--u2)); height: calc(20 * var(--u2));
  background: #fff; border: calc(1.6 * var(--u2)) solid #555;
}
.det .d-sq { left: calc((var(--cx) - 10) * var(--u2)); top: calc((var(--cy) - 10) * var(--u2)); }

/* education */
.det .d-edu { position: absolute; left: calc(107 * var(--u2)); top: calc(225 * var(--u2)); width: calc(800 * var(--u2)); }
.det .d-edu li { position: relative; }
.det .d-edu li + li { margin-top: calc(74 * var(--u2)); }
.det .d-edu li::before { left: calc(-53 * var(--u2)); top: calc(20 * var(--u2)); }
.det .d-school { font-family: var(--font-sub); font-size: calc(52 * var(--u2)); line-height: calc(61 * var(--u2)); font-weight: 400; }
.det .d-level { margin-top: calc(8 * var(--u2)); font-style: italic; font-size: calc(34 * var(--u2)); line-height: calc(34 * var(--u2)); }
.det .d-detail { margin-top: calc(14 * var(--u2)); font-size: calc(34 * var(--u2)); line-height: calc(32 * var(--u2)); }
.det .d-nb { white-space: nowrap; }

/* skillset + softwares */
.det .d-chips { position: absolute; left: calc(122 * var(--u2)); top: calc(195 * var(--u2)); display: flex; flex-direction: column; align-items: flex-start; gap: calc(20 * var(--u2)); }
.det .d-chips li { position: relative; }
.det .d-chips li::before { left: calc(-51 * var(--u2)); top: calc(27 * var(--u2)); }
.det .d-tiles { position: absolute; left: calc(111 * var(--u2)); top: calc(625 * var(--u2)); display: flex; gap: calc(28 * var(--u2)); }

.det .d-chip, .det .d-tile {
  display: flex; align-items: center; justify-content: center;
  border: calc(1.6 * var(--u2)) solid var(--ink); border-radius: calc(24 * var(--u2));
  background: #fff;
  transition: transform 220ms var(--ease), background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}
.det .d-chip { height: calc(74 * var(--u2)); padding: 0 calc(18 * var(--u2)); font-size: calc(40 * var(--u2)); line-height: 1; white-space: nowrap; }
.det .d-tile { position: relative; width: calc(161 * var(--u2)); height: calc(148 * var(--u2)); }
.det .d-tile svg { display: block; width: calc(78 * var(--u2)); height: calc(117 * var(--u2)); }
.det .d-tile b { font-family: var(--font-body); font-weight: 700; font-size: calc(80 * var(--u2)); line-height: 1; letter-spacing: -0.01em; }
.det .d-tile > * { transition: transform 220ms var(--ease); }

/* software name label, revealed under the tile on hover / focus / tap */
.det .d-name {
  position: absolute; top: 100%; left: 50%;
  margin-top: calc(14 * var(--u2));
  transform: translate(-50%, calc(-6 * var(--u2)));
  font-size: calc(30 * var(--u2)); line-height: 1; white-space: nowrap;
  opacity: 0; pointer-events: none;
  transition: opacity 220ms ease, transform 220ms var(--ease);
}
.det .d-tile:focus-visible { outline: calc(3 * var(--u2)) solid var(--periwinkle); outline-offset: calc(4 * var(--u2)); }
.det .d-tile:focus-visible .d-name { opacity: 1; transform: translate(-50%, 0); }

/* simple hover: lift, blue outline, light sky fill */
@media (hover: hover) {
  .det .d-chip:hover, .det .d-tile:hover {
    transform: translateY(calc(-6 * var(--u2)));
    background: rgba(171, 210, 251, 0.45);
    border-color: var(--blue);
    box-shadow: 0 calc(10 * var(--u2)) calc(22 * var(--u2)) calc(-8 * var(--u2)) rgba(27, 144, 240, 0.4);
  }
  .det .d-tile:hover > :not(.d-name) { transform: scale(1.08); }
  .det .d-tile:hover .d-name { opacity: 1; transform: translate(-50%, 0); }
}

/*  MOBILE: Education and Skills stacked in one tall frame  */
@media (max-width: 800px) {
  .det { --u: calc(100cqw / 720); --o: 1200; aspect-ratio: 720 / 2720; }
  .det .d-line { --t: 1.3; --dl: 5; --dg: 4; }

  /* Education decor keeps its frame position, Skills decor is pushed down by --o */
  .det .d-at.on-e { --x: var(--ex); --y: var(--ey); --w: var(--ew); display: block; }
  .det .d-at.on-s { --x: var(--sx); --y: calc(var(--sy) + var(--o)); --w: var(--sw); display: block; }

  .det .d-eyebrow { left: calc(220 * var(--u)); top: calc(202 * var(--u)); width: calc(280 * var(--u)); font-size: calc(27 * var(--u)); }

  .det .d-panel { --bw: 1.5; --hs: 9; --hb: 1.3; }
  .det .d-panel--edu { --px: 72; --py: 401; --pw: 587; --ph: 533; --k: 0.629; }
  .det .d-panel--skl { --px: 72; --py: calc(387 + var(--o)); --pw: 555; --ph: 616; --k: 0.725; }

  .det .d-chip:active, .det .d-tile:active { background: rgba(171, 210, 251, 0.45); border-color: var(--blue); }
  .det .d-tile:active .d-name { opacity: 1; transform: translate(-50%, 0); }
}
`

type Phase = 'below' | 'in' | 'past'
type Spot = readonly [number, number, number]
type Place = { d?: Spot; e?: Spot; s?: Spot }
type Vars = Record<`--${string}`, number>

interface AbtmeDeetsProps {
  /** Side the page pans out to. Keep it opposite to the About Me pan (which comes in from the right). */
  exitTo?: 'left' | 'right'
}

const SPARK = 'M12 0C12.9 7.2 16.8 11.1 24 12C16.8 12.9 12.9 16.8 12 24C11.1 16.8 7.2 12.9 0 12C7.2 11.1 11.1 7.2 12 0Z'
const BLACK_STAR = 'M50 0C51.5 36 64 48.5 100 50C64 51.5 51.5 64 50 100C48.5 64 36 51.5 0 50C36 48.5 48.5 36 50 0Z'

// [x, y, size]. c() turns a centre point into a top-left spot.
const c = (x: number, y: number, s: number): Spot => [x - s / 2, y - s / 2, s]

// d = desktop frame, e = mobile Education frame, s = mobile Skills frame
const LINES: (Place & { t: 'h' | 'v' })[] = [
  { t: 'h', d: [30, 301, 181], e: [0, 401, 72] },
  { t: 'v', d: [521, 55, 245], e: [268, 245, 150] },
  { t: 'h', d: [1143, 784, 79], e: [659, 704, 50] },
  { t: 'v', d: [285, 1148, 285], e: [119, 935, 178] },
  { t: 'v', d: [905, 1148, 212], e: [509, 935, 153] },
  { t: 'h', d: [1945, 193, 300], s: [518, 309, 202] },
  { t: 'v', d: [2093, 45, 255], s: [626, 203, 180] },
  { t: 'v', d: [1563, 250, 50], s: [240, 350, 37] },
  { t: 'h', d: [2093, 411, 170], s: [627, 468, 93] },
  { t: 'h', d: [2093, 887, 80], s: [627, 814, 58] },
  { t: 'v', d: [2040, 1148, 160], s: [588, 1003, 115] },
]
const CROSSES: (Place & { dot?: boolean })[] = [
  { dot: true, d: c(169, 170, 46), e: c(53, 248, 62) },
  { d: c(2220, 347, 46), s: c(67, 326, 34) },
  { dot: true, d: c(2115, 1307, 46), s: c(175, 1098, 40) },
  { d: c(103, 1360, 46), e: c(33, 1179, 32) },
  { s: c(602, 1151, 32) },
]
const BLACK_STARS: Place[] = [{ d: c(2093, 190, 200), s: c(626, 310, 150) }]
// The blue star appears once in the Education frame and once in the Skills frame on mobile
const BLUE_STARS: Place[] = [
  { d: [82, 1328, 218], e: [18, 1158, 142] },
  { s: [590, 1128, 140] },
]

const EDUCATION = [
  { school: 'Gardner College Diliman', years: '(2020-2023)', level: 'Senior High School', detail: 'Arts and Design (SHS Track) / Graduated with Honors' },
  { school: 'Polytechnic University of the Philippines', years: '(2024-present)', level: 'Tertiary', detail: 'Bachelor of Science in Information Technology', detailYears: '(2024-2028)' },
]
const SKILLS = ['Graphic Design', 'Web Design', 'Basic Programming']

function place({ d, e, s }: Place) {
  const style: Record<string, number | undefined> = {
    '--dx': d?.[0], '--dy': d?.[1], '--dw': d?.[2],
    '--ex': e?.[0], '--ey': e?.[1], '--ew': e?.[2],
    '--sx': s?.[0], '--sy': s?.[1], '--sw': s?.[2],
  }
  return {
    className: `d-at${d ? ' on-d' : ''}${e ? ' on-e' : ''}${s ? ' on-s' : ''}`,
    style: style as CSSProperties,
  }
}

const v = (o: Vars) => o as unknown as CSSProperties

function usePhase<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [phase, setPhase] = useState<Phase>('below')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) setPhase('in')
        else setPhase(entry.boundingClientRect.top > 0 ? 'below' : 'past')
      },
      { threshold: [0, threshold] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, phase] as const
}

function Spark({ size }: { size: number }) {
  return (
    <svg className="d-spark" viewBox="0 0 24 24" style={{ width: `${size}em`, height: `${size}em` }} aria-hidden="true">
      <path d={SPARK} fill="currentColor" />
    </svg>
  )
}

function Cross({ dot }: { dot?: boolean }) {
  return (
    <svg viewBox="-20 -20 40 40" aria-hidden="true">
      <path d={dot ? 'M-19 0H19M0-19V19' : 'M-18 0H-4M4 0H18M0-18V-4M0 4V18'} stroke="currentColor" strokeWidth={dot ? 2.6 : 1.6} fill="none" />
      {dot && <circle r="6" fill="currentColor" />}
    </svg>
  )
}

function Handles() {
  return (
    <>
      <i className="d-hd d-hd--tl" />
      <i className="d-hd d-hd--tr" />
      <i className="d-hd d-hd--bl" />
      <i className="d-hd d-hd--br" />
    </>
  )
}

// Official Figma logo geometry
function FigmaLogo() {
  return (
    <svg viewBox="0 0 38 57" aria-hidden="true">
      <path d="M19 0H9.5a9.5 9.5 0 0 0 0 19H19z" fill="#F24E1E" />
      <path d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19z" fill="#FF7262" />
      <path d="M19 19H9.5a9.5 9.5 0 0 0 0 19H19z" fill="#A259FF" />
      <circle cx="28.5" cy="28.5" r="9.5" fill="#1ABCFE" />
      <path d="M9.5 38H19v9.5A9.5 9.5 0 1 1 9.5 38z" fill="#0ACF83" />
    </svg>
  )
}

export default function AbtmeDeets({ exitTo = 'left' }: AbtmeDeetsProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 800px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 800px)')
    const on = () => setIsMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // The mobile section is much taller, so it needs a lower visibility threshold
  // or the Skills panel would pan away while it's still on screen
  const [ref, phase] = usePhase<HTMLElement>(isMobile ? 0.12 : 0.3)

  return (
    <>
      <style>{CSS}</style>
      <section
        id="about-details"
        ref={ref}
        className={`det det--exit-${exitTo}`}
        data-state={phase}
        aria-label="About me: education, skills and software"
      >
        {/* Scroll target for the Skills button on mobile */}
        <i id="about-skills" className="d-anchor" aria-hidden="true" />

        {LINES.map(({ t, ...p }, i) => {
          const { className, style } = place(p)
          return <i key={i} className={`${className} d-line d-line--${t} d-pan d-pan--bg`} style={style} aria-hidden="true" />
        })}

        {CROSSES.map(({ dot, ...p }, i) => {
          const { className, style } = place(p)
          return (
            <span key={i} className={`${className} d-cross d-pan d-pan--bg`} style={style} aria-hidden="true">
              <Cross dot={dot} />
            </span>
          )
        })}

        {BLACK_STARS.map((p, i) => {
          const { className, style } = place(p)
          return (
            <span key={i} className={`${className} d-kstar d-pan d-pan--bg`} style={style} aria-hidden="true">
              <svg viewBox="0 0 100 100"><path d={BLACK_STAR} fill="#000" /></svg>
            </span>
          )
        })}

        {BLUE_STARS.map((p, i) => {
          const { className, style } = place(p)
          return (
            <span key={i} className={`${className} d-bstar d-pan d-pan--bg`} style={style} aria-hidden="true">
              <img src={star8} alt="" />
            </span>
          )
        })}

        {/* Education */}
        <div className="d-panel d-panel--edu d-pan d-pan--panel">
          <Handles />
          <i className="d-spine" style={v({ '--cx': 64, '--cy': 138, '--len': 565 })} aria-hidden="true" />
          <span className="d-mk" style={v({ '--cx': 64, '--cy': 138 })} aria-hidden="true"><Cross /></span>
          <h2 className="d-head" style={v({ '--hx': 107, '--hy': 175 })}>EDUCATION</h2>
          <ul className="d-edu">
            {EDUCATION.map((e) => (
              <li key={e.school}>
                <p className="d-school">{e.school} <span className="d-nb">{e.years}</span></p>
                <p className="d-level">{e.level}</p>
                <p className="d-detail">
                  {e.detail}
                  {e.detailYears && <> <span className="d-nb">{e.detailYears}</span></>}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Skillset + Softwares */}
        <div className="d-panel d-panel--skl d-pan d-pan--panel">
          <Handles />
          <i className="d-spine" style={v({ '--cx': 82, '--cy': 110, '--len': 607 })} aria-hidden="true" />
          <span className="d-mk" style={v({ '--cx': 82, '--cy': 110 })} aria-hidden="true"><Cross /></span>
          <h2 className="d-head" style={v({ '--hx': 120, '--hy': 145 })}>SKILLSET</h2>
          <ul className="d-chips">
            {SKILLS.map((s) => (
              <li key={s}><span className="d-chip">{s}</span></li>
            ))}
          </ul>

          <span className="d-mk" style={v({ '--cx': 82, '--cy': 570 })} aria-hidden="true"><Cross /></span>
          <h2 className="d-head" style={v({ '--hx': 110, '--hy': 598 })}>SOFTWARES</h2>
          <ul className="d-tiles" aria-label="Software I use">
            <li className="d-tile" tabIndex={0}><FigmaLogo /><span className="d-name">Figma</span></li>
            <li className="d-tile" tabIndex={0}><b aria-hidden="true">Ai</b><span className="d-name">Adobe Illustrator</span></li>
            <li className="d-tile" tabIndex={0}><b aria-hidden="true">Ps</b><span className="d-name">Adobe Photoshop</span></li>
          </ul>
          <i className="d-sq" style={v({ '--cx': 82, '--cy': 717 })} aria-hidden="true" />
        </div>

        {/* Eyebrow */}
        <p className="d-eyebrow d-pan d-pan--copy">
          <span className="d-stars" aria-hidden="true">
            <Spark size={0.27} />
            <Spark size={0.64} />
            <Spark size={0.86} />
          </span>
          <span>ABOUT ME</span>
          <span className="d-stars" aria-hidden="true">
            <Spark size={0.86} />
            <Spark size={0.64} />
            <Spark size={0.27} />
          </span>
        </p>
      </section>
    </>
  )
}