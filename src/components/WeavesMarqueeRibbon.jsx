import React from 'react';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';

export default function WeavesMarqueeRibbon() {
  const settings = useSiteSettings();
  const rawItems = settings.marqueeRibbon?.items;
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : defaultSettings.marqueeRibbon.items;

  if (settings.marqueeRibbon?.enabled === false) {
    return null;
  }

  return (
    <div
      id="weaves-ribbon"
      className="relative overflow-hidden bg-sand-200/80 border-y border-gold/25 py-3 sm:py-3.5 select-none"
    >
      <div className="flex animate-marquee items-center gap-6 sm:gap-10">
        {/* First Loop */}
        {items.map((item, idx) => (
          <div key={`loop1-${idx}`} className="flex items-center gap-6 sm:gap-10 shrink-0">
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-primary/85 font-medium whitespace-nowrap">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" aria-hidden="true" />
          </div>
        ))}

        {/* Second Loop for seamless infinite loop */}
        {items.map((item, idx) => (
          <div key={`loop2-${idx}`} className="flex items-center gap-6 sm:gap-10 shrink-0">
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-primary/85 font-medium whitespace-nowrap">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
