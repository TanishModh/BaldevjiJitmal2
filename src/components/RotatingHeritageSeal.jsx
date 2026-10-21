import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';

export default function RotatingHeritageSeal({ to, size = 110, className = '' }) {
  const settings = useSiteSettings();
  const seal = settings.heritageSeal;
  const brand = settings.brand;

  const targetLink = to || seal?.link || '/gallery';
  const sealText = seal?.text || `· ESTD ${brand?.est || '1937'} · ${brand?.name?.toUpperCase() || 'BALDEVJI JITMAL'} · ${brand?.city?.toUpperCase() || 'INDORE'} · HERITAGE ·`;

  // Dynamically proportion center disc and diagonal arrow to the seal size
  const centerSize = Math.round(size * 0.46);
  const arrowSize = Math.max(16, Math.round(size * 0.22));

  return (
    <Link
      to={targetLink}
      aria-label={`Explore ${brand?.name || 'Baldevji Jitmal'} Catalogue`}
      className={`group relative inline-flex items-center justify-center rounded-full select-none transition-transform duration-500 hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Rotating Typographic Ring (Hanson Wu inspired circular text) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full animate-spin-slow overflow-visible text-accent group-hover:text-primary transition-colors duration-500"
      >
        <defs>
          <path
            id="heritageSealPath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text className="text-[7.8px] uppercase tracking-[0.22em] fill-current font-medium">
          <textPath href="#heritageSealPath" startOffset="0%">
            {sealText}
          </textPath>
        </text>
      </svg>

      {/* Center Regal Disc with Elegant Diagonal Arrow */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full bg-primary text-gold shadow-lift border border-gold/40 group-hover:border-gold group-hover:shadow-gold transition-all duration-500 overflow-hidden"
        style={{ width: centerSize, height: centerSize }}
      >
        {/* Subtle luxury inner hairline ring */}
        <div className="absolute inset-[3px] rounded-full border border-gold/20 pointer-events-none" />

        <ArrowUpRight
          size={arrowSize}
          strokeWidth={1.75}
          className="relative z-10 text-gold transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}
