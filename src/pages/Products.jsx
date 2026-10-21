import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProductCards } from '../hooks/useProductCards';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';
import { MotionFade, MotionBlurFade, MotionStagger, MotionItem } from '../components/MotionReveal';
import { getThumbnailImageUrl } from '../lib/imageOptimization';

export default function Products() {
  const { cards, isLoading } = useProductCards();
  const settings = useSiteSettings();
  const page = settings.productsPage || defaultSettings.productsPage;

  return (
    <section className="relative overflow-hidden bg-background pb-20 sm:pb-24">
      {/* Header Banner */}
      <div className="border-b border-border bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="max-w-4xl">
            <MotionFade delay={0.1}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium">
                {page.eyebrow || defaultSettings.productsPage.eyebrow}
              </p>
            </MotionFade>
            <MotionBlurFade delay={0.2}>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-primary mt-3 sm:mt-4 leading-[1.05]">
                {page.heading || defaultSettings.productsPage.heading}
              </h1>
            </MotionBlurFade>
            <MotionFade delay={0.3}>
              <div className="gold-divider my-4 sm:my-6 w-20 sm:w-24"></div>
              <p className="max-w-3xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {page.intro || defaultSettings.productsPage.intro}
              </p>
            </MotionFade>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        {isLoading ? (
          <p className="text-muted-foreground py-12">Loading collections…</p>
        ) : cards.length === 0 ? (
          <p className="text-muted-foreground py-12">
            No categories yet — add them from the admin panel.
          </p>
        ) : (
          <MotionStagger
            stagger={0.06}
            className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-6"
          >
            {cards.map((card) => (
              <MotionItem key={card.id}>
                <Link
                  to={`/gallery?category=${encodeURIComponent(card.categoryParam || '')}`}
                  className="group overflow-hidden border-b border-accent/40 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift active:scale-[0.99] flex flex-col rounded-sm h-full"
                >
                  <div className="aspect-[4/5] bg-secondary overflow-hidden relative">
                    {card.imageUrl ? (
                      <img
                        src={getThumbnailImageUrl(card.imageUrl)}
                        alt={card.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image yet
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  <div className="p-3 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h2 className="font-display text-lg sm:text-2xl text-primary leading-tight">
                        {card.name}
                      </h2>
                      <div className="gold-divider my-2.5 sm:my-3 w-12 sm:w-16"></div>
                      <p className="text-[11px] sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {card.description || 'Browse the catalogue for this collection.'}
                      </p>
                    </div>

                    <span className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.12em] text-primary font-medium">
                      <span>View catalogue</span>
                      <ArrowRight
                        size={13}
                        className="text-accent transition-transform group-hover:translate-x-1 duration-300"
                      />
                    </span>
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>
        )}
      </div>

      {/* Callout Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <MotionFade delay={0.15}>
          <div className="relative overflow-hidden border border-border bg-primary px-5 py-10 text-center text-primary-foreground sm:px-8 md:px-12 shadow-lift rounded-sm">
            <div
              className="absolute -right-4 -top-16 font-display text-[10rem] sm:text-[12rem] text-primary-foreground/5 select-none pointer-events-none"
              aria-hidden="true"
            >
              BJ
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-primary-foreground relative z-10">
              {page.calloutHeading || defaultSettings.productsPage.calloutHeading}
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-primary-foreground/75 relative z-10 max-w-xl mx-auto">
              {page.calloutBody || defaultSettings.productsPage.calloutBody}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10 w-full sm:w-auto">
              <Link
                to="/gallery"
                className="bg-accent text-accent-foreground min-h-12 inline-flex items-center justify-center px-6 text-xs uppercase tracking-[0.12em] font-medium hover:bg-primary-foreground transition shadow-soft rounded-sm active:scale-[0.99]"
              >
                {page.calloutPrimaryBtn || defaultSettings.productsPage.calloutPrimaryBtn}
              </Link>
              <Link
                to="/contact"
                className="border border-gold/50 text-primary-foreground min-h-12 inline-flex items-center justify-center px-6 text-xs uppercase tracking-[0.12em] hover:bg-gold/15 hover:border-gold transition rounded-sm active:scale-[0.99]"
              >
                {page.calloutSecondaryBtn || defaultSettings.productsPage.calloutSecondaryBtn}
              </Link>
            </div>
          </div>
        </MotionFade>
      </div>
    </section>
  );
}
