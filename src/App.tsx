import { useState } from 'react';
import { FiFileText, FiGithub, FiLinkedin } from 'react-icons/fi';
import Nav from "./Nav";
import Aura from "./Aura";
import Project from "./Project";
import SideMenu from "./SideMenu";
import SegmentedControl from "./SegmentedControl";
import ResearchList from "./ResearchList";
import './input.css';

function App(){
  /* Dark mode */
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [category, setCategory] = useState("All");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  /* Project description */
  const projects = [
    {
      title: "Lost in Encoding: Comparing Property Retention in Tactile Representations Formats, 2026",
      categories: ["Research", "Robotics"],
      description: 
        "An empirical study of which physical properties survive when the same tactile data is encoded as a tactile image or as a point cloud. For agents exploring open-ended, unstructured environments, touch is how they learn what objects are made of, and the format chosen to encode it decides which of those properties they can perceive at all. Yet that choice is usually inherited from the sensor hardware rather than made deliberately. By rendering the same contact from a uSkin array on a LEAP hand both ways, this work makes the choice measurable, and points to representation design as a lever for physical AI that has to understand unfamiliar materials in the wild.",
      kind: "Paper",
      links: [
        { label: "pdf", href: "" }
      ],
      media: "/github-portfolio/assets/hand.jpg",
      tags: ["Force and Tactile Sensing", "Grasping and Manipulation", "Representation Learning"]
    },
    {
      title: "Curiosity-Driven Self-Touch Learning in Embodied Agents, 2026",
      categories: ["Research", "Robotics"],
      description:
        "A study of how balancing curiosity against touch reward shapes body learning in a simulated infant robot in BabyBench. A PPO agent with dual value heads mixes Random Network Distillation curiosity with extrinsic touch reward, and a DreamerV3 world model measures how well the agent learns its own body. A balanced mix (α = 0.5) gave the best and most stable world-model reconstruction, and curiosity led to more varied, asymmetric self-touch, even though reward-only agents touched themselves most often.",
      kind: "Presentation",
      links: [
        { label: "video", href: "https://drive.google.com/file/d/1-W8yGM2JjCA-0qqgbhNMY9iav3rIB1vA/view?usp=sharing" }
      ],
      media: "/github-portfolio/assets/sprout.jpg",
      tags: ["Robot Learning", "Reinforcement Learning", "World Models"]
    },
    {
      title: "Security Challenges in Decentralized MARL, 2026",
      categories: ["Research"],
      description: 
        "A survey of the security vulnerabilities that decentralised multi-agent reinforcement learning introduces into cyber-physical and robotic systems such as swarms and adaptive infrastructure. It reviews the core algorithms, current defences and the open challenges that stand in the way of safe real-world deployment.",
      kind: "Survey",
      links: [
        { label: "pdf", href: "https://drive.google.com/file/d/1ZCcwA4NeVs4_iUjxgNnwgsqSxtS6EZAX/view?usp=sharing" }
      ],
      media: "",
      tags: ["Reinforcement learning",  "Multi-agent systems", "Edge computing", "IoT security", "cyber-physical systems", "distributed autonomy", "adversarial training"]
    },
    {
      title: "GeoGuessr AI for Image Geolocation, 2025",
      categories: ["Research", "Software"],
      description:
        "An explainable geolocation system that guesses a photo's country the way a GeoGuessr player would, by reasoning over visual clues. A LLaMA3-8B model, finetuned with QLoRA, combines evidence from four vision models (YOLOv8n, OCR, DINOv2 and CLIP) into step-by-step predictions. It reached over 70% scene classification and 25× chance-level country accuracy across 120 countries on a sparse dataset, ranking 1st in the year cohort. ",
      kind: "Project",
      links: [
        { label: "video", href: "https://drive.google.com/file/d/1vHIOaPc77NC74-rtJb42wYHJqYVv4i-s/view?usp=sharing" }
      ],
      media: "",
      tags: ["LLaMA3-8B", "QLoRA", "YOLOv8", "OCR", "DINOv2", "CLIP", "Computer Vision"]
    },
    {
      title: "Hardwire, 2026",
      categories: ["Software"],
      description:
        "An agent-first platform for autonomous hardware engineering. Its agent, Bob the Builder, turns a plain-language prompt such as \"generate an ESP32 enclosure with cooling vents\" into a 3D model, a circuit schematic and example Arduino firmware, all previewed interactively in the browser.",
      kind: "Project",
      links: [
        { label: "website", href: "https://hardwire-gray.vercel.app/" }
      ],
      media: "/github-portfolio/assets/hardwire.jpg",
      tags: ["React", "Three.js", "LLM Agents", "CAD", "Arduino", "ESP32"]
    },
    {
      title: "Protalab, 2025",
      categories: ["Software"],
      description: 
        "Protalab is an end-to-end rapid prototyping platform powered by generative AI and agentic design to streamline the design process from ideation to fabrication.",
      links: [
        { label: "video", href: "https://drive.google.com/file/d/1-eHX7nuzI9oBvhQ4rUC8kKwGLnfk9v3y/view?usp=sharing" }
      ],
      media: "/github-portfolio/assets/protalab.gif",
      tags: ["Python", "TypeScript", "LangGraph", "Docker", "HTML", "CSS", "ReactJS", "Tailwind", "OpenAI API", "Claude API"]
    },
    {
      title: "Real-Time Personal Translator, 2025",
      categories: ["Software"],
      description:
        "A real-time AI translator for phone calls, built with OpenAI’s Realtime API and Twilio. Milo enables live, two-way voice translation between users, preserving tone and flow for natural conversations.",
      links: [
        { label: "post", href: "https://www.linkedin.com/posts/charlene-chenn_this-past-weekend-at-hacklondon-2025sponsored-activity-7302418834152390657-lpjE?utm_source=share&utm_medium=member_desktop&rcm=ACoAADQWqeMBfKBVmPJYTT8PK0aePRPNUBRWX2M" },
        { label: "code", href: "https://github.com/charlene-chenn/hacklondon25" }
      ],
      media: "/github-portfolio/assets/huhai.jpeg",
      tags: ["React.js", "Tailwind", "Websockets", "FastAPI", "Telephony", "OpenAI Realtime API"]
    },
    {
      title: "Continuum Robot, 2024",
      categories: ["Robotics"],
      description:
        "A modularized, multi-purpose continuum robot prototype inspired by applications in minimally-invasive surgeries and space exploration.",
      links: [
        { label: "paper", href: "https://drive.google.com/drive/folders/1ctAmJ8j__iOsQ_Qg1ByHErjlwyA69-VV?usp=drive_link" },
        { label: "video", href: "https://drive.google.com/drive/folders/1v-818HWXqmz9KSTp4WpOj0xJH9MooVLc?usp=drive_link" },
        { label: "code", href: "https://github.com/L-Yanc/COMP0207_FinalProject" }
      ],
      media: "/github-portfolio/assets/continuum.gif",
      tags: ["C++", "MATLAB", "Fusion 360", "UltiMaker Cura", "STM-32"]
    },
    {
      title: "Acoustic Levitation, 2024",
      categories: ["Robotics"],
      description: 
        "Touchless manipulation of seeds using phased array transducers to explore applications of acoustic levitation in industry, with modelling and simulation detailed in the paper.",
      links: [
        { label: "paper", href: "https://drive.google.com/file/d/1SOuzd8NgyN0l4Xmf5l8RjXu-PZoUNISm/view?usp=sharing" },
        { label: "code", href: "https://github.com/uhDann/Wave-Simulator" }
      ],
      media: "/github-portfolio/assets/levitateseeds.gif",
      tags: ["C++", "Python", "Spinnaker API", "FLIR Blackfly S"]
    },
    {
      title: "Nexus Labs, 2024",
      categories: ["Research"],
      description: 
      "An index for neurodegenerative diseases using OpenNeuro EEG database and deep learning methods to explore usage of non-invasive neural data.",
      kind: "Project",
      links: [
        { label: "code", href: "https://github.com/charlene-chenn/nexus-neuroscience" }
      ],
      media: "/github-portfolio/assets/nexus.svg",
      tags: ["Python", "SciPy", "scikit-learn", "Pandas", "NumPy", "Matplotlib"]
    },
    {
      title: "Tomorrow Taiwan, 2023",
      categories: ["Community"],
      description: "Tomorrow Taiwan is an entrepreneurship competition designed for local Taiwan high school students to gain experience with crafting pitches, as well as delivering concepts of entrepreneurship in simple words to younger students.",
      media: "/github-portfolio/assets/tmrtaiwan.svg",
      tags: ["HTML", "CSS","Bootstrap","Javascript"]
    }
  ];

  /* Project filters */
  const categories = ["All", "Research", "Robotics", "Software", "Community"];
  const filteredProjects = category === "All"
    ? projects
    : projects.filter((project) => project.categories.includes(category));

  /* Components */
  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <Nav />
      <SideMenu />
      <div className="content-wrapper">
        <section id="about" className="w-full">
          <Aura />
        </section>
        <section id="projects" className="project-container">
          <div className="project-big-title">Catalogue</div>
          <div className="flex justify-center pb-10">
            <SegmentedControl options={categories} value={category} onChange={setCategory} />
          </div>
          {/* Both views stay mounted and are only shown or hidden, so filtering never rebuilds the tiles */}
          <div className={category === "Research" ? "" : "filter-hidden"}>
            <ResearchList projects={projects.filter((project) => project.categories.includes("Research"))} />
          </div>
          <div className={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 ${category === "Research" ? "filter-hidden" : ""}`}>
            {projects.map((project) => (
              <div
                key={project.title}
                className={`project-cell ${filteredProjects.includes(project) ? "" : "filter-hidden"}`}
              >
                <Project
                  title={project.title}
                  description={project.description}
                  media={project.media}
                  tags={project.tags}
                  links={project.links}
                />
              </div>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-container">
          <div className="project-big-title">Contact</div>
          <div className="contact-links">
            <a href="https://github.com/charlene-chenn" className="navbar-link contact-link" target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden="true" />github.</a>
            <a href="https://www.linkedin.com/in/charlene-chenn" className="navbar-link contact-link" target="_blank" rel="noopener noreferrer"><FiLinkedin aria-hidden="true" />linkedin.</a>
            <a href="/github-portfolio/assets/Chen_Charlene_cv.pdf" className="navbar-link contact-link" target="_blank" rel="noopener noreferrer"><FiFileText aria-hidden="true" />resume.</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App;
