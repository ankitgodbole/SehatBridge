import React, { useEffect, useState } from 'react';
import '../styles/ScrollProgressIndicator.css';

function ScrollProgressIndicator() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let requestId = null;

    const handleScroll = () => {
      if (requestId) return;

      requestId = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        setScrollPosition(scrollPercent);
        requestId = null;
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <>
      <div className="progressBar"></div>
      <div
        className="progressIndicator"
        style={{ width: `${scrollPosition}%` }}
        aria-label="Scroll Progress Indicator"
        title={`${Math.round(scrollPosition)}% read`}
      ></div>
    </>
  );
}

export default ScrollProgressIndicator;
