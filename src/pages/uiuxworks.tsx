import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

/*website preview*/
const SWMD_URL = "https://nswmc-website-redesign-wpa5.vercel.app/?fbclid=IwY2xjawVK2GBleHRuA2FlbQIxMQBwZG9mA3NydGMGYXBwX2lkATAAAR7E-1DPkKAKN2O31QZiFp3tedv0iAci2d-2ht5naI0CxMSt6-PerlD_in0MUA_aem_u36T9Py97s4OaUofz4WTRA"; 
/** Width the site is rendered at before being scaled to fit the box. */
const SWMD_VIEWPORT_WIDTH = 1280;

/** PhilHealth screens, in carousel order. The first value is the SVG file name (no extension). */
const PHILHEALTH_SLIDES: [file: string, alt: string][] = [
  ["LOGIN PAGE [loading]", "PhilHealth app: loading screen"],
  ["LOGIN PAGE [default]", "PhilHealth app: login page"],
  ["LOGIN PAGE [active]", "PhilHealth app: login page with a focused field"],
  ["MENU", "PhilHealth app: menu"],
  ["DASHBOARD", "PhilHealth app: dashboard"],
  ["PROFILE [2]", "PhilHealth app: profile"],
  ["FINALIZATION", "PhilHealth app: final design"],
  ["FINALIZATION 2", "PhilHealth app: final design, second view"],
];

/** Every SVG in src/assets/uiuxcarouselWorks, resolved to its built URL. */
const svgFiles = import.meta.glob<string>("../assets/uiuxcarouselWorks/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const PHILHEALTH_IMAGES: CarouselImage[] = PHILHEALTH_SLIDES.map(([file, alt]) => ({
  src: svgFiles[`../assets/uiuxcarouselWorks/${file}.svg`],
  alt,
})).filter((img) => Boolean(img.src));

/*Small pieces*/
/** Four-point concave star. */
const STAR_PATH =
  "M12 0C12.8 7.5 16.5 11.2 24 12C16.5 12.8 12.8 16.5 12 24C11.2 16.5 7.5 12.8 0 12C7.5 11.2 11.2 7.5 12 0Z";

function Spark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d={STAR_PATH} />
    </svg>
  );
}

/** The big blue divider star. */
function DividerStar() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mx-auto block h-[10vw] w-[10vw] md:h-[5.6vw] md:w-[5.6vw]"
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#3A5BE0" />
          <stop offset="55%" stopColor="#1C2BC2" />
          <stop offset="100%" stopColor="#0A1542" />
        </radialGradient>
      </defs>
      <path d={STAR_PATH} fill={`url(#${id})`} />
    </svg>
  );
}

