import React, { useEffect, useState, useRef } from 'react';
import "../styles/AnimatedCursor.css";

const AnimatedCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const positionsRef = useRef([]);
  const [, forceRender] = useState(0); // Used to trigger re-renders
  const numberOfCircles = 10;
  const frameRef = useRef(null);

  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(/android|iphone|ipad|ipod/.test(userAgent) || touchDevice);
    };

    checkMobileDevice();

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      positionsRef.current = [{ x, y }, ...positionsRef.current.slice(0, numberOfCircles - 1)];
      forceRender(p => p + 1); // Trigger re-render
    };

    if (!isMobile) {
      window.addEventListener('mousemove', moveCursor);
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      positionsRef.current = [];
    };
  }, [isMobile]);

  // Trail clear timeout
  useEffect(() => {
    if (isMobile || positionsRef.current.length === 0) return;

    const timer = setTimeout(() => {
      positionsRef.current = [];
      forceRender(p => p + 1); // Trigger re-render to remove trail
    }, 100);

    return () => clearTimeout(timer);
  });

  if (isMobile) return null;

  return (
    <div className="cursor-trail">
      {positionsRef.current.map((pos, index) => (
        <div
          key={index}
          className="cursor-circle"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: `scale(${(numberOfCircles - index) / numberOfCircles})`,
            opacity: `${(numberOfCircles - index) / numberOfCircles}`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedCursor;
