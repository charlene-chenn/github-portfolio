import React, { useLayoutEffect, useRef, useState } from "react";

type SegmentedControlProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

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

  return (
    <div className="segmented-control" role="tablist">
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
