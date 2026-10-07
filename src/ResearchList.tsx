import { useState } from 'react';
import { linkType } from './linkIcons';

interface ResearchProject {
    title: string;
    description: string | React.ReactNode;
    tags: string[];
    kind?: string;
    venue?: string;
    authors?: string[];
    links?: { label: string; href: string }[];
}

interface Props {
    projects: ResearchProject[];
}

const SELF = "Charlene Chen";

/* Split "Title, 2026" into the title and its year */
const splitTitle = (title: string) => {
    const match = title.match(/^(.*),\s*(\d{4})$/);
    return match ? { name: match[1], year: match[2] } : { name: title, year: "" };
};

const AbstractIcon = linkType("abstract").icon;

function LinkIcon({ label }: { label: string }) {
    const Icon = linkType(label).icon;
    return <Icon aria-hidden="true" />;
}

function Publication({ project }: { project: ResearchProject }) {
    const [isAbstractOpen, setAbstractOpen] = useState(false);
    const { name, year } = splitTitle(project.title);

    return (
        <li className="pub">
            <div className="pub-badge-column">
                {project.kind && (
                    <span className={`pub-badge pub-badge-${project.kind.toLowerCase()}`}>{project.kind}</span>
                )}
            </div>
            <div className="pub-body">
                <h3 className="pub-title">{name}</h3>
                {project.authors && (
                    <p className="pub-authors">
                        {project.authors.map((author, index) => (
                            <span key={author}>
                                {index > 0 && ", "}
                                <span className={author === SELF ? "pub-self" : ""}>{author}</span>
                            </span>
                        ))}
                    </p>
                )}
                {(project.venue || year) && (
                    <p className="pub-venue">{[project.venue, year].filter(Boolean).join(", ")}</p>
                )}
                <div className="pub-actions">
                    <button
                        className={`pub-button ${isAbstractOpen ? "active" : ""}`}
                        onClick={() => setAbstractOpen(!isAbstractOpen)}
                        aria-expanded={isAbstractOpen}
                    >
                        <AbstractIcon aria-hidden="true" />
                        abstract
                    </button>
                    {project.links?.map((link) => (
                        <a
                            key={link.href + link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pub-button"
                        >
                            <LinkIcon label={link.label} />
                            {link.label}
                        </a>
                    ))}
                </div>
                <div className={`pub-abstract ${isAbstractOpen ? "open" : ""}`}>
                    <div className="pub-abstract-inner">
                        <div className="pub-abstract-text">{project.description}</div>
                        <div className="pub-tags">
                            {project.tags.map((tag) => (
                                <span key={tag} className="pub-tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

function ResearchList({ projects }: Props) {
    return (
        <ol className="pubs">
            {projects.map((project) => (
                <Publication key={project.title} project={project} />
            ))}
        </ol>
    );
}

export default ResearchList;
