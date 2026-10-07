import { IconType } from 'react-icons';
import { FiAlignLeft, FiExternalLink, FiFileText, FiGithub, FiLink, FiLinkedin, FiPlayCircle } from 'react-icons/fi';

/* Icon and readable name for each kind of project link, keyed by the `label` used in App.tsx */
const LINK_TYPES: Record<string, { icon: IconType; name: string }> = {
    pdf: { icon: FiFileText, name: "Paper" },
    paper: { icon: FiFileText, name: "Paper" },
    video: { icon: FiPlayCircle, name: "Video" },
    code: { icon: FiGithub, name: "Code" },
    repository: { icon: FiGithub, name: "Code" },
    website: { icon: FiExternalLink, name: "Website" },
    demo: { icon: FiExternalLink, name: "Demo" },
    post: { icon: FiLinkedin, name: "Post" },
    abstract: { icon: FiAlignLeft, name: "Abstract" },
};

export const linkType = (label: string) =>
    LINK_TYPES[label.toLowerCase()] ?? { icon: FiLink, name: label };
