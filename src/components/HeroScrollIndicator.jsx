import React from 'react';

export default function HeroScrollIndicator() {
  const handleScrollDown = () => {
    const nextSection = document.getElementById('weaves-ribbon') || document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleScrollDown}
      aria-label="Scroll down to explore"
      className="group absolute bottom-4 sm:bottom-6 right-5 sm:right-10 z-20 flex items-center gap-3 text-primary-foreground/70 hover:text-gold transition-colors duration-300 select-none cursor-pointer"
    >
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-medium transition-colors group-hover:text-gold">
        Scroll
      </span>
      <div className="relative h-9 w-5 rounded-full border border-gold/40 flex items-start justify-center p-1 group-hover:border-gold transition-colors backdrop-blur-xs">
        <div className="h-1.5 w-1.5 rounded-full bg-gold animate-scroll-dot" />
      </div>
    </button>
  );
}
