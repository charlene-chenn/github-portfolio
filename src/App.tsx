import { useState } from 'react';
import Nav from "./Nav";
import Aura from "./Aura";
import Project from "./Project";
import './input.css';

function App(){
  /* Dark mode */
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  /* Project description */
  const projects = [
    {
      title: "Tomorrow Taiwan, 2023",
      description: "Tomorrow Taiwan is an entrepreneurship competition designed for local Taiwan high school students to gain experience with crafting pitches, as well as delivering concepts of entrepreneurship in simple words to younger students.",
      media: "/github-portfolio/assets/tmrtaiwan.svg",
      tags: ["HTML", "CSS","Bootstrap","Javascript"]
    },
    {
      title: "Continuum Robot, 2024",
      description:
        <p>
          A modularized, multi-purpose continuum robot prototype inspired by applications in minimally-invasive surgeries and space exploration. Full
          <a href="https://drive.google.com/drive/folders/1ctAmJ8j__iOsQ_Qg1ByHErjlwyA69-VV?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> paper</a> and
          <a href="https://drive.google.com/drive/folders/1v-818HWXqmz9KSTp4WpOj0xJH9MooVLc?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> video</a> can be accessed via links.
        </p>,
      media: "/github-portfolio/assets/continuum.gif",
      tags: ["C", "MATLAB", "Fusion 360", "UltiMaker Cura", "STM-32"]
    },
    {
      title: "Acoustic Levitation, 2024",
      description: 
        <p>
          Touchless manipulation of seeds using phased array transducers to explore applications of acoustic levitation in industry. More detail on modeling and simulation can be found in the full 
          <a href="https://drive.google.com/file/d/1SOuzd8NgyN0l4Xmf5l8RjXu-PZoUNISm/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> paper</a> and
          <a href="https://github.com/uhDann/Wave-Simulator" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> repository.</a>
        </p>,
      media: "/github-portfolio/assets/levitateseeds.gif",
      tags: ["C++", "Python", "Spinnaker API", "FLIR Blackfly S"]
    },
    {
      title: "Nexus Labs, 2024",
      description: "An index for neurodegenerative diseases using OpenNeuro EEG database and deep learning methods to explore usage of non-invasive neural data.",
      media: "/github-portfolio/assets/nexus.svg",
      tags: ["Python", "SciPy", "scikit-learn", "Pandas", "NumPy", "Matplotlib"]
    },
    {
      title: "Portfolio, 2024",
      description: "A sandbox to exhibit my past projects and interests in employing artificial intelligence, design, and interfaces.",
      media: "/github-portfolio/assets/portfolio.png",
      tags: ["HTML", "CSS", "ReactJS", "Tailwind"]
    }
  ];

  /* Components */
  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <Nav />
      <div className="content-wrapper">
        <Aura />
        <div className="project-container">
          <div className="project-big-title">Catalogue</div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <Project
                key={index}
                title={project.title}
                description={project.description}
                media={project.media}
                tags={project.tags}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
