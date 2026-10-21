import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Clock, ArrowRight, MapPin, Phone, Instagram, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { useProductCards } from '../hooks/useProductCards';
import HeritagePillars from '../components/HeritagePillars';
import OrderingFaq from '../components/OrderingFaq';
import HeroScrollIndicator from '../components/HeroScrollIndicator';
import WeavesMarqueeRibbon from '../components/WeavesMarqueeRibbon';
import RotatingHeritageSeal from '../components/RotatingHeritageSeal';
import EditorialStatement from '../components/EditorialStatement';
import { MotionFade, MotionBlurFade, MotionStagger, MotionItem } from '../components/MotionReveal';

function AnimatedCounter({ value, delay = 0 }) {
  const parsed = useMemo(() => {
    const match = String(value).match(/^(\d+)(.*)$/);
    return match ? { target: parseInt(match[1], 10), suffix: match[2] } : null;
  }, [value]);

  const [displayValue, setDisplayValue] = useState(parsed ? '0' : value);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!parsed || !elementRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(String(parsed.target));
      return;
    }

    const node = elementRef.current;
    let animId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();

        const startTime = performance.now() + delay;
        const duration = 1200;

        const updateFrame = (currentTime) => {
          const progress = Math.min(Math.max((currentTime - startTime) / duration, 0), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(String(Math.round(parsed.target * eased)));
          if (progress < 1) {
            animId = requestAnimationFrame(updateFrame);
          }
        };

        animId = requestAnimationFrame(updateFrame);
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [parsed, delay]);

  if (!parsed) return <span ref={elementRef}>{value}</span>;

  return (
    <span ref={elementRef}>
      {displayValue}
      <span className="text-gold">{parsed.suffix}</span>
    </span>
  );
}

