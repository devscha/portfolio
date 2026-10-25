import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { House, User, PenTool, MessageCircle, ChevronDown } from "lucide-react";

type NavId = "home" | "about" | "works" | "contacts";

const worksLinks = [
  { label: "Graphic Works", target: "graphic-works" },
  { label: "UI/UX Works", target: "uiux-works" },
];

// Page id -> which nav button it belongs to
const sectionToNav: Record<string, NavId> = {
  home: "home",
  about: "about",
  "about-details": "about",
  works: "works",
  "graphic-works": "works",
  "uiux-works": "works",
  contacts: "contacts",
};

const item =
  "relative flex h-11 items-center justify-center gap-1 rounded-xl px-3 outline-none transition-all duration-200 sm:h-12 sm:px-4";

// Name label shown above a button on hover (or keyboard focus)
function Tip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 font-sans text-xs font-medium text-white opacity-0 shadow-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
      {label}
    </span>
  );
}

export default function Navbar() {
  const [active, setActive] = useState<NavId>("home");

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handle = (id: NavId) => {
    setActive(id);
    scrollTo(id);
  };

  // Highlight the button for the page currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(sectionToNav[e.target.id]);
        });
      },
      { threshold: 0.5 }
    );
    Object.keys(sectionToNav).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const style = (id: NavId) =>
    active === id
      ? "bg-primary text-white shadow-md"
      : "text-black hover:bg-neutral-100 hover:shadow-sm";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center sm:bottom-6">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        className="pointer-events-auto relative flex w-[min(90vw,26rem)] items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-lg shadow-black/10"
        aria-label="Main navigation"
      >
        {/* Home */}
        <div className="group relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            className={`${item} ${style("home")}`}
            onClick={() => handle("home")}
            aria-label="Home"
          >
            <House strokeWidth={1.5} className="size-6" />
          </motion.button>
          <Tip label="Home" />
        </div>

        {/* About */}
        <div className="group relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            className={`${item} ${style("about")}`}
            onClick={() => handle("about")}
            aria-label="About me"
          >
            <User strokeWidth={1.5} className="size-6" />
          </motion.button>
          <Tip label="About Me" />
        </div>

        {/* Works: click goes to the collection of works menu (desktop and mobile).
            Hover (desktop only) shows quick links, centered over the whole bar.
            Note: this wrapper has no "relative", so the menu positions against the nav. */}
        <div className="group">
          <motion.button
            whileTap={{ scale: 0.94 }}
            className={`${item} ${style("works")}`}
            onClick={() => handle("works")}
            aria-label="Collection of works"
          >
            <PenTool strokeWidth={1.5} className="size-6" />
            <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180" />
          </motion.button>

          <div className="pointer-events-none absolute bottom-[calc(100%-0.625rem)] left-1/2 hidden w-48 -translate-x-1/2 translate-y-1 pb-6 opacity-0 transition-all duration-200 md:block md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
            <div className="rounded-2xl bg-white p-2 shadow-lg shadow-black/10">
              {worksLinks.map((l) => (
                <button
                  key={l.target}
                  onClick={() => {
                    setActive("works");
                    scrollTo(l.target);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left font-sans text-sm transition-colors hover:bg-neutral-100"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="group relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            className={`${item} ${style("contacts")}`}
            onClick={() => handle("contacts")}
            aria-label="Contacts"
          >
            <MessageCircle strokeWidth={1.5} className="size-6" />
          </motion.button>
          <Tip label="Contacts" />
        </div>
      </motion.nav>
    </div>
  );
}