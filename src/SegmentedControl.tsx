import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type SegmentedControlProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => {
  const controlRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  // Which sides have options scrolled out of view, so those edges fade as a hint to swipe
  const [hidden, setHidden] = useState({ left: false, right: false });

  // Slide the thumb under the selected option
  useLayoutEffect(() => {
    const updateThumb = () => {
      const button = buttonRefs.current[options.indexOf(value)];
      if (button) {
        setThumb({ left: button.offsetLeft, width: button.offsetWidth });
      }
    };

    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [options, value]);

  // On narrow screens the options can overflow: track which edges have more to scroll to
  useEffect(() => {
    const control = controlRef.current;
    if (!control) return;
    const update = () => {
      const max = control.scrollWidth - control.clientWidth;
      setHidden({ left: control.scrollLeft > 1, right: control.scrollLeft < max - 1 });
    };
    update();
    control.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(control);
    return () => {
      control.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  // Bring the chosen option fully into view if it was cut off at an edge
  useEffect(() => {
    const control = controlRef.current;
    const button = buttonRefs.current[options.indexOf(value)];
    if (!control || !button || control.scrollWidth <= control.clientWidth) return;
    const left = button.offsetLeft - 24;
    const right = button.offsetLeft + button.offsetWidth + 24 - control.clientWidth;
    if (control.scrollLeft > left) control.scrollTo({ left, behavior: "smooth" });
    else if (control.scrollLeft < right) control.scrollTo({ left: right, behavior: "smooth" });
  }, [options, value]);

  return (
    <div
      ref={controlRef}
      className={`segmented-control ${hidden.left ? "more-left" : ""} ${hidden.right ? "more-right" : ""}`}
      role="tablist"
    >
      <span className="segmented-thumb" style={{ left: thumb.left, width: thumb.width }} />
      {options.map((option, index) => (
        <button
          key={option}
          ref={(el) => (buttonRefs.current[index] = el)}
          role="tab"
          aria-selected={value === option}
          className={`segmented-option ${value === option ? "active" : ""}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
