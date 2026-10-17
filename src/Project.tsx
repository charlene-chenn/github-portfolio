import { useEffect, useRef, useState } from 'react';
import TagRow from './TagRow';
import ProjectSheet from './ProjectSheet';
import { linkType } from './linkIcons';

/* Import icons */
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";

interface Props {
    title: string;
    description: string | React.ReactNode;
    media: string;
    tags: string[];
    links?: { label: string; href: string }[];
    credit?: string; // image credit shown at the end of the description, e.g. "© Fauna Robotics"
}

function Project({ title, description, media, tags, links, credit } : Props) {
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const [isTagDropdownOpen, setTagDropdownOpen] = useState(false);

    // On phones and other touch screens hover cards don't work well, so tapping the tile
    // opens the project in a full-screen sheet instead
    const touchQuery = "(hover: none), (max-width: 640px)";
    const [isTouch, setTouch] = useState(() => window.matchMedia(touchQuery).matches);
    const [isSheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        const query = window.matchMedia(touchQuery);
        const update = () => setTouch(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    // GIFs show a still frame (<name>-still.jpg next to the GIF) and only load and play
    // while at least half the tile is scrolled into view
    const isGif = media.toLowerCase().endsWith(".gif");
    const stillImage = isGif ? media.replace(/\.gif$/i, "-still.jpg") : media;
    const tileRef = useRef<HTMLDivElement>(null);
    const [isInView, setInView] = useState(false);
    const [isGifLoaded, setGifLoaded] = useState(false);

    useEffect(() => {
        const tile = tileRef.current;
        if (!isGif || !tile) return;
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.5 }
        );
        observer.observe(tile);
        return () => observer.disconnect();
    }, [isGif]);
    const toggleDescription = () => {
        setDescriptionVisible(!isDescriptionVisible);
    }

    // The folded card always shows its tag row. If the card is too short for everything,
    // the title gives up lines instead (3, then 2, then 1, ending in "…"); opened cards scroll
    // and show the full title.
    const innerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const inner = innerRef.current;
        const title = titleRef.current;
        if (!inner || !title) return;

        const update = () => {
            title.style.removeProperty("-webkit-line-clamp");
            if (isDescriptionVisible) return;
            for (let lines = 3; lines >= 1; lines--) {
                title.style.setProperty("-webkit-line-clamp", String(lines));
                if (inner.scrollHeight <= inner.clientHeight) break;
            }
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(inner);
        return () => observer.disconnect();
    }, [isDescriptionVisible]);

    // Clicking anywhere on the card toggles the description, except on its own controls
    // (links, the "read more" button, the "+N" tag chip) or while selecting text
    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest("a, button, .tag-more")) return;
        if (window.getSelection()?.toString()) return;
        toggleDescription();
    };

    return (
        <>
        <div
            className={`project-tile project-icons ${media ? "" : "no-media"} ${isTagDropdownOpen ? "pinned" : ""} ${isTouch ? "touch" : ""}`}
            ref={tileRef}
            onClick={isTouch ? () => setSheetOpen(true) : undefined}
            role={isTouch ? "button" : undefined}
            tabIndex={isTouch ? 0 : undefined}
            aria-label={isTouch ? `Open ${title}` : undefined}
            onKeyDown={isTouch ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSheetOpen(true); } } : undefined}
        >
            {media && <img src={stillImage} alt={title} className="project-image" />}
            {isGif && isInView && (
                <img
                    src={media}
                    alt=""
                    aria-hidden="true"
                    className={`project-image project-gif ${isGifLoaded ? "loaded" : ""}`}
                    onLoad={() => setGifLoaded(true)}
                />
            )}
            {/* Without an image, the text card is shown straight away instead of on hover */}
            <div
                onClick={handleCardClick}
                className={`project-overlay absolute inset-0 flex opacity-0 hover:opacity-100 font-bold ${isDescriptionVisible ? "expanded" : ""} ${media ? "" : "always-visible"}`}
            >
                <div ref={innerRef} className="project-card-inner">
                    <h3 ref={titleRef} className="project-title text-left">{title}</h3>
                    <div className="project-tags-wrapper">
                        <TagRow tags={tags} onDropdownChange={setTagDropdownOpen} />
                    </div>
                    <hr className="divider" />
                    <div className="project-footer">
                        {links && links.length > 0 && (
                            <div className="project-links">
                                {links.map((link) => {
                                    const { icon: Icon, name } = linkType(link.label);
                                    return (
                                        <a
                                            key={link.href + link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link-icon"
                                            aria-label={name}
                                            title={name}
                                        >
                                            <Icon />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                        <button onClick={toggleDescription} className="read-more-button flex items-center">
                            {isDescriptionVisible ? (
                                <>
                                    <span className="mr-2">read less</span>
                                    <RiArrowUpSLine />
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">read more</span>
                                    <RiArrowDownSLine />
                                </>
                            )}
                        </button>
                    </div>
                    <div className={`project-description text-left ${isDescriptionVisible ? 'visible' : ''}`}>
                        <div className="project-description-inner">
                            {description}
                            {credit && <p className="project-credit">Image {credit}</p>}
                        </div>
                    </div>
            
                </div>
            </div>
            {/* <h5 className="project-title">{title}</h5> */}
            {/* <p className="project-description">Description of Project 1.</p> */}
            {/* <a href="project1.html" className="project-link">Read More</a> */}
        </div>
        {/* Outside the tile, so taps inside the sheet don't reach the tile and reopen it */}
        {isSheetOpen && (
            <ProjectSheet
                title={title}
                description={description}
                // What the tile shows right now: the still frame, or the GIF once it has loaded
                media={isGif && !isGifLoaded ? stillImage : media}
                tags={tags}
                links={links}
                credit={credit}
                origin={tileRef.current}
                onClose={() => setSheetOpen(false)}
            />
        )}
        </>
    );
};

export default Project;