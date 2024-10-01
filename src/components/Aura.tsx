import React, { useState, useEffect } from "react";

const Aura = () => {
    const [textIndex, setTextIndex] = useState(0);
    const texts = ["an engineering student", "a developer & designer", "a shutterbug"];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 3000); // Change text every 3 seconds

        return () => {
            clearInterval(interval);
        }
    }, [texts.length]);

    return (
        <div className="center-container">
            <div className="pulsating-circle">
                <div className="inner-circle"></div>
            </div>
            <div className="pulsating-text">Hi! I'm Charlene</div>
            <div className="alternating-text" key={textIndex}>{texts[textIndex]}</div>
        </div>
    );
};

export default Aura;