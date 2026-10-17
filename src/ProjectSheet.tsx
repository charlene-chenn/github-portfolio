import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { linkType } from './linkIcons';

interface Props {
    title: string;
    description: string | React.ReactNode;
    media: string; // the image the tile is showing right now, so nothing new has to load
    tags: string[];
    links?: { label: string; href: string }[];
    credit?: string;
    origin: HTMLElement | null; // the tile it grows out of and shrinks back into
    onClose: () => void;
}

const DURATION = 450;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";       // opening: quick start, soft landing
const CLOSE_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";  // closing: even, so it glides back rather than snapping
const DECODE_TIMEOUT = 250; // ms to wait for the image to be ready to draw before animating anyway
const TILE_RADIUS = 20; // px, matches .project-tile

/* Full-screen view of a project, opened by tapping its tile on phones and other touch screens,
   where hover cards don't work well. The tile's image flies up and grows into place over a
   translucent backdrop, then the text fades in; closing plays it in reverse. It stays open until
   closed with the ×, Escape, or the phone's back gesture. */
function ProjectSheet({ title, description, media, tags, links, credit, origin, onClose }: Props) {
    const layerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const closing = useRef(false);

    // The element that flies between the tile and the sheet: the image, or for projects without
    // one, the whole content column
    const flyer = () => (media ? imageRef.current : contentRef.current);

    // Transform that puts the flyer exactly over the tile
    const tileFrame = (): Keyframe | null => {
        const el = flyer();
        const tile = origin?.getBoundingClientRect();
        if (!el || !tile || !tile.width) return null;
        const target = el.getBoundingClientRect();
        const scale = tile.width / target.width;
        return {
            transform: `translate(${tile.left - target.left}px, ${tile.top - target.top}px) scale(${scale})`,
            borderRadius: `${TILE_RADIUS / scale}px`,
            opacity: media ? 1 : 0,
        };
    };
    const restFrame = (): Keyframe => ({
        transform: "none",
        borderRadius: media && imageRef.current ? getComputedStyle(imageRef.current).borderRadius : "0px",
        opacity: 1,
    });
    const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hide the tile while its content is "out" in the sheet, so it looks like the tile itself moved
    const setTileHidden = (hidden: boolean) => {
        if (origin) origin.style.visibility = hidden ? "hidden" : "";
    };

    // Text out, image back into the tile, then unmount
    // fromBack: closed by the phone's back gesture, which has already removed the history entry
    const requestClose = (fromBack = false) => {
        if (closing.current) return;
        closing.current = true;
        // Closed with the ×, Escape or a tap outside: remove the history entry added on open.
        // The popstate this causes is ignored, since closing is already under way.
        if (!fromBack && history.state?.projectSheet) history.back();
        // Stop the opening animation if it's still running, so closing starts from where things are
        layerRef.current?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
        const from = tileFrame();
        const el = flyer();
        if (!from || !el || reduceMotion()) {
            setTileHidden(false);
            onCloseRef.current();
            return;
        }
        const quick = { duration: DURATION * 0.4, easing: CLOSE_EASING, fill: "forwards" as const };
        textRef.current?.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(8px)" }], quick);
        closeRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], quick);
        backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: DURATION, easing: CLOSE_EASING, fill: "forwards" });
        el.animate([restFrame(), from], { duration: DURATION, easing: CLOSE_EASING, fill: "forwards" })
            .finished.then(() => {
                setTileHidden(false);
                onCloseRef.current();
            });
    };
    const requestCloseRef = useRef(requestClose);
    requestCloseRef.current = requestClose;

    useEffect(() => {
        // Grow out of the tile, then bring in the text. Wait (briefly) until the image is decoded
        // and ready to draw, so the first frames aren't spent on a blank image or a stalled screen.
        const layer = layerRef.current;
        if (layer) layer.style.visibility = "hidden";
        let cancelled = false;
        const start = () => {
            if (cancelled || closing.current) return;
            if (layer) layer.style.visibility = "";
            closeRef.current?.focus({ preventScroll: true });
            setTileHidden(true);
            const from = tileFrame();
            const el = flyer();
            if (!from || !el || reduceMotion()) return;
            el.animate([from, restFrame()], { duration: DURATION, easing: EASING });
            backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DURATION, easing: EASING });
            const later = { duration: DURATION, delay: DURATION * 0.45, easing: EASING, fill: "backwards" as const };
            if (media) textRef.current?.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], later);
            closeRef.current?.animate([{ opacity: 0 }, { opacity: 0.8 }], later);
        };
        const image = imageRef.current;
        if (image && !reduceMotion()) {
            Promise.race([
                image.decode().catch(() => undefined),
                new Promise((resolve) => setTimeout(resolve, DECODE_TIMEOUT)),
            ]).then(start);
        } else {
            start();
        }

        // Keep the page behind still while the sheet is open
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // An extra history entry, so the phone's back gesture closes the sheet instead of leaving the
        // site. Only added once, even if this setup runs twice (React's StrictMode does that in development).
        if (!history.state?.projectSheet) history.pushState({ projectSheet: true }, "");
        const onPopState = () => {
            if (!history.state?.projectSheet) requestCloseRef.current(true);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") requestCloseRef.current();
        };
        window.addEventListener("popstate", onPopState);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            cancelled = true;
            document.body.style.overflow = previousOverflow;
            setTileHidden(false);
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return createPortal(
        <div ref={layerRef} className="sheet-layer">
            {/* Separate from the content, so only the backdrop fades and the image stays solid */}
            <div ref={backdropRef} className="sheet-backdrop" />
            <div
                ref={sheetRef}
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <button ref={closeRef} className="sheet-close" onClick={() => requestClose()} aria-label="Close">
                    <FiX aria-hidden="true" />
                </button>
                <div ref={contentRef} className="sheet-content">
                    {media && <img ref={imageRef} src={media} alt={title} className="sheet-image" />}
                    <div ref={textRef} className="sheet-text">
                        <h3 className="sheet-title">{title}</h3>
                        <p className="sheet-tags">{tags.join("  ·  ")}</p>
                        <div className="sheet-description">{description}</div>
                        {links && links.length > 0 && (
                            <div className="sheet-links">
                                {links.map((link) => {
                                    const { icon: Icon, name } = linkType(link.label);
                                    return (
                                        <a
                                            key={link.href + link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="sheet-link"
                                        >
                                            <Icon aria-hidden="true" />
                                            {name}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                        {credit && <p className="sheet-credit">Image {credit}</p>}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ProjectSheet;
