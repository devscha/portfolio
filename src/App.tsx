import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import PreloadingAnimation from "./components/preloadinganimation";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import AboutMe from "./pages/abtmeMain";
import AboutDetails from "./pages/abtmeDeets";
import Works from "./pages/works";
import GraphicWorks from "./pages/graphicworks";
import UiuxWorks from "./pages/uiuxworks";
import Contacts from "./pages/contacts";

// Don't let the browser jump back to the last scroll position on reload
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleFinish = useCallback(() => {
    window.scrollTo(0, 0);
    setLoading(false);
  }, []);

  // Always start on the landing page when the site loads or reloads
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  // About Me buttons: Education > About Details, Skills > About Details
  // (on mobile it jumps to the Skills panel), Works > Collection of Works
  const handleAboutSelect = useCallback(
    (key: "education" | "skills" | "works") => {
      const isMobile = window.matchMedia("(max-width: 800px)").matches;
      const id =
        key === "works"
          ? "works"
          : key === "skills" && isMobile
            ? "about-skills"
            : "about-details";
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    []
  );

  return (
    <>
      <div className="grid-bg" />

      <AnimatePresence>
        {loading && <PreloadingAnimation onFinish={handleFinish} />}
      </AnimatePresence>

      {!loading && <Navbar />}

      <Home ready={!loading} />

      {/* Main About Me Section */}
      <AboutMe onSelect={handleAboutSelect} />

      {/* About Details (Education, Skillset, Softwares). It sets id="about-details" itself */}
      <AboutDetails />

      {/* Collection of Works */}
      <Works />

      {/* Graphic Works. It sets id="graphic-works" itself */}
      <GraphicWorks />

      {/* UI/UX Works. It sets id="uiux-works" itself */}
      <UiuxWorks />

      {/* Contacts. It sets id="contacts" itself */}
      <Contacts />
    </>
  );
}