import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    tags: string[];
    onDropdownChange?: (open: boolean) => void;
}

const GAP = 6; // px, matches the gap in .project-tags

/* A single line of tags: shows as many as fit and summarises the rest as "+N" */
function TagRow({ tags, onDropdownChange }: Props) {
    const rowRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(tags.length);

    useLayoutEffect(() => {
        const row = rowRef.current;
        const measure = measureRef.current;
        if (!row || !measure) return;

        const update = () => {
            const available = row.clientWidth;
            const chips = Array.from(measure.children) as HTMLElement[];
            const tagWidths = chips.slice(0, tags.length).map((chip) => chip.offsetWidth);
            const moreWidth = chips[tags.length]?.offsetWidth ?? 0;

            // Everything fits: no "+N" needed
            const total = tagWidths.reduce((sum, w) => sum + w, 0) + GAP * Math.max(0, tags.length - 1);
            if (total <= available) {
                setVisibleCount(tags.length);
                return;
            }

            // Otherwise keep adding tags while there is still room for the "+N" chip after them
            let used = moreWidth;
            let count = 0;
            for (const width of tagWidths) {
                if (used + GAP + width > available) break;
                used += GAP + width;
                count++;
            }
            setVisibleCount(count);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(row);
        return () => observer.disconnect();
    }, [tags]);

    const hiddenCount = tags.length - visibleCount;

    // Dropdown listing the hidden tags, opened by hovering (or focusing) the "+N" chip.
    // It is rendered into <body> so the card's overflow clipping can't cut it off.
    const moreRef = useRef<HTMLSpanElement>(null);
    const closeTimer = useRef<number>();
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

    const openDropdown = () => {
        window.clearTimeout(closeTimer.current);
        const rect = moreRef.current?.getBoundingClientRect();
        if (rect) setDropdownPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
    };

    // Short delay so the pointer can travel from the chip into the dropdown
    const closeDropdown = () => {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setDropdownPos(null), 120);
    };

    // Close if the page scrolls, since the dropdown is positioned against the viewport
    useEffect(() => {
        if (!dropdownPos) return;
        const close = () => setDropdownPos(null);
        window.addEventListener("scroll", close, true);
        return () => window.removeEventListener("scroll", close, true);
    }, [dropdownPos]);

    useEffect(() => () => window.clearTimeout(closeTimer.current), []);

    // Let the card stay visible while the pointer is over the dropdown (which sits outside it)
    useEffect(() => {
        onDropdownChange?.(dropdownPos !== null);
    }, [dropdownPos !== null]);

    return (
        <div ref={rowRef} className="project-tags tag-row">
            {tags.slice(0, visibleCount).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
            ))}
            {hiddenCount > 0 && (
                <span
                    ref={moreRef}
                    className="tag tag-more"
                    tabIndex={0}
                    aria-label={`${hiddenCount} more tags`}
                    aria-expanded={dropdownPos !== null}
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                    onFocus={openDropdown}
                    onBlur={closeDropdown}
                >
                    +{hiddenCount}
                </span>
            )}
            {hiddenCount > 0 && dropdownPos && createPortal(
                <div
                    className="tag-dropdown"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                >
                    {tags.slice(visibleCount).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>,
                document.body
            )}

            {/* Invisible copy of every chip, used only to measure widths */}
            <div ref={measureRef} className="tag-row-measure" aria-hidden="true">
                {tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
                <span className="tag tag-more">+{tags.length}</span>
            </div>
        </div>
    );
}

export default TagRow;
