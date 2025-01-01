import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const Nav = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <nav className="navbar">
      <a href="#home">
        <img
          className="navbar-logo"
          src={darkMode ? '/github-portfolio/assets/logo_white.svg' : '/github-portfolio/assets/logo_black.svg'}
          alt="Logo"
        />
      </a>
      <div className="navbar-items px-3 py-2 text-sm font-medium">
        <button className="dark-mode-toggle text-md px-5" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        <a
              href="about.html"
              className="navbar-link"
              aria-current="page"
              target="_blank"
            >
              about.
            </a>
            <a
              href="https://github.com/charlene-chenn"
              className="navbar-link"
              aria-current="page"
              target="_blank"
            >
              github.
            </a>
            <a
              href="/github-portfolio/assets/Chen_Charlene_cv.pdf"
              className="navbar-link"
              target="_blank"
            >
              resume.
            </a>
      </div>
    </nav>
  );
};

export default Nav;