/** Gray rounded box that previews the redesigned SWMD site. */
function SwmdPreview() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = size.w / SWMD_VIEWPORT_WIDTH || 0.3;

  return (
    <div
      ref={boxRef}
      className="relative aspect-[484/568] w-[67%] overflow-hidden rounded-[7.6vw] bg-[#D9D9D9] md:aspect-[600/665] md:w-full md:rounded-[3.1vw]"
    >
      {SWMD_URL && (
        <>
          <iframe
            src={SWMD_URL}
            title="Preview of the SWMD website redesign"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute left-0 top-0 max-w-none border-0 bg-white"
            style={{
              width: SWMD_VIEWPORT_WIDTH,
              height: size.h / scale,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
          <a
            href={SWMD_URL}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 right-3 rounded-full bg-white/90 px-4 py-2 font-['Gallient'] text-xs uppercase text-[#0A1542] shadow-md outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#1B90F0] md:text-sm"
          >
            Open site
          </a>
        </>
      )}
    </div>
  );
}

type CarouselImage = { src: string; alt: string };

/** Auto-scroll speed in px per second (moves to the left). */
const AUTO_SPEED = 40;
/** Pixels the pointer must travel before a press counts as a drag instead of a click. */
const DRAG_THRESHOLD = 6;
/** Number of repeated groups. 3 keeps the loop seamless on very wide screens. */
const COPIES = 3;

/** Wraps an offset into the range [-width, 0) so the loop never runs out of cards. */
const wrap = (value: number, width: number) =>
  width ? ((((value % width) + width) % width) - width) : value;

/*Carousel*/
function PhilhealthCarousel({ images }: { images: CarouselImage[] }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);

  const groupRef = useRef<HTMLDivElement>(null);
  const groupWidth = useRef(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const inertia = useRef(0);

  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;
  const [isDragging, setIsDragging] = useState(false);

  /* Measure one full group of cards; that width is the loop period. */
  useLayoutEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    let initialised = false;

    const measure = () => {
      groupWidth.current = el.offsetWidth;
      if (!groupWidth.current) return;
      if (!initialised) {
        initialised = true;
        // first card sits ~7.5% in from the left edge, like the design
        x.set(wrap(window.innerWidth * 0.075, groupWidth.current));
      } else {
        x.set(wrap(x.get(), groupWidth.current));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [images.length, x]);

  /* Auto-scroll + inertia after a drag is released. */
  useAnimationFrame((_, delta) => {
    const w = groupWidth.current;
    if (!w || dragging.current) return;

    const dt = Math.min(delta, 50) / 1000;
    const paused = reduceMotion || hovering.current || activeRef.current !== null;
    const velocity = (paused ? 0 : -AUTO_SPEED) + inertia.current;

    if (velocity !== 0) x.set(wrap(x.get() + velocity * dt, w));

    inertia.current *= Math.pow(0.02, dt);
    if (Math.abs(inertia.current) < 1) inertia.current = 0;
  });

  /* Drag with mouse, pen or touch. A press that barely moves opens the pop-up. */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const startX = e.clientX;
    const startOffset = x.get();
    let lastX = startX;
    let lastT = performance.now();
    let velocity = 0;
    let moved = false;

    dragging.current = true;
    inertia.current = 0;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        setIsDragging(true);
      }
      if (!moved) return;

      x.set(wrap(startOffset + dx, groupWidth.current));

      const now = performance.now();
      const dt = (now - lastT) / 1000;
      if (dt > 0) velocity = 0.7 * velocity + 0.3 * ((ev.clientX - lastX) / dt);
      lastX = ev.clientX;
      lastT = now;
    };

    const finish = (ev: PointerEvent, cancelled: boolean) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      dragging.current = false;
      setIsDragging(false);

      if (moved) {
        // ignore the throw if the pointer was held still before release
        const idle = performance.now() - lastT > 100;
        inertia.current = idle ? 0 : Math.max(-3000, Math.min(3000, velocity));
        return;
      }
      if (cancelled) return;

      const idx = (ev.target as HTMLElement | null)
        ?.closest<HTMLElement>("[data-idx]")
        ?.getAttribute("data-idx");
      if (idx != null) setActive(Number(idx));
    };
    const onUp = (ev: PointerEvent) => finish(ev, false);
    const onCancel = (ev: PointerEvent) => finish(ev, true);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(i);
    }
  };

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (step: number) =>
      setActive((cur) => (cur === null ? cur : (cur + step + images.length) % images.length)),
    [images.length],
  );

  return (
    <>
      <div
        className={`w-full touch-pan-y select-none overflow-hidden py-6 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hovering.current = true;
        }}
        onPointerLeave={() => {
          hovering.current = false;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <motion.div style={{ x }} className="flex w-max will-change-transform">
          {Array.from({ length: COPIES }, (_, copy) => (
            <div
              key={copy}
              ref={copy === 0 ? groupRef : undefined}
              aria-hidden={copy > 0}
              className="flex shrink-0 gap-[4vw] pr-[4vw] md:gap-[2.2vw] md:pr-[2.2vw]"
            >
              {images.map((img, i) => (
                <div
                  key={img.src}
                  data-idx={i}
                  role="button"
                  tabIndex={copy === 0 ? 0 : -1}
                  aria-label={`Open ${img.alt}`}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="shrink-0 rounded-[1.6rem] outline-none focus-visible:ring-4 focus-visible:ring-[#1B90F0]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    draggable={false}
                    className="pointer-events-none block h-[clamp(240px,64vw,420px)] w-auto md:h-[clamp(340px,34vw,540px)]"
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <Lightbox images={images} index={active} onClose={close} onStep={go} />
    </>
  );
}

/*Pop-up*/
function Lightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: CarouselImage[];
  index: number | null;
  onClose: () => void;
  onStep: (step: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onStep]);

  if (typeof document === "undefined") return null;

  const current = index !== null ? images[index] : null;

  // Portal to <body> so `fixed` positioning is never affected by a transformed parent.
  return createPortal(
    <AnimatePresence>
      {current && index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A1542]/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`${roundBtn} right-4 top-4 md:right-8 md:top-8`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className={`${roundBtn} left-3 top-1/2 -translate-y-1/2 md:left-8`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className={`${roundBtn} right-3 top-1/2 -translate-y-1/2 md:right-8`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={index}
              src={current.src}
              alt={current.alt}
              draggable={false}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80 || info.velocity.x < -500) onStep(1);
                else if (info.offset.x > 80 || info.velocity.x > 500) onStep(-1);
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="max-h-[82vh] max-w-[80vw] cursor-grab select-none object-contain active:cursor-grabbing md:max-w-[88vw]"
            />
          </AnimatePresence>

          <p className="absolute bottom-5 left-0 right-0 text-center font-['Gallient'] text-lg tracking-wide text-white md:bottom-8">
            {index + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const roundBtn =
  "absolute z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0A1542] shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#1B90F0]";

/*Section*/
export default function UiuxWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="uiux-works"
      className="relative min-h-screen overflow-x-hidden pb-[14vw] pt-[10vw] text-black md:pb-[10vw] md:pt-[5.2vw]"
    >
      {/* Content pans upward into view as the section is scrolled to */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { y: 120, opacity: 0 }}
        whileInView={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
        viewport={{ amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Heading */}
        <header className="flex flex-col items-center text-center">
          <p className="flex items-center gap-[1.6vw] font-['Gallient'] text-[4.4vw] leading-none md:gap-[0.8vw] md:text-[2.1vw]">
            <span className="flex items-center gap-[0.5vw] md:gap-[0.25vw]" aria-hidden="true">
              <Spark size={6} />
              <Spark size={11} />
              <Spark size={17} />
            </span>
            WORKS
            <span className="flex items-center gap-[0.5vw] md:gap-[0.25vw]" aria-hidden="true">
              <Spark size={17} />
              <Spark size={11} />
              <Spark size={6} />
            </span>
          </p>

          <h1 className="mt-[4vw] font-['Seafont'] leading-[0.85] md:mt-[2.6vw]">
            <span className="block text-[22vw] md:text-[10.5vw]">UI/UX</span>
            <span className="mt-[1vw] block text-[9.2vw] leading-none md:mt-[0.6vw] md:text-[5vw]">
              DESIGNS
            </span>
          </h1>
        </header>

        <div className="mt-[8vw] md:mt-[3.4vw]">
          <DividerStar />
        </div>

        {/* SWMD redesign */}
        <div className="mx-auto mt-[8vw] flex max-w-[1600px] flex-col items-center px-[8.5%] md:mt-[3.6vw] md:grid md:grid-cols-2 md:items-stretch md:gap-[5%]">
          <div className="flex flex-col items-center gap-[3vw] text-center md:items-start md:justify-between md:gap-0 md:text-left">
            <h2 className="font-['Seafont'] text-[8vw] leading-[0.95] md:text-[7vw] md:leading-[0.9]">
              SWMD RE-DESIGN
            </h2>
            <p className="max-w-[60%] font-['Gallient'] text-[clamp(11px,3.2vw,16px)] uppercase leading-[1.05] md:max-w-none md:text-[2.4vw] md:leading-[1]">
              This was a collaboration project made by me and my block mates for our major course,
              wherein we re-designed and improved the UI/UX interface of SWMD’s (Solid Waste
              Management Department’s) official website.
            </p>
          </div>

          <div className="mt-[8vw] flex w-full justify-center md:mt-0">
            <SwmdPreview />
          </div>
        </div>

        <div className="mt-[9vw] md:mt-[6vw]">
          <DividerStar />
        </div>

        {/* PhilHealth application UI */}
        <div className="mt-[6vw] flex flex-col items-center px-[6%] text-center md:mt-[4vw]">
          <h2 className="font-['Seafont'] text-[7vw] leading-[0.95] md:text-[6vw] md:leading-[0.9]">
            PHILHEALTH
            <br />
            APPLICATION UI
          </h2>
          <p className="mt-[3vw] max-w-[80%] font-['Gallient'] text-[clamp(11px,3.2vw,16px)] uppercase leading-[1.05] md:mt-[2vw] md:max-w-[78vw] md:text-[2.6vw] md:leading-[1]">
            Another collaborative project, wherein I served as the lead designer for the UI of our
            application.
          </p>
        </div>

        <div className="mt-[6vw] md:mt-[3vw]">
          <PhilhealthCarousel images={PHILHEALTH_IMAGES} />
        </div>
      </motion.div>
    </section>
  );
}