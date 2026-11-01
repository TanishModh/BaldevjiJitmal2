import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function LazyMap({
  src,
  directionsUrl = 'https://maps.app.goo.gl/Rv2U7Fw3jMkcTBAx5',
  height = 320,
  title = 'Baldevji Jitmal — 221, M.T. Cloth Market, Indore',
  className = '',
}) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden border border-accent/30 shadow-lift rounded-sm bg-[#3a1412] relative flex items-center justify-center ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      {inView ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="w-full"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 p-6 text-center text-primary-foreground/75">
          <MapPin size={24} className="text-accent" />
          <p className="font-display text-lg text-primary-foreground">221, M.T. Cloth Market, Indore</p>
          <button
            type="button"
            onClick={() => setInView(true)}
            className="mt-2 text-xs uppercase tracking-wider text-accent border border-accent/40 px-3 py-1.5 rounded hover:bg-accent hover:text-primary transition active:scale-95 cursor-pointer"
          >
            Load Interactive Map
          </button>
        </div>
      )}
    </div>
  );
}
