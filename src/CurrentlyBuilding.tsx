import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Props {
    label: string;
    href?: string;
    inline?: boolean; // plain text in the page (used on phones) instead of the corner popup
}

const COLUMNS = 48;      // thin ticks across the groove
const ROWS = 1;          // stacked rows of ticks
const ROW_LAG = 2;       // columns each row trails the one above, so the lit edge leans like "/"
const TAIL = 6;          // columns over which the lit edge fades in, in steps
const STEP = 0.35;       // columns the edge advances per tick of the clock
const STEP_MS = 250;     // so the edge moves 1.4 columns a second, about 40s to fill
const HOLD_MS = 4000;    // rest on a full bar before fading out and starting again
const STORAGE_KEY = "building-popup-collapsed"; // remembers if the visitor folded the popup away

// Where the edge ends up once every tick is fully lit
const FULL = COLUMNS + (ROWS - 1) * ROW_LAG + TAIL;

/* "Currently building" status: the project name above a row of ticks that slowly light up.
   As a popup fixed in the corner, the × folds it into a small tab that opens it again. */
function CurrentlyBuilding({ label, href, inline = false }: Props) {
    const reduceMotion = typeof window !== "undefined"
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [front, setFront] = useState(reduceMotion ? FULL * 0.6 : 0);

    useEffect(() => {
        if (reduceMotion) return;
        // Counts past FULL for the hold, then wraps back to empty
        const holdSteps = HOLD_MS / STEP_MS * STEP;
        const interval = setInterval(() => {
            setFront((edge) => (edge >= FULL + holdSteps ? 0 : edge + STEP));
        }, STEP_MS);
        return () => clearInterval(interval);
    }, [reduceMotion]);

    // 0 (dark) to 1 (lit) in quarter steps, like the stepped glow of an LED panel
    const brightness = (row: number, col: number) => {
        const lit = (front - (col + row * ROW_LAG)) / TAIL;
        return Math.round(Math.min(Math.max(lit, 0), 1) * 4) / 4;
    };

    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === "1";
        } catch {
            return false;
        }
    });

    const setCollapsedAndRemember = (value: boolean) => {
        setCollapsed(value);
        try {
            localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
        } catch {
            // Storage unavailable (e.g. private browsing): it just won't be remembered
        }
    };

    const name = href
        ? <a href={href} className="building-name" target="_blank" rel="noopener noreferrer">{label}</a>
        : <span className="building-name">{label}</span>;

    const content = (
        <>
            <span className="building-title">currently building...</span>
            {name}
            <div
                className="building-track"
                role="progressbar"
                aria-label={`Currently building: ${label}`}
                style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}
            >
                {Array.from({ length: ROWS }, (_, row) =>
                    Array.from({ length: COLUMNS }, (_, col) => (
                        <span
                            key={`${row}-${col}`}
                            className="building-tick"
                            style={{
                                // Shades from the aura's orange at the start to its pink at the end
                                "--mix": `${Math.round((col / (COLUMNS - 1)) * 100)}%`,
                                "--lit": brightness(row, col),
                            } as React.CSSProperties}
                        />
                    ))
                )}
            </div>
        </>
    );

    if (inline) {
        return <div className="building building-inline">{content}</div>;
    }

    return (
        <aside className={`building-popup ${collapsed ? "collapsed" : ""}`} aria-label="Currently building">
            <button
                className="building-tab"
                onClick={() => setCollapsedAndRemember(false)}
                aria-expanded={!collapsed}
                tabIndex={collapsed ? 0 : -1}
            >
                currently building...
            </button>
            <div className="building" aria-hidden={collapsed}>
            <button
                className="building-close"
                onClick={() => setCollapsedAndRemember(true)}
                aria-label="Hide"
                tabIndex={collapsed ? -1 : 0}
            >
                <FiX aria-hidden="true" />
            </button>
            {content}
            </div>
        </aside>
    );
}

export default CurrentlyBuilding;
