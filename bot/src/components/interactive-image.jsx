

import React, { useState } from 'react';

export function InteractiveImage({
  src,
  alt,
  title,
  width = 400,
  height = 400,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/20 transition-all duration-500"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500"
        style={{
          transform: isHovered
            ? `scale(1.05) translate(${mousePosition.x}px, ${mousePosition.y}px)`
            : 'scale(1) translate(0, 0)',
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-500"
        style={{ opacity: isHovered ? 0.5 : 0 }}
      />
      {title && (
        <div
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary via-primary/80 to-transparent text-primary-foreground transform transition-transform duration-500"
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
    </div>
  );
}
