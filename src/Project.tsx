import { useEffect, useRef, useState } from 'react';
import TagRow from './TagRow';
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
}

function Project({ title, description, media, tags, links} : Props) {
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const [isTagDropdownOpen, setTagDropdownOpen] = useState(false);

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

    // If the collapsed card is too short for everything, hide the tag row so the rest keeps its padding
    const innerRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const tagsHeight = useRef(0);
    const [tagsCollapsed, setTagsCollapsed] = useState(false);

    useEffect(() => {
        const inner = innerRef.current;
        if (!inner) return;

        const update = () => {
            if (isDescriptionVisible) {
                setTagsCollapsed(false); // expanded cards scroll, so there is always room
                return;
            }
            const gap = parseFloat(getComputedStyle(inner).rowGap) || 0;
            if (tagsRef.current && tagsRef.current.offsetHeight > 0) {
                tagsHeight.current = tagsRef.current.offsetHeight + gap;
            }
            setTagsCollapsed((collapsed) =>
                collapsed
                    ? inner.scrollHeight + tagsHeight.current > inner.clientHeight
                    : inner.scrollHeight > inner.clientHeight
            );
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
        <div
            className={`project-tile project-icons ${media ? "" : "no-media"} ${isTagDropdownOpen ? "pinned" : ""}`}
            ref={tileRef}
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
                    <h3 className="project-title text-left">{title}</h3>
                    <div ref={tagsRef} className={`project-tags-wrapper ${tagsCollapsed ? "collapsed" : ""}`}>
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
                        <div className="project-description-inner">{description}</div>
                    </div>
            
                </div>
            </div>
            {/* <h5 className="project-title">{title}</h5> */}
            {/* <p className="project-description">Description of Project 1.</p> */}
            {/* <a href="project1.html" className="project-link">Read More</a> */}
        </div>
    );
};

export default Project;