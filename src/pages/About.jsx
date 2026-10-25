import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';
import { MotionFade, MotionBlurFade } from '../components/MotionReveal';
import GoogleRatingBadge from '../components/GoogleRatingBadge';

export default function About() {
  const settings = useSiteSettings();
  const about = settings.about || defaultSettings.about;
  const paragraphs = Array.isArray(about.paragraphs) && about.paragraphs.length > 0
    ? about.paragraphs
    : defaultSettings.about.paragraphs;

  return (
    <section className="overflow-hidden bg-background">
      <div className="grid min-h-[78svh] lg:grid-cols-[.9fr_1.1fr]">
        {/* Story Text */}
        <div className="order-2 flex items-center px-5 sm:px-8 py-10 sm:py-14 lg:order-1 lg:px-14 xl:px-24">
          <div className="max-w-xl">
            <MotionFade delay={0.1}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium">
                {about.eyebrow || defaultSettings.about.eyebrow}
              </p>
            </MotionFade>
            <MotionBlurFade delay={0.2}>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-primary mt-3 sm:mt-4 leading-[1.05]">
                {about.heading || defaultSettings.about.heading}
              </h1>
            </MotionBlurFade>
            <MotionFade delay={0.3}>
              <div className="gold-divider my-5 sm:my-7 w-20 sm:w-24"></div>
            </MotionFade>

            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}

              <div className="pt-3 sm:pt-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center border border-primary bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-accent hover:text-accent-foreground shadow-soft active:scale-[0.99] rounded-sm"
                >
                  {about.ctaLabel || defaultSettings.about.ctaLabel}
                </Link>
              </div>

              {/* Google Reviews & Heritage Rating Badge */}
              <MotionFade delay={0.4}>
                <GoogleRatingBadge className="mt-6 sm:mt-8" />
              </MotionFade>
            </div>
          </div>
        </div>

        {/* Feature Image */}
        <div className="relative order-1 min-h-[34svh] sm:min-h-[45svh] overflow-hidden lg:order-2 lg:min-h-full">
          <img
            src={about.featureImageUrl || defaultSettings.about.featureImageUrl}
            alt="Traditional Indian textiles at Baldevji Jitmal"
            width={1600}
            height={1100}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover animate-cinematic"
          />
          {/* Subtle soft vignette */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/65 via-primary/20 to-transparent pointer-events-none"
            aria-hidden="true"
          ></div>
          <div className="absolute bottom-0 left-0 bg-primary/95 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 font-display text-lg sm:text-2xl italic text-primary-foreground shadow-lift">
            {about.featureImageCaption || defaultSettings.about.featureImageCaption}
          </div>
        </div>
      </div>
    </section>
  );
}
