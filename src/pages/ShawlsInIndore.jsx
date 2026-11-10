import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Store,
  Truck,
  Award,
  Heart,
  UserCheck,
} from 'lucide-react';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';
import { MotionFade } from '../components/MotionReveal';
import SEO from '../components/SEO';

const BADGE_ICONS = [Heart, ShieldCheck, Award, Truck];

export default function ShawlsInIndore() {
  const settings = useSiteSettings();
  const shawls = settings.shawlsPage || defaultSettings.shawlsPage;
  const [openFaq, setOpenFaq] = useState(null);

  const phone = (settings.contact?.phone2 || '78698 49449').replace(/\D/g, '');
  const waNumber = phone.length === 10 ? `91${phone}` : phone;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Namaste Baldevji Jitmal, I am inquiring about shawls in Indore (Ladies & Gents). Please share your current winter & wedding collection with prices.'
  )}`;

  const hero = shawls.hero || defaultSettings.shawlsPage.hero;
  const badges = Array.isArray(shawls.badges) && shawls.badges.length > 0 ? shawls.badges : defaultSettings.shawlsPage.badges;
  const ladiesHeader = shawls.ladiesHeader || defaultSettings.shawlsPage.ladiesHeader;
  const ladiesShawls = Array.isArray(shawls.ladiesShawls) && shawls.ladiesShawls.length > 0 ? shawls.ladiesShawls : defaultSettings.shawlsPage.ladiesShawls;
  const gentsHeader = shawls.gentsHeader || defaultSettings.shawlsPage.gentsHeader;
  const gentsShawls = Array.isArray(shawls.gentsShawls) && shawls.gentsShawls.length > 0 ? shawls.gentsShawls : defaultSettings.shawlsPage.gentsShawls;
  const guideHeader = shawls.guideHeader || defaultSettings.shawlsPage.guideHeader;
  const guideItems = Array.isArray(shawls.guideItems) && shawls.guideItems.length > 0 ? shawls.guideItems : defaultSettings.shawlsPage.guideItems;
  const faqsHeader = shawls.faqsHeader || defaultSettings.shawlsPage.faqsHeader;
  const faqs = Array.isArray(shawls.faqs) && shawls.faqs.length > 0 ? shawls.faqs : defaultSettings.shawlsPage.faqs;
  const storeCard = shawls.storeCard || defaultSettings.shawlsPage.storeCard;
  const seo = shawls.seo || defaultSettings.shawlsPage.seo;

  return (
    <>
      <SEO
        title={seo.title || defaultSettings.shawlsPage.seo.title}
        description={seo.description || defaultSettings.shawlsPage.seo.description}
        keywords={seo.keywords || defaultSettings.shawlsPage.seo.keywords}
        canonical="https://www.baldevjijitmal.in/shawls-in-indore"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/products' },
          { name: 'Shawls in Indore', url: '/shawls-in-indore' },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 sm:py-20 lg:py-24 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionFade>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold font-medium mb-3">
              <Store size={15} />
              <span>{hero.eyebrow}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-tight font-normal">
              {hero.title} {hero.titleAccent && <span className="italic text-gold font-serif">{hero.titleAccent}</span>}
            </h1>
            <div className="gold-divider my-4 sm:my-6 w-24"></div>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-primary-foreground/90 leading-relaxed">
              {hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-[#2b0c0a] px-6 py-3.5 rounded-sm text-xs uppercase tracking-[0.14em] font-semibold hover:bg-primary-foreground hover:text-primary transition-all duration-300 shadow-lift min-h-[44px]"
              >
                <MessageCircle size={16} />
                <span>{hero.ctaWhatsapp || 'Inquire on WhatsApp'}</span>
              </a>
              <Link
                to="/gallery?category=Ladies%20Shawl"
                className="inline-flex items-center gap-2 border border-gold/50 text-primary-foreground bg-black/20 px-6 py-3.5 rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-gold/15 hover:border-gold transition-all duration-300 backdrop-blur-sm min-h-[44px]"
              >
                <span>{hero.ctaCatalogue || 'Browse Shawl Catalogue'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </MotionFade>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-sand-200/50 border-b border-border py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {badges.map((b, idx) => {
              const Icon = BADGE_ICONS[idx % BADGE_ICONS.length];
              return (
                <div key={idx} className="flex flex-col items-center">
                  <Icon className="text-gold mb-1.5" size={24} />
                  <p className="font-display text-xl sm:text-2xl text-primary font-medium">{b.title}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{b.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 1: Ladies Shawls in Indore */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent font-medium">
              <Heart size={14} />
              <span>{ladiesHeader.eyebrow}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              {ladiesHeader.heading}
            </h2>
            <div className="gold-divider my-3 w-16"></div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {ladiesHeader.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ladiesShawls.map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-gold/30 p-5 sm:p-7 rounded-sm shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gold font-mono mb-2">
                    <span>Collection Item 0{idx + 1}</span>
                    <Sparkles size={14} />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-primary">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">{item.desc}</p>

                  {item.details && (
                    <div className="my-3 py-2 border-y border-border/40 text-xs text-foreground/80 font-medium">
                      {item.details}
                    </div>
                  )}

                  {item.colors && (
                    <p className="text-[11px] text-accent font-medium mt-2">
                      <span className="text-muted-foreground font-normal">Available Tones: </span>
                      {item.colors}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                  <Link
                    to={`/gallery?category=${encodeURIComponent(item.categoryParam || 'Ladies Shawl')}`}
                    className="text-xs text-primary font-semibold hover:text-accent transition inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Designs</span>
                    <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Namaste Baldevji Jitmal, I am interested in ${item.title} from your Indore ladies shawl collection. Please share rates and shade card.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] bg-[#128c7e]/10 text-[#128c7e] hover:bg-[#128c7e]/20 px-2.5 py-1 rounded font-medium transition"
                  >
                    WhatsApp Inquire
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Gents Shawls & Lohis in Indore */}
      <section className="py-14 sm:py-20 bg-sand-200/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent font-medium">
              <UserCheck size={14} />
              <span>{gentsHeader.eyebrow}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              {gentsHeader.heading}
            </h2>
            <div className="gold-divider my-3 w-16"></div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {gentsHeader.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gentsShawls.map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-gold/30 p-5 sm:p-7 rounded-sm shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gold font-mono mb-2">
                    <span>Gents Edition 0{idx + 1}</span>
                    <Sparkles size={14} />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-primary">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">{item.desc}</p>

                  {item.details && (
                    <div className="my-3 py-2 border-y border-border/40 text-xs text-foreground/80 font-medium">
                      {item.details}
                    </div>
                  )}

                  {item.colors && (
                    <p className="text-[11px] text-accent font-medium mt-2">
                      <span className="text-muted-foreground font-normal">Classic Shades: </span>
                      {item.colors}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                  <Link
                    to={`/gallery?category=${encodeURIComponent(item.categoryParam || 'Gents Shawl')}`}
                    className="text-xs text-primary font-semibold hover:text-accent transition inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Designs</span>
                    <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Namaste Baldevji Jitmal, I am interested in ${item.title} from your Indore gents shawl collection. Please share rates and photos.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] bg-[#128c7e]/10 text-[#128c7e] hover:bg-[#128c7e]/20 px-2.5 py-1 rounded font-medium transition"
                  >
                    WhatsApp Inquire
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide: Choosing Shawls & Lohis */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">{guideHeader.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              {guideHeader.heading}
            </h2>
            <div className="gold-divider my-3 w-20 mx-auto"></div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {guideHeader.description}
            </p>
          </div>

          <div className="space-y-6">
            {guideItems.map((g, idx) => (
              <div key={idx} className="bg-card p-5 sm:p-7 rounded-sm border border-gold/30 shadow-soft">
                <h3 className="font-display text-xl text-primary flex items-center gap-2">
                  <span className="text-gold font-mono text-sm">0{idx + 1}.</span> {g.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-14 sm:py-20 bg-sand-200/40 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">{faqsHeader.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">
              {faqsHeader.heading}
            </h2>
            <div className="gold-divider my-3 w-16 mx-auto"></div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-border/70 rounded-sm bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-sm sm:text-base font-medium text-foreground hover:text-primary transition min-h-[48px]"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-accent shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-muted-foreground border-t border-border/40 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Store Location & Direct Contact Card */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gold/40 p-6 sm:p-10 rounded-sm bg-black/20 text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-gold font-normal">
              {storeCard.heading}
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 mt-2 max-w-2xl mx-auto leading-relaxed">
              {storeCard.subtitle}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm font-mono text-gold">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} /> {settings.contact?.address || '221, M.T. Cloth Market, Indore - 452002'}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Phone size={16} /> {settings.contact?.phone1 || '0731-2459280'} / {settings.contact?.phone2 || '+91 78698 49449'}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#17523f] text-[#fcf9f2] px-6 py-3 rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#124233] transition min-h-[44px]"
              >
                <MessageCircle size={16} className="text-[#34d399]" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${(settings.contact?.phone1 || '07312459280').replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 border border-gold/50 text-primary-foreground px-6 py-3 rounded-sm text-xs uppercase tracking-wider hover:bg-gold/15 transition min-h-[44px]"
              >
                <Phone size={15} className="text-gold" />
                <span>Call Store ({settings.contact?.phone1 || '0731-2459280'})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          }),
        }}
      />
    </>
  );
}
