import { useEffect } from "react";
import { motion, useAnimate } from "motion/react";

type Props = { onFinish: () => void };

const smooth = [0.65, 0, 0.35, 1] as const;

export default function PreloadingAnimation({ onFinish }: Props) {
  const [scope, animate] = useAnimate();

  /*Lock scrolling while the preloader is visible */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      /* 0 fades in*/
      await animate(".o", { opacity: 1, scale: [0.85, 1] }, { duration: 0.9, ease: "easeOut" });
      if (cancelled) return;

      /* 0 rotates*/
      await animate(".o", { rotate: 360 }, { duration: 1.2, ease: smooth });
      if (cancelled) return;

      /* name pans in from 0*/
      await animate(".side", { width: "auto", opacity: 1 }, { duration: 1.1, ease: smooth });
      if (cancelled) return;

      /* hand off to app*/
      await new Promise((r) => setTimeout(r, 700));
      if (!cancelled) onFinish();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [animate, onFinish]);

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h1
        className="flex items-center font-heading text-black leading-none
                   text-[clamp(2rem,8vw,6.5rem)]"
        aria-label="Charlotte"
      >
        {/* Left part: anchored to the O so it reveals leftwards */}
        <span
          className="side flex justify-end overflow-hidden whitespace-nowrap py-4"
          style={{ width: 0, opacity: 0 }}
        >
          CHARL
        </span>

        {/* The O */}
        <span
          className="o inline-block"
          style={{ opacity: 0 }}
        >
          O
        </span>

        {/* Right part: anchored to the O so it reveals rightwards */}
        <span
          className="side flex justify-start overflow-hidden whitespace-nowrap py-4"
          style={{ width: 0, opacity: 0 }}
        >
          TTE
        </span>
      </h1>
    </motion.div>
  );
}