import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';
import { MotionFade, MotionBlurFade } from './MotionReveal';

export default function EditorialStatement() {
  const settings = useSiteSettings();
  const editorial = settings.editorial || defaultSettings.editorial;
  const chapters = Array.isArray(editorial.chapters) && editorial.chapters.length > 0
    ? editorial.chapters
    : defaultSettings.editorial.chapters;

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 md:py-36 border-t border-border/50">
      {/* Background Watermark Crest */}
      <div
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-display text-[14rem] sm:text-[22rem] leading-none text-primary/[0.02] select-none"
        aria-hidden="true"
      >
        BJ
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Statement Header */}
        <div className="max-w-4xl mx-auto text-center">
          <MotionFade delay={0.05}>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-accent font-medium">
              {editorial.eyebrow || defaultSettings.editorial.eyebrow}
            </p>
          </MotionFade>

          {/* Signature De-Blur Veil Reveal */}
          <MotionBlurFade delay={0.15} className="mt-4 sm:mt-5">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary leading-[1.08] tracking-tight">
              {editorial.heading || defaultSettings.editorial.heading}{' '}
              {editorial.headingAccent && (
                <span className="italic text-accent">{editorial.headingAccent}</span>
              )}
            </h2>
          </MotionBlurFade>

          <MotionFade delay={0.25}>
            <div className="gold-divider mx-auto my-6 sm:my-8 w-24"></div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {editorial.body || defaultSettings.editorial.body}
            </p>
          </MotionFade>
        </div>

        {/* Editorial Split Section */}
        <div className="mt-14 sm:mt-20 grid lg:grid-cols-[1.1fr_.9fr] gap-8 lg:gap-14 items-center">
          {/* Left: Atmospheric Photography with Agnes Scrim */}
          <MotionFade delay={0.2} className="relative overflow-hidden rounded-sm shadow-lift group">
            <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden relative bg-primary">
              <img
                src={editorial.featureImageUrl || settings.hero.heroImageUrl || '/assets/hero-textiles-CKsuSuq6.jpg'}
                alt="Traditional Indian textiles curated by Baldevji Jitmal"
                loading="lazy"
                width={1600}
                height={1100}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-primary-foreground flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium mb-1">
                  {editorial.featureCaptionEyebrow || 'Atelier Curation'}
                </span>
                <p className="font-display text-xl sm:text-2xl text-sand-100 italic">
                  {editorial.featureQuote || '“Traditional cloth, thoughtfully selected for wedding ceremonies & family heirlooms.”'}
                </p>
              </div>
            </div>
          </MotionFade>

          {/* Right: The Chapters / Pillars */}
          <div className="space-y-6 sm:space-y-8 divide-y divide-border/50">
            {chapters.map((ch, idx) => (
              <MotionFade key={ch.num || idx} delay={0.25 + idx * 0.1} className={idx > 0 ? 'pt-6 sm:pt-8' : ''}>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold pt-1 shrink-0">
                    {ch.num || String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-primary leading-snug">
                      {ch.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {ch.desc}
                    </p>
                  </div>
                </div>
              </MotionFade>
            ))}

            <div className="pt-6 sm:pt-8">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2.5 text-primary border-b border-gold pb-1 text-xs uppercase tracking-[0.16em] font-medium transition-all hover:gap-4 hover:border-primary"
              >
                <span>{editorial.ctaLabel || 'Read Our Full Story'}</span>
                <ArrowRight size={14} className="text-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
