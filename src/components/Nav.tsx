import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const Nav = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <nav className="px-2 sm:px-6 py-2 lg:px-8 py-4">
      <div className="flex flex-1 justify-between items-center">
        <div className="max-w-7xl px-2 sm:px-6 lg:px-8 ">
          <a href="#home">
            <img
              className="navbar-logo"
              src="/assets/logo_black.svg"
              alt="Logo"
            />
          </a>
        </div>
        <div className="sm:ml-6 sm:block">
          <div className="flex space-x-4">
            <button onClick={toggleDarkMode} className="dark-mode-toggle px-5 py-2">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <a
              href="about.html"
              className="px-3 py-2 text-sm font-medium navbar-link"
              aria-current="page"
              target="_blank"
            >
              about.
            </a>
            <a
              href="https://github.com/charlene-chenn"
              className="px-3 py-2 text-sm font-medium navbar-link"
              aria-current="page"
              target="_blank"
            >
              github.
            </a>
            <a
              href="src/assets/Chen_Charlene_cv.pdf"
              className="px-3 py-2 text-sm font-medium navbar-link"
              target="_blank"
            >
              resume.
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
