import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  ChevronDown,
  Store,
  Clock,
  Truck,
  Award
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { MotionFade, MotionBlurFade, MotionStagger, MotionItem } from '../components/MotionReveal';
import SEO from '../components/SEO';

export default function DhotisInIndore() {
  const settings = useSiteSettings();
  const [openFaq, setOpenFaq] = useState(null);

  const phone = (settings.contact?.phone2 || '78698 49449').replace(/\D/g, '');
  const waNumber = phone.length === 10 ? `91${phone}` : phone;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Namaste Baldevji Jitmal, I am looking for dhotis in Indore. Please share your current wholesale and retail collection with designs and rates.'
  )}`;

  const dhotiCategories = [
    {
      title: 'Pure Cotton Dhotis (शुद्ध सूती धोती)',
      subtitle: '80s, 100s & 120s High-Count Breathable Cotton',
      desc: 'Woven from premium combed cotton yarns for all-day comfort during long rituals, temple ceremonies, and daily spiritual wear. Softens with every wash, skin-friendly, and highly absorbent in central India’s climate.',
      sizes: '2.5 Metres (Single) · 4.0 Metres · 4.5 Metres',
      features: ['100% Breathable Fine Combed Cotton', 'Auspicious Off-White / Natural Cream Shade', 'Pre-Shrunk & Colorfast Border Options'],
      categoryParam: 'Dhotis',
    },
    {
      title: 'Temple & Zari Border Dhotis (मंदिर बॉर्डर धोती)',
      subtitle: 'Ganga-Jamuna, Mayilpeel & Traditional Kasavu Patterns',
      desc: 'Heritage temple borders crafted with gold zari and dual-tone threads. Widely chosen for weddings, Griha Pravesh, Upanayanam (Janeu sanskar), and festive functions across Madhya Pradesh and Maharashtra.',
      sizes: '4.0 Metres · 8.0 Metres (Double Dhoti / Panchakacham)',
      features: ['Woven Zari & Thread Borders', 'Matching Angavastram / Dupatta Available', 'Auspicious Red, Maroon, Green & Gold Borders'],
      categoryParam: 'Dhotis',
    },
    {
      title: 'Panchakacham & Double Dhotis (पंचकच्छम / 9×5 धोती)',
      subtitle: 'Traditional 8 & 9-Yard Dhotis for Vedic Rituals & Weddings',
      desc: 'Full-length traditional double dhotis woven specifically for South Indian and Maharashtrian style Panchakacham tying. Accompanied by coordinated broad-border shawls/dupattas.',
      sizes: '8 Metres (Double) · 9×5 Sets with Uthareeyam',
      features: ['Extra Width & Length for Traditional Draping', 'Non-Slip Heavy Handloom Finish', 'Groom & Temple Priest Preferred'],
      categoryParam: 'Dhotis',
    },
    {
      title: 'Readymade & Velcro Dhotis (रेडीमेड वेल्क्रो धोती)',
      subtitle: 'Pre-Pleated Universal Free-Size Festive Wear',
      desc: 'Expertly pre-stitched traditional dhotis with an adjustable velcro waistband and concealed utility pocket. Gives the authentic, regal traditional look within 30 seconds without draping complexity.',
      sizes: 'Universal Adjustable Waist (28” to 44”) · Matching Dupatta',
      features: ['Concealed Pocket for Phone & Wallet', 'Strong Double-Stitched Grip', '100% Traditional Cotton & Silk Look'],
      categoryParam: 'Readymade Dhoti',
    },
    {
      title: 'Bhagalpuri Silk & Art Silk Dhoti Sets (सिल्क धोती सेट)',
      subtitle: 'Regal Tussar & Silk Weaves for Wedding Grooms',
      desc: 'Pure Bhagalpuri and fine art silk dhoti-dupatta pairs known for natural sheen and ceremonial stature. Available in rich sandalwood, golden cream, and auspicious turmeric shades.',
      sizes: '4 Metre Dhoti + 2.25 Metre Matching Stole/Dupatta',
      features: ['Rich Natural Lustre', 'Complete Wedding Presentation Gift Box', 'Custom Kurta-Fabric Coordination'],
      categoryParam: 'Silk',
    },
    {
      title: 'Pooja Vastra & Temple Cloth Sets (पूजा वस्त्र एवं गमछा)',
      subtitle: 'Dhoti, Angavastram & Gamcha for Religious Trusts & Priests',
      desc: 'Dedicated ceremonial sets supplying temples, spiritual institutions, and family havan ceremonies. Wholesale bale packing with certified fabric purity.',
      sizes: 'Bales of 25, 50, and 100 pieces for bulk orders',
      features: ['Certified Pure Vegetable Dye Options', 'Auspicious Vedic Weaves', 'Direct Mill Wholesale Pricing'],
      categoryParam: 'Dhotis',
    },
  ];

  const faqs = [
    {
      q: 'Where can I buy authentic traditional dhotis in Indore?',
      a: 'Baldevji Jitmal, located at 221, M.T. Cloth Market (Maharaja Tukojirao Cloth Market), Indore, is one of central India’s most trusted wholesale and retail suppliers for authentic pure cotton, temple border, and silk dhotis.',
    },
    {
      q: 'Which is the best wholesale market for dhotis in Indore?',
      a: 'M.T. Cloth Market (Maharaja Tukojirao Holkar Cloth Market) near Rajwada is the historic and largest textile wholesale market in Indore. Baldevji Jitmal is situated on the main market corridor at Shop 221, supplying retailers across MP, Rajasthan, Maharashtra, and UP.',
    },
    {
      q: 'What types of dhotis are available at Baldevji Jitmal Indore?',
      a: 'We offer pure cotton daily and pooja dhotis (80s, 100s, 120s count), South Indian temple border dhotis, Panchakacham (8-yard and 9×5 double dhotis), pre-stitched readymade velcro dhotis with pockets, and Bhagalpuri silk dhoti-dupatta wedding sets.',
    },
    {
      q: 'Do you sell dhotis in retail as well as wholesale bulk quantities?',
      a: 'Yes. We cater to individual families purchasing traditional wedding attire and festival sets as well as outstation retail shopkeepers and temple trusts buying full bales (25, 50, or 100 pieces) at direct wholesale rates.',
    },
    {
      q: 'Can outstation customers order dhotis from Indore via WhatsApp?',
      a: 'Yes. Simply message us on WhatsApp at +91 78698 49449 or +91 78280 72394. We share real-time photographs, fabric counts, and wholesale pricing. Once you select, we dispatch safely via daily transport parcel networks nationwide.',
    },
    {
      q: 'What are the shop timings and location in Indore?',
      a: 'We are open Monday through Saturday from 11:00 AM to 8:30 PM at 221, M.T. Cloth Market, Indore, MP 452002 (near Sheetal Kulfi, central market lane). Phone: 0731-2459280.',
    },
  ];

  return (
    <>
      <SEO
        title="Dhotis in Indore — Pure Cotton, Temple Border & Wedding Dhotis Wholesale"
        description="Looking for authentic dhotis in Indore? Baldevji Jitmal at 221, M.T. Cloth Market offers wholesale & retail pure cotton dhotis, Panchakacham, temple borders & silk dhoti-dupatta sets."
        keywords="dhotis in indore, wholesale dhoti indore, cotton dhoti indore, M.T. cloth market dhoti, wedding dhoti indore, readymade dhoti indore, panchakacham indore, baldevji jitmal dhoti, pooja dhoti indore, pure cotton dhoti mp"
        canonical="https://www.baldevjijitmal.in/dhotis-in-indore"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/products' },
          { name: 'Dhotis in Indore', url: '/dhotis-in-indore' },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 sm:py-20 lg:py-24 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionFade>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold font-medium mb-3">
              <Store size={15} />
              <span>Heritage Wholesale House · M.T. Cloth Market, Indore</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-tight font-normal">
              Dhotis in Indore <span className="italic text-gold font-serif">। पारंपरिक धोती संग्रह</span>
            </h1>
            <div className="gold-divider my-4 sm:my-6 w-24"></div>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-primary-foreground/90 leading-relaxed">
              Baldevji Jitmal is Indore’s historic destination for authentic pure cotton dhotis, sacred temple-border sets, Panchakachams, readymade velcro dhotis, and Bhagalpuri silk wedding pairs. Serving generational families, priests, and textile retailers across India.
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
                to="/gallery?category=Dhotis"
                className="inline-flex items-center gap-2 border border-gold/50 text-primary-foreground bg-black/20 px-6 py-3.5 rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-gold/15 hover:border-gold transition-all duration-300 backdrop-blur-sm min-h-[44px]"
              >
                <span>View Live Catalogue</span>
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
              <Award className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">Generations</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Of Textile Mastery</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">100% Pure Cotton</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Combed High-Count Weaves</p>
            </div>
            <div className="flex flex-col items-center">
              <Store className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">221, M.T. Market</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Heart of Indore Wholesale</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="text-gold mb-1.5" size={24} />
              <p className="font-display text-xl sm:text-2xl text-primary font-medium">Pan-India Dispatch</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Bale & Parcel Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dhoti Collections Grid */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">Authentic Varieties</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              Dhoti Weaves & Varieties Available in Indore
            </h2>
            <div className="gold-divider my-3 w-16"></div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              From everyday pooja cotton to pure silk bridal ensembles, each weave in our shop reflects traditional Indian textile heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dhotiCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-card border border-gold/30 p-5 sm:p-6 rounded-sm shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gold font-mono mb-2">
                    <span>Variety 0{idx + 1}</span>
                    <Sparkles size={14} />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-primary leading-snug">{cat.title}</h3>
                  <p className="text-xs text-accent font-medium mt-1">{cat.subtitle}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">{cat.desc}</p>

                  <div className="my-4 pt-3 border-t border-border/40">
                    <p className="text-[11px] text-foreground font-medium uppercase tracking-wider mb-2">Standard Sizes:</p>
                    <p className="text-xs text-muted-foreground font-mono bg-sand-200/60 px-2.5 py-1.5 rounded-sm inline-block">
                      {cat.sizes}
                    </p>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {cat.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-foreground/80">
                        <CheckCircle2 size={13} className="text-accent shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <Link
                    to={`/gallery?category=${encodeURIComponent(cat.categoryParam)}`}
                    className="text-xs text-primary font-semibold hover:text-accent transition inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Designs</span>
                    <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Namaste Baldevji Jitmal, I am interested in ${cat.title} from your Indore dhoti collection. Please send rates and photos.`
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

      {/* Guide: How to Choose Dhotis in Indore */}
      <section className="py-14 sm:py-20 bg-sand-200/40 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">Buyer's Handbook</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mt-2">
              Guide to Buying Traditional Dhotis in Indore
            </h2>
            <div className="gold-divider my-3 w-20 mx-auto"></div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Everything outstation retailers, wedding shoppers, and temple trusts should know before ordering.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-card p-5 sm:p-7 rounded-sm border border-gold/30 shadow-soft">
              <h3 className="font-display text-xl text-primary flex items-center gap-2">
                <span className="text-gold font-mono text-sm">01.</span> Cotton Yarn Count (सूती धागे की बारीक बुनाई)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                For daily wear and priests, <strong>80s and 100s count cotton</strong> provides the ideal balance of softness and long-lasting durability. For weddings and special temple ceremonies, <strong>100s combed and 120s superfine cotton</strong> gives an elegant drape and feather-light feel.
              </p>
            </div>

            <div className="bg-card p-5 sm:p-7 rounded-sm border border-gold/30 shadow-soft">
              <h3 className="font-display text-xl text-primary flex items-center gap-2">
                <span className="text-gold font-mono text-sm">02.</span> Single Dhoti vs. Double Dhoti (सिंगल बनाम डबल धोती)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                A <strong>single dhoti (2.5 to 4 metres)</strong> is typically draped around the waist for regular daily pooja or simple gatherings. A <strong>double dhoti (8 metres or 9×5 yards)</strong> is folded in half or draped in the sacred Panchakacham style for Vedic marriages, havan rituals, and formal ceremonies.
              </p>
            </div>

            <div className="bg-card p-5 sm:p-7 rounded-sm border border-gold/30 shadow-soft">
              <h3 className="font-display text-xl text-primary flex items-center gap-2">
                <span className="text-gold font-mono text-sm">03.</span> Wholesale Bale Packing for Retailers (थोक व्यापारियों हेतु पार्सल)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                If you are a retail shop owner in Madhya Pradesh, Rajasthan, or Gujarat, we supply factory-sealed bales of 25, 50, or 100 dhotis with assorted zari and temple borders, complete with transport bilti and tax invoice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">Got Questions?</p>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">
              Frequently Asked Questions About Dhotis in Indore
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
              Visit Baldevji Jitmal at M.T. Cloth Market, Indore
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 mt-2 max-w-2xl mx-auto leading-relaxed">
              Step inside our heritage store to experience hundreds of authentic dhoti weaves in person, or connect instantly with our wholesale counter on WhatsApp.
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

      {/* Schema.org FAQPage & Product Structured Data */}
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