import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Hero from "./pages/Hero.jsx";
import Project from "./pages/Project.jsx";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {page === "home" ? (
          <Hero key="home" onNext={() => setPage("project")} />
        ) : (
          <Project key="project" onBack={() => setPage("home")} />
        )}
      </AnimatePresence>
    </div>
  );
}
