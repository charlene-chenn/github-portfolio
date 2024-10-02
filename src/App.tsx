import React, { useState } from 'react';
import Alert from "./components/Alert";
import Button from "./components/Button";
import Aura from "./components/Aura";
import Nav from "./components/Nav";
import Project from "./components/Project";
import "./output.css";

function App() {
  const projects = [
    {
      title: "Tomorrow Taiwan, 2023",
      description: "Tomorrow Taiwan is an entrepreneurship competition designed for local Taiwan high school students to gain experience with crafting pitches, as well as delivering concepts of entrepreneurship in simple words to younger students.",
      media: "/github-portfolio/assets/tmrtaiwan.svg",
      tags: ["HTML", "CSS","Bootstrap","Javascript"]
    },
    {
      title: "Continuum Robot, 2024",
      description: "A modularized, multi-purpose continuum robot prototype inspired by applications in minimally-invasive surgeries and space exploration. Full papers and videos will be updated soon.",
      media: "/github-portfolio/assets/continuum.gif",
      tags: ["C", "MATLAB", "Fusion 360", "UltiMaker Cura", "STM-32"]
    },
    {
      title: "Acoustic Levitation, 2024",
      description: "Touchless manipulation of seeds using phased array transducers to explore applications of acoustic levitation in industry.",
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

  return (
    <div className="app-wrapper ${isDarkMode ? 'dark-mode' : ''}`">
      <Nav />
      <div className="content-wrapper">
        <Aura />
        <div className="aura-container">
          <div className="project-big-title">
              Experience
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
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
  );
}

export default App;