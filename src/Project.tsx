import { useState } from 'react';

/* Import icons */
import { FaGithub } from 'react-icons/fa'
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";

interface Props {
    title: string;
    description: string | React.ReactNode;
    media: string;
    tags: string[];
}

function Project({ title, description, media, tags} : Props) {
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const toggleDescription = () => {
        setDescriptionVisible(!isDescriptionVisible);
    }

    return (
        <div className="project-tile project-icons">
            <img src={media} alt={title} className="project-image" />
            <div className="project-overlay absolute inset-0 flex opacity-0 hover:opacity-100 font-bold">
                <h3 className="project-title text-left">{title}</h3>
                <div className="project-tags flex flex-wrap">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
                <hr className="w-11/12 my-2 divider" />
                <div className={`project-description text-left ${isDescriptionVisible 
                    ? 'visible' : 'hidden'}`} style={{ marginTop: isDescriptionVisible ? '0px' : '0', opacity: isDescriptionVisible ? '1' : '0', transition: 'opacity 0.5s ease-out, margin-top 0.5s ease-out'}}>
                    {description}
                </div>
                <button onClick={toggleDescription} className="read-more-button mt-2 flex items-center">
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
            {/* <h5 className="project-title">{title}</h5> */}
            {/* <p className="project-description">Description of Project 1.</p> */}
            {/* <a href="project1.html" className="project-link">Read More</a> */}
        </div>
    );
};

export default Project;