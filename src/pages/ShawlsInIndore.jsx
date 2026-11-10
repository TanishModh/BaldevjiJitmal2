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
  UserCheck
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { MotionFade } from '../components/MotionReveal';
import SEO from '../components/SEO';

export default function ShawlsInIndore() {
  const settings = useSiteSettings();
  const [openFaq, setOpenFaq] = useState(null);

  const phone = (settings.contact?.phone2 || '78698 49449').replace(/\D/g, '');
  const waNumber = phone.length === 10 ? `91${phone}` : phone;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Namaste Baldevji Jitmal, I am inquiring about shawls in Indore (Ladies & Gents). Please share your current winter & wedding collection with prices.'
  )}`;

  const ladiesShawls = [
    {
      title: 'Kashmiri Aari & Tilla Embroidery Shawls (कश्मीरी कढ़ाई शॉल)',
      desc: 'Intricate traditional floral jaal, paisley chinar, and metallic tilla needlework on fine wool. A prized heirloom choice for wedding brides, reception evenings, and festive celebrations across Indore.',
      details: 'Length: 2.0m to 2.25m · Soft Acro-Wool & Blended Cashmere Base',
      colors: 'Royal Maroon, Ruby Red, Emerald Green, Antique Gold, Navy Blue',
      categoryParam: 'Ladies Shawl',
    },
    {
      title: 'Pashmina-Touch Jacquard Woven Shawls (पश्मीना टच शॉल)',
      desc: 'Feather-light with high thermal warmth. Features reversible double-face jacquard weaving with subtle golden threads, suitable for formal evening dinners, winter marriages, and elite gifting.',
      details: 'Reversible Woven Patterns · Ultra-Soft Cashmere-Feel Hand',
      colors: 'Pearl Cream, Dusty Rose, Champagne, Wine & Charcoal',
      categoryParam: 'Ladies Shawl',
    },
    {
      title: 'Daily Winter Woollen Shawls & Stoles (दैनिक वॉर्म शॉल)',
      desc: 'Durable, warm, and easy to maintain. Designed for daily morning walks, winter office wear, and family gifting. Resists pilling and retains cozy softness throughout winter.',
      details: 'Full Comfort Wrap Dimensions · Wash-Friendly Blends',
      colors: 'Earth Tones, Camel, Coffee, Maroon & Multicolour Borders',
      categoryParam: 'Ladies Shawl',
    },
    {
      title: 'Wedding Gifting & Shagun Shawl Sets (विवाह शगुन शॉल)',
      desc: 'Curated wholesale bundles tailored for wedding bhath, maayra, and samdhan shagun distribution. Sourced directly from premier loom centers with elegant presentation packaging.',
      details: 'Assorted Sets of 10, 25, 50 & 100 Shawls with Custom Box Packing',
      colors: 'Auspicious Red, Festive Yellow, Rani Pink & Rich Maroon',
      categoryParam: 'Ladies Shawl',
    },
  ];

  const gentsShawls = [
    {
      title: 'Traditional Gents Lohis (जेंट्स लोई / गरम चादर)',
      desc: 'Understated, masculine woollen wraps crafted in timeless solid shades. Woven with broad selvedges and high thermal insulation, trusted by generations of men in central India.',
      details: 'Extra-Wide Dimensions (54” × 108”) for Full Body Wrap',
      colors: 'Natural Fawn, Camel, Off-White Cream, Steel Grey, Jet Black',
      categoryParam: 'Gents Shawl',
    },
    {
      title: 'Ceremonial Doshala & Wedding Stoles for Men (दोशाला / दूल्हा शॉल)',
      desc: 'Regal shoulder wraps for wedding grooms, fathers of the bride/groom, and ceremonial dignitaries. Features subtle self-embossed borders and rich woven motifs that pair with Sherwanis and Kurta-Pajamas.',
      details: 'Groom Special Doshala with Delicate Zari Border Accents',
      colors: 'Sandalwood Cream, Golden Fawn, Maroon & Deep Navy',
      categoryParam: 'Gents Shawl',
    },
    {
      title: 'Bhagalpuri All-Weather Gents Chaddars (भागलपुरी चादर)',
      desc: 'Authentic 100% spun cotton/tussar all-weather wraps. Soft, breathable, and comfortable across all four seasons. A quintessential wardrobe staple for men in MP and Rajasthan.',
      details: 'Pure Handloom Bhagalpuri Weave · Pre-Washed & Softened',
      colors: 'Classic Dull Gold, Natural Beige & Cream Check Borders',
      categoryParam: 'Bhagalpuri',
    },
    {
      title: 'Temple Trust & Elder Honorific Shawls (सम्मान शॉल / पूजा लोई)',
      desc: 'Dignified woollen shawls supplied in bulk to religious trusts, samajik sabhas, and institutions for felicitation ceremonies, temple priests, and senior community members.',
      details: 'Consistent Quality & Certified Warmth for Institutional Orders',
      colors: 'Traditional Saffron, Golden Cream, Maroon & Camel',
      categoryParam: 'Gents Shawl',
    },
  ];

  const faqs = [
    {
      q: 'Where can I find the best collection of ladies shawls in Indore?',
      a: 'Baldevji Jitmal at 221, M.T. Cloth Market, Indore, is renowned for its handpicked collection of ladies shawls, including Kashmiri Aari embroidery, pashmina-touch jacquards, winter wool stoles, and wedding shagun gifting shawls.',
    },
    {
      q: 'Where can I buy authentic gents shawls and lohis in Indore?',
      a: 'We offer one of Indore’s most comprehensive selections of gents lohis, masculine woollen wraps, ceremonial doshalas for grooms, and Bhagalpuri all-weather chaddars in classic shades like camel, fawn, cream, and charcoal.',
    },
    {
      q: 'Can we buy bulk shawls for wedding gift distribution in Indore?',
      a: 'Yes, absolutely. We specialize in wedding party gift bundles (for Maayra, Samdhan, and Shagun) in lots of 10, 25, 50, and 100+ pieces at wholesale rates, complete with matching gift presentation boxes.',
    },
    {
      q: 'What is the price range for shawls at Baldevji Jitmal Indore?',
      a: 'We cater to both wholesale and retail buyers. Our range starts from budget-friendly daily winter shawls and gift packs up to premium pure-wool and heavy embroidered heirloom shawls. Direct wholesale rates are available for shopkeepers and bulk family orders.',
    },
    {
      q: 'Do you deliver shawls outside Indore across Madhya Pradesh and India?',
      a: 'Yes. We provide safe, insured parcel dispatch via daily transport services across MP (Bhopal, Ujjain, Gwalior, Jabalpur, Sagar, Ratlam), Maharashtra, Rajasthan, and nationwide. Orders can be finalized directly over WhatsApp.',
    },
    {
      q: 'How do I visit the shop in M.T. Cloth Market, Indore?',
      a: 'We are located at 221, M.T. Cloth Market (Maharaja Tukojirao Cloth Market), Indore - 452002, near Sheetal Kulfi. Our store is open Monday through Saturday from 11:00 AM to 8:30 PM. Call us at 0731-2459280.',
    },
  ];

  return (
    <>
      <SEO
        title="Shawls in Indore — Ladies Shawls, Gents Shawls & Lohis Wholesale"
        description="Best collection of ladies shawls and gents shawls in Indore at 221, M.T. Cloth Market. Kashmiri embroidery, pashmina-touch, gents lohis & wedding gift sets at wholesale rates."
        keywords="shawls in indore, ladies shawls in indore, gents shawls in indore, pashmina shawl indore, winter shawls indore, gents lohi indore, kashmiri shawls indore, wedding shawls indore, M.T. cloth market shawls, baldevji jitmal shawls"
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
              <span>Heritage Shawl House · M.T. Cloth Market, Indore</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-tight font-normal">
              Shawls in Indore <span className="italic text-gold font-serif">। महिला एवं जेंट्स शॉल</span>
            </h1>
            <div className="gold-divider my-4 sm:my-6 w-24"></div>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-primary-foreground/90 leading-relaxed">
              Discover Indore’s finest destination for ladies embroidered shawls, luxurious pashmina-touch wraps, masculine gents lohis, and ceremonial wedding doshalas. Carefully curated for warmth, grandeur, and generational durability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-[#2b0c0a] px-6 py-3.5 rounded-sm text-xs uppercase tracking-[0.14em] font-semibold hover:bg-primary-foreground hover:text-primary transition-all duration-300 shadow-lift min-h-[44px]"
              >
                <MessageCircle size={16} />
                <span>Inquire on WhatsApp</span>
              </a>
              <Link
                to="/gallery?category=Ladies%20Shawl"
                className="inline-flex items-center gap-2 border border-gold/50 text-primary-foreground bg-black/20 px-6 py-3.5 rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-gold/15 hover:border-gold transition-all duration-300 backdrop-blur-sm min-h-[44px]"
              >
                <span>Browse Shawl Catalogue</span>
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
            <div className="flex flex-col items-center">
              <Heart className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">Ladies & Gents</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Dedicated Collections</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">Fine Wool Weaves</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">High Thermal Warmth</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">Wedding Gifting</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Shagun & Maayra Bundles</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">Wholesale Pricing</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Direct Dispatch Across MP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Ladies Shawls in Indore */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent font-medium">
              <Heart size={14} />
              <span>Dedicated Collection</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              Ladies Shawls in Indore (महिला शॉल संग्रह)
            </h2>
            <div className="gold-divider my-3 w-16"></div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore exquisite embroidered Kashmiri stoles, feather-light pashmina touch jacquards, and auspicious red bridal shawls for winter weddings and ceremonial occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ladiesShawls.map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-gold/30 p-6 rounded-sm shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gold font-mono mb-2">
                    <span>Ladies Selection 0{idx + 1}</span>
                    <Sparkles size={14} />
                  </div>
                  <h3 className="font-display text-2xl text-primary">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>

                  <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                    <div>
                      <span className="text-[11px] text-foreground font-medium uppercase tracking-wider">Specifications: </span>
                      <span className="text-xs text-muted-foreground font-mono">{item.details}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-foreground font-medium uppercase tracking-wider">Featured Shades: </span>
                      <span className="text-xs text-muted-foreground">{item.colors}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <Link
                    to={`/gallery?category=${encodeURIComponent(item.categoryParam)}`}
                    className="text-xs text-primary font-semibold hover:text-accent transition inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Designs</span>
                    <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Namaste Baldevji Jitmal, I am interested in ${item.title} from your Indore ladies shawl collection. Please share designs and wholesale rates.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] bg-[#128c7e]/10 text-[#128c7e] hover:bg-[#128c7e]/20 px-3 py-1 rounded font-medium transition"
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
      <section className="py-14 sm:py-20 bg-sand-200/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-accent font-medium">
              <UserCheck size={14} />
              <span>Masculine Heritage Wraps</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              Gents Shawls & Lohis in Indore (जेंट्स शॉल एवं लोई)
            </h2>
            <div className="gold-divider my-3 w-16"></div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              A comprehensive collection of classic woollen lohis, formal wedding doshalas, and all-weather Bhagalpuri chaddars tailored for discerning gentlemen and community elders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gentsShawls.map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-gold/30 p-6 rounded-sm shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gold font-mono mb-2">
                    <span>Gents Selection 0{idx + 1}</span>
                    <Sparkles size={14} />
                  </div>
                  <h3 className="font-display text-2xl text-primary">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>

                  <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                    <div>
                      <span className="text-[11px] text-foreground font-medium uppercase tracking-wider">Specifications: </span>
                      <span className="text-xs text-muted-foreground font-mono">{item.details}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-foreground font-medium uppercase tracking-wider">Available Shades: </span>
                      <span className="text-xs text-muted-foreground">{item.colors}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <Link
                    to={`/gallery?category=${encodeURIComponent(item.categoryParam)}`}
                    className="text-xs text-primary font-semibold hover:text-accent transition inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Designs</span>
                    <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Namaste Baldevji Jitmal, I am inquiring about ${item.title} from your Indore gents shawl collection. Please share available pieces.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] bg-[#128c7e]/10 text-[#128c7e] hover:bg-[#128c7e]/20 px-3 py-1 rounded font-medium transition"
                  >
                    WhatsApp Inquire
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Bulk Gifting Guide */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gold/40 bg-sand-200/50 p-6 sm:p-10 rounded-sm">
            <h3 className="font-display text-2xl sm:text-3xl text-primary">
              Wholesale & Wedding Shagun Bulk Gifting in Indore
            </h3>
            <div className="gold-divider my-3 w-16"></div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
              For families preparing for winter weddings, festivals, or spiritual gatherings in Indore, we supply coordinated shawl gift boxes in lots of 10, 25, 50, and 100+ pieces. Each piece is individually inspected for flawless weaving, neatly folded, and presented in high-grade ceremonial packing.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-card p-4 rounded-sm border border-border">
                <p className="font-display text-lg text-primary font-medium">Maayra & Shagun</p>
                <p className="text-xs text-muted-foreground mt-1">Festive red, rani & maroon embroidered shawls</p>
              </div>
              <div className="bg-card p-4 rounded-sm border border-border">
                <p className="font-display text-lg text-primary font-medium">Samdhi & Dignitaries</p>
                <p className="text-xs text-muted-foreground mt-1">Regal gents lohis & cashmere-touch wraps</p>
              </div>
              <div className="bg-card p-4 rounded-sm border border-border">
                <p className="font-display text-lg text-primary font-medium">Retail Store Bales</p>
                <p className="text-xs text-muted-foreground mt-1">Direct mill wholesale packs for textile shops</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-14 sm:py-20 bg-sand-200/40 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">Buyer Knowledge</p>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">
              Frequently Asked Questions About Shawls in Indore
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
              Visit Baldevji Jitmal — Shawls in M.T. Cloth Market, Indore
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 mt-2 max-w-2xl mx-auto leading-relaxed">
              Experience the softness and grandeur of authentic Kashmiri embroidery and warm gents lohis in person at our Indore heritage showroom.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm font-mono text-gold">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} /> 221, M.T. Cloth Market, Indore - 452002
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Phone size={16} /> 0731-2459280 / +91 78698 49449
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
                href="tel:07312459280"
                className="inline-flex items-center gap-2 border border-gold/50 text-primary-foreground px-6 py-3 rounded-sm text-xs uppercase tracking-wider hover:bg-gold/15 transition min-h-[44px]"
              >
                <Phone size={15} className="text-gold" />
                <span>Call Store (0731-2459280)</span>
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