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
      className={`overflow-hidden border border-[#dfb76c]/30 shadow-lift rounded-sm bg-[#3a1412] relative flex items-center justify-center ${className}`}
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
        <div className="flex flex-col items-center gap-2 p-6 text-center text-[#fcf9f2]">
          <MapPin size={26} className="text-[#dfb76c]" />
          <p className="font-display text-lg text-[#fcf9f2] font-medium tracking-tight">221, M.T. Cloth Market, Indore</p>
          <button
            type="button"
            onClick={() => setInView(true)}
            className="mt-2 text-xs uppercase tracking-wider bg-[#dfb76c] text-[#2b0c0a] font-semibold px-4 py-2 rounded-sm shadow-soft hover:bg-[#fcf9f2] hover:text-[#5a1f1c] transition-all active:scale-95 cursor-pointer"
          >
            Load Interactive Map
          </button>
        </div>
      )}
    </div>
  );
}