export default function Home() {
  const settings = useSiteSettings();
  const { cards } = useProductCards();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const stats = [
    {
      icon: Store,
      label: settings.stats?.stat1Label || 'Product ranges',
      value: settings.stats?.stat1Value || `${Math.max(cards.length, 6)}+`,
    },
    {
      icon: Clock,
      label: settings.stats?.stat2Label || 'Years of trust',
      value: settings.stats?.stat2Value || '90+',
    },
  ];

  const phone = (settings.contact.phone2 || '78280 72394').replace(/\D/g, '');
  const waNumber = phone.length === 10 ? `91${phone}` : phone;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    settings.hero.whatsappMessage ||
      'Namaste Baldevji Jitmal, I would like to inquire about your traditional textile collection. Please share current designs.'
  )}`;

  // Subtle ambient mouse spotlight in hero - disabled on coarse touch pointers
  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      {/* Hero Section with Mobile-First Fluid Centering & Cinematic Visuals */}
      <section
        onMouseMove={handleMouseMove}
        className="relative min-h-[calc(100svh-4.5rem)] md:min-h-[calc(100svh-6rem)] overflow-hidden bg-primary flex items-center"
      >
        {/* Cinematic Drifting Textile Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={settings.hero.heroImageUrl || '/assets/hero-textiles-CKsuSuq6.jpg'}
            alt="Traditional Indian textiles in the Baldevji Jitmal collection"
            width={1600}
            height={1100}
            fetchPriority="high"
            className="h-full w-full object-cover animate-cinematic opacity-85"
          />
        </div>

        {/* Deep Maroon Rich Filter Overlay (Responsive top-to-bottom on mobile, left-to-right on desktop) */}
        <div className="hero-maroon-overlay"></div>

        {/* Subtle Ambient Golden Spotlight tracking mouse (desktop only) */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-60 hidden md:block"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(178, 131, 66, 0.14), transparent 70%)`,
          }}
        />

        {/* Main Content with Mobile-First Staggered Motion */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 py-10 sm:py-16 md:py-20 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-primary-foreground"
          >
            {/* Top Badge */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold font-medium"
            >
              {settings.hero.badge || 'Traditional Textiles · Indore · Est. 1937'}
            </motion.p>

            {/* H1 Heading - Agnes Toth signature de-blur reveal */}
            <MotionBlurFade delay={0.16}>
              <h1 className="mt-3 sm:mt-4 font-display text-4xl sm:text-6xl md:text-8xl leading-[1.04] text-primary-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                {settings.brand.name?.trim() || 'Baldevji Jitmal'}
              </h1>
            </MotionBlurFade>

            {/* Elegant Line Draw (Hanson Wu inspired smooth scaleX expansion) */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.215, 0.61, 0.355, 1] }}
              className="my-4 sm:my-6 h-px w-20 sm:w-24 bg-gold origin-left"
            />

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="max-w-2xl font-display text-xl sm:text-2xl md:text-4xl italic leading-snug text-primary-foreground/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
            >
              {settings.hero.subheading}
            </motion.p>

            {/* Intro text */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-3 sm:mt-5 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-primary-foreground/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
            >
              {settings.hero.intro}
            </motion.p>

            {/* Mobile-Friendly Full-Touch Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
            >
              <Link
                to="/products"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 bg-gold px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-all duration-300 hover:bg-primary-foreground shadow-lift rounded-sm active:scale-[0.98]"
              >
                <span>{settings.hero.ctaPrimaryLabel || 'Explore Collections'}</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-gold/40 bg-black/20 px-6 text-xs uppercase tracking-[0.14em] text-primary-foreground transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold backdrop-blur-sm rounded-sm active:scale-[0.98]"
              >
                {settings.hero.ctaSecondaryLabel || 'Plan a Visit'}
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-gold/30 bg-[#17523f]/85 px-5 text-xs uppercase tracking-[0.14em] text-[#fcf9f2] hover:bg-[#17523f] transition-all duration-300 backdrop-blur-sm rounded-sm active:scale-[0.98]"
              >
                <MessageCircle size={15} className="text-[#34d399]" />
                <span>{settings.hero.whatsappCtaLabel || 'Direct WhatsApp'}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Hanson Wu Inspired Elegant Scroll Indicator */}
        <HeroScrollIndicator />
      </section>

      {/* Hanson Wu Inspired Running Marquee Ribbon */}
      <WeavesMarqueeRibbon />

      {/* Understated Stats Section (Dignified & Architectural) */}
      <section className="bg-background py-10 sm:py-16 md:py-20 border-b border-border/40">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:gap-6 px-4 sm:px-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <MotionFade
                key={stat.label}
                delay={idx * 0.1}
                className="border-b border-gold/30 bg-card p-4 sm:p-6 md:p-8 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift rounded-sm group"
              >
                <Icon
                  size={18}
                  className="text-gold transition-colors duration-300 group-hover:text-primary"
                />
                <p className="mt-2.5 font-display text-3xl sm:text-4xl md:text-5xl leading-none text-primary">
                  <AnimatedCounter value={stat.value} delay={idx * 150} />
                </p>
                <div className="gold-divider my-2.5 sm:my-3 w-8 sm:w-10 transition-all duration-300 ease-out group-hover:w-14"></div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </p>
              </MotionFade>
            );
          })}
        </div>
      </section>

      {/* Heritage & Values Pillars */}
      <HeritagePillars />

      {/* Curated Traditional Textiles Collection with Stagger Reveal & Hanson Wu Spinning Seal */}
      <section className="relative overflow-hidden bg-sand-200/50 py-16 sm:py-20 md:py-28 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFade className="grid items-end gap-4 md:gap-6 md:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                {settings.homeCollections?.eyebrow || 'Curated Collections'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-primary mt-2 sm:mt-3 leading-tight">
                {settings.homeCollections?.heading || 'A world of traditional Indian weaves'}
              </h2>
              <div className="gold-divider mt-3 sm:mt-4 w-20 sm:w-24"></div>
            </div>

            {/* Hanson Wu Spinning Typographic Seal */}
            <div className="flex items-center gap-4 justify-between md:justify-end">
              <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground hidden sm:block">
                {settings.homeCollections?.description ||
                  'Explore by collection. Every piece reflects generations of authentic textile craftsmanship.'}
              </p>
              <RotatingHeritageSeal to="/gallery" size={92} className="shrink-0" />
            </div>
          </MotionFade>

          <MotionStagger
            stagger={0.06}
            delay={0.08}
            className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {cards.map((card, idx) => (
              <MotionItem key={card.id}>
                <Link
                  to={card.categoryParam ? `/gallery?category=${encodeURIComponent(card.categoryParam)}` : '/gallery'}
                  className="group relative overflow-hidden border-b border-gold/30 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift active:scale-[0.99] rounded-sm flex flex-col h-full"
                >
                  {/* Hanson Wu Inspired Curtain Zoom-Settle Image Reveal */}
                  <div className="aspect-[4/5] overflow-hidden relative bg-secondary">
                    <motion.div
                      initial={{ scale: 1.12 }}
                      whileInView={{ scale: 1.0 }}
                      viewport={{ once: true, margin: '0px 0px -20px 0px' }}
                      transition={{ duration: 1.1, ease: [0.165, 0.84, 0.44, 1] }}
                      className="w-full h-full"
                    >
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          loading="lazy"
                          width={1024}
                          height={1024}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </motion.div>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-75"
                      aria-hidden="true"
                    ></div>
                    <span className="absolute left-2.5 top-2.5 text-[9px] sm:text-[10px] tracking-[0.16em] text-primary-foreground/90 font-mono bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-display text-base sm:text-xl md:text-2xl text-primary flex items-start justify-between gap-1 leading-tight">
                        <span className="truncate">{card.name}</span>
                        <ArrowRight
                          size={13}
                          className="shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </h3>
                      <div className="gold-divider my-2 sm:my-2.5 w-7 transition-all duration-300 group-hover:w-12"></div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 border-b border-primary/30 pb-0.5 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.14em] text-primary transition-colors group-hover:border-primary">
                      View catalogue
                    </div>
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>

          <MotionFade delay={0.15} className="mt-10 sm:mt-12 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-primary border-b border-gold pb-1 hover:gap-3 transition-all duration-300 font-medium text-xs sm:text-sm tracking-wider uppercase"
            >
              {settings.homeCollections?.viewAllBtn || 'View all collections'}{' '}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </MotionFade>
        </div>
      </section>

      {/* Agnes Toth Inspired Editorial Manifesto & Split Section */}
      <EditorialStatement />

      {/* Frequently Asked Questions */}
      <OrderingFaq />

      {/* Storefront / Visit Us Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-sand-200/60 border-t border-border/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFade className="max-w-2xl">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              {settings.shop.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2 sm:mt-3">
              {settings.shop.heading}
            </h2>
            <div className="gold-divider mt-3 sm:mt-4 w-20 sm:w-24"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              {settings.shop.body}
            </p>
          </MotionFade>

          <MotionFade delay={0.15} className="mt-8 sm:mt-12 grid md:grid-cols-[1.15fr_.85fr] gap-4 md:gap-8">
            <figure className="group relative overflow-hidden shadow-soft hover:shadow-lift transition-all duration-500 rounded-sm">
              <motion.div
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: [0.165, 0.84, 0.44, 1] }}
                className="w-full h-64 sm:h-80 md:h-[34rem]"
              >
                <img
                  src={settings.shop.photo1Url || '/assets/shop-exterior-1-Y8qJ9GsL.png'}
                  alt={settings.shop.photo1Caption || 'The storefront'}
                  loading="lazy"
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </motion.div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent text-background p-4 sm:p-6">
                <p className="font-display text-lg sm:text-xl">{settings.shop.photo1Caption}</p>
                {settings.shop.photo1Sub && (
                  <p className="text-xs tracking-wide opacity-85 mt-1">{settings.shop.photo1Sub}</p>
                )}
              </figcaption>
            </figure>

            <figure className="group relative overflow-hidden shadow-soft hover:shadow-lift transition-all duration-500 md:mt-16 rounded-sm">
              <motion.div
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: [0.165, 0.84, 0.44, 1] }}
                className="w-full h-64 sm:h-80 md:h-[28rem]"
              >
                <img
                  src={settings.shop.photo2Url || '/assets/shop-exterior-2-B3lADtzs.png'}
                  alt={settings.shop.photo2Caption || 'A glimpse of the collection'}
                  loading="lazy"
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </motion.div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent text-background p-4 sm:p-6">
                <p className="font-display text-lg sm:text-xl">{settings.shop.photo2Caption}</p>
                {settings.shop.photo2Sub && (
                  <p className="text-xs tracking-wide opacity-85 mt-1">{settings.shop.photo2Sub}</p>
                )}
              </figcaption>
            </figure>
          </MotionFade>

          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center">
            <a
              href={settings.contact.mapDirectionsUrl || 'https://maps.app.goo.gl/Rv2U7Fw3jMkcTBAx5'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-3 rounded-sm text-xs sm:text-sm tracking-wide shadow-soft hover:bg-primary/90 transition-all duration-300"
            >
              <MapPin size={14} /> {settings.shop?.directionsBtn || 'Get directions'}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-primary text-primary px-5 sm:px-6 py-3 rounded-sm text-xs sm:text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {settings.shop?.contactBtn || 'Contact the shop'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
