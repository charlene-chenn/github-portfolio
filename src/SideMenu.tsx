import React, { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "about." },
  { id: "projects", label: "projects." },
  { id: "contact", label: "contact." },
];

const ITEM_SPACING = 22; // px between neighbouring labels on the dial
const ITEM_ANGLE = 52;   // degrees each label is tilted per step away from the centre

const SideMenu = () => {
  // Fractional position on the dial: 0 = about, 1 = projects, 1.5 = halfway to contact, ...
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      // Scroll offset at which each section counts as reached (its top at mid-screen),
      // capped at the bottom of the page so short final sections are still reachable
      const targets = sections.map((section) => {
        const el = document.getElementById(section.id);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return Math.min(Math.max(top - window.innerHeight / 2, 0), maxScroll);
      });

      const y = window.scrollY;
      let next = sections.length - 1;
      for (let i = 0; i < targets.length - 1; i++) {
        if (y < targets[i + 1]) {
          const span = targets[i + 1] - targets[i];
          next = span > 0 ? i + Math.max(0, (y - targets[i]) / span) : i + 1;
          break;
        }
      }
      setPosition(next);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = Math.round(position);

  return (
    <aside className="side-menu">
      <span className="side-menu-notch" />
      <div className="side-menu-dial">
        {sections.map((section, index) => {
          const offset = index - position;
          const distance = Math.abs(offset);
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`side-menu-link ${index === activeIndex ? "active" : ""}`}
              aria-current={index === activeIndex ? "location" : undefined}
              style={{
                transform: `translateY(calc(-50% + ${offset * ITEM_SPACING}px)) rotateX(${-offset * ITEM_ANGLE}deg)`,
                opacity: Math.max(0, 0.9 - distance * 0.4),
                pointerEvents: distance > 1.6 ? "none" : "auto",
              }}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </aside>
  );
};

export default SideMenu;
