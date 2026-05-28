import React, { memo, useEffect, useRef } from 'react';

// Generates random stars and animates them
const Starfield = memo(() => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const stars = [];
    const COUNT = 90;
    for (let i = 0; i < COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${2 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 4}s;
      `;
      container.appendChild(star);
      stars.push(star);
    }
    return () => stars.forEach(s => s.remove());
  }, []);

  return <div className="starfield" ref={containerRef} />;
});
Starfield.displayName = 'Starfield';

export default Starfield;
