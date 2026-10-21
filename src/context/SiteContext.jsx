import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const defaultSettings = {
  brand: {
    name: 'Baldevji Jitmal',
    tagline: 'Textiles • Indore',
    est: '1937',
    location: 'M.T. Cloth Market',
    city: 'Indore',
    wholesaleBadge: 'Traditional Indian Textiles · Wholesale & Retail',
    monogramUrl: '/logo-baldevji-mark-refined.png',
    initials: 'BJ',
  },
  announcementBar: {
    enabled: false,
    text: '॥ श्री गणेशाय नमः ॥ · M.T. Cloth Market, Indore · Est. 1937 · Traditional Indian Textiles',
    link: '',
  },
  nav: {
    home: 'Home',
    about: 'About Us',
    products: 'Collections',
    gallery: 'Catalogue',
    contact: 'Contact',
  },
  hero: {
    badge: 'Traditional Textiles · Indore · Est. 1937',
    heading: 'Baldevji Jitmal',
    subheading: 'Traditional Indian textiles — From the heart of Indore, Since 1937.',
    intro:
      'A Trusted Wholesale House dealing in Dhotis, Dupattas, Dhoti-Dupatta Sets, Ladies & Gents Shawls, Bedsheets, Blankets, Towels, Napkins, Bhagalpuri sets and Chadars, Silk sets, and Kurta-Pajama Cloth.',
    ctaPrimaryLabel: 'Explore Collections',
    ctaSecondaryLabel: 'Plan a Visit',
    whatsappCtaLabel: 'Direct WhatsApp',
    whatsappLabel: 'Direct WhatsApp',
    whatsappMessage:
      'Namaste Baldevji Jitmal, I would like to inquire about your traditional textile collection. Please share current designs.',
    heroImageUrl: '/assets/hero-textiles-CKsuSuq6.jpg',
    bgImage: '/assets/hero-textiles-CKsuSuq6.jpg',
  },
  marqueeRibbon: {
    enabled: true,
    items: [
      'Bhagalpuri Tussar Silks',
      'Traditional Dhotis & Sets',
      'Cashmere & Pashmina Shawls',
      'Handloom Dupattas',
      'Pure Cotton Bedsheets',
      'Chanderi & Maheshwari Weaves',
      'Kurta-Pajama Fabrics',
      'M.T. Cloth Market · Indore',
      'Wedding & Ceremonial Attire',
      'Heritage Textiles Since 1937',
    ],
  },
  stats: {
    stat1Label: 'Product ranges',
    stat1Value: '12+',
    stat2Label: 'Years of trust',
    stat2Value: '90+',
  },
  pillars: [
    {
      title: 'Heritage Since 1937',
      desc: 'Over 8 decades of textile mastery in the heart of M.T. Cloth Market, Indore.',
    },
    {
      title: 'Hand-Curated Weaves',
      desc: 'Carefully sourced dhotis, silks, pashminas, and traditional fabrics.',
    },
    {
      title: 'Pan-India Delivery',
      desc: 'Prompt, secure dispatches for retail stores, wedding ceremonies, and families.',
    },
    {
      title: 'Generations of Trust',
      desc: 'Fair pricing, honest fabric quality, and personalized family-style care.',
    },
  ],
  homeCollections: {
    eyebrow: 'Curated Collections',
    heading: 'A world of traditional Indian weaves',
    description: 'Explore by collection. Every piece reflects generations of authentic textile craftsmanship.',
    viewAllBtn: 'View all collections',
  },
  heritageSeal: {
    text: '· ESTD 1937 · BALDEVJI JITMAL · INDORE · HERITAGE ·',
    monogram: 'BJ',
    year: '1937',
    link: '/gallery',
  },
  editorial: {
    eyebrow: '· House of Traditional Textiles · Est. 1937 ·',
    heading: 'The finest things are quiet.',
    headingAccent: 'For those who understand true craft.',
    body: 'At Baldevji Jitmal, every fold of cloth holds the legacy of Indore’s historic weaving corridors. We believe true luxury is not loud — it is the quiet touch of pure fibres, honest weave, and timeless ceremony.',
    featureImageUrl: '/assets/hero-textiles-CKsuSuq6.jpg',
    featureCaptionEyebrow: 'Atelier Curation',
    featureQuote: '“Traditional cloth, thoughtfully selected for wedding ceremonies & family heirlooms.”',
    ctaLabel: 'Discover our story',
    chapters: [
      {
        num: '01',
        title: 'Pure Material Integrity',
        desc: 'Selected thread-by-thread. Authentic Bhagalpuri silks, hand-twisted dhotis, and cashmere-soft shawls sourced directly from generational weaver families.',
      },
      {
        num: '02',
        title: 'Quiet Heritage Since 1937',
        desc: 'No mass production or synthetic shortcuts. Over 8 decades of honest curation, family pricing, and trust passed down through three generations in Indore.',
      },
      {
        num: '03',
        title: 'M.T. Cloth Market Legacy',
        desc: 'Firmly anchored at shop 221 in central India’s historic fabric hub, dispatching curated ceremonial and retail textiles nationwide.',
      },
    ],
  },
  faqSection: {
    eyebrow: 'Store & Ordering Guide',
    heading: 'Frequently Asked Questions',
    intro: 'Helpful details on visiting our M.T. Cloth Market store, catalogue selections, and delivery across India.',
  },
  shop: {
    eyebrow: 'Visit our shop',
    heading: 'Step into our store at M.T. Cloth Market',
    body: 'Tucked into the heritage textile lanes of Indore, our storefront — marked by its signature maroon signboard — has welcomed retailers and families for decades.',
    photo1Url: '/assets/shop-exterior-1-Y8qJ9GsL.jpg',
    photo1Caption: 'Baldevji Jitmal · Jitmal & Sons',
    photo1Sub: 'The storefront',
    photo2Url: '/assets/shop-exterior-2-B3lADtzs.jpg',
    photo2Caption: 'A glimpse of the collection',
    photo2Sub: 'Bedsheets, dhotis & daily traditional wear',
    directionsBtn: 'Get directions',
    contactBtn: 'Contact the shop',
  },
  faqs: [
    {
      q: 'How can outstation customers and retailers place orders?',
      a: 'You can visit our heritage shop at 221, M.T. Cloth Market, Indore, or connect with us directly on WhatsApp (+91 7869849449 / 0731 245 9280). We gladly share live photographs, shade cards, and product details. Once you select your items, we safely pack and dispatch them to your destination.',
    },
    {
      q: 'Do you deliver across India?',
      a: 'Yes. Being located in central India at Indore’s historic textile hub, we have reliable daily transport and parcel tie-ups delivering across Madhya Pradesh, Rajasthan, Maharashtra, Gujarat, Uttar Pradesh, Chhattisgarh, and all states nationwide.',
    },
    {
      q: 'Can we order for weddings, temple ceremonies, and family functions?',
      a: 'Absolutely. We specialize in coordinated Dhoti + Dupatta sets, 3-piece Dhoti-Dupatta-Kurta cloth combinations, and gift shawls for weddings, spiritual functions, and temple trusts, complete with matching presentation packaging.',
    },
    {
      q: 'Do you cater to both bulk buyers and personal/family requirements?',
      a: 'Yes. We welcome retail shopkeepers purchasing full bales and thans, as well as families and wedding planners looking for curated traditional sets. Every customer is treated with the same warmth and dedication.',
    },
    {
      q: 'What payment modes are accepted for deliveries?',
      a: 'We accept UPI, NEFT, RTGS, IMPS, and standard bank transfers. All dispatches are properly billed and accompanied by dispatch tracking / transport bilti receipts.',
    },
  ],
  about: {
    eyebrow: 'Our Story',
    heading: 'About Baldevji Jitmal',
    paragraphs: [
      "Baldevji Jitmal is a family-run heritage textile house based in the legendary M.T. Cloth Market of Indore — one of central India's oldest and most prestigious fabric hubs, serving generations since 1937.",
      "For decades we have curated and supplied traditional Indian fabrics to wedding families, retailers, and discerning patrons across the country. Our specialities include authentic dhotis, dupattas and dhoti-dupatta sets, fine ladies and gents shawls, premium bedsheets, blankets, towels, Bhagalpuri silk sets, and pure kurta-pajama fabrics.",
      "We believe in honest pricing, careful craftsmanship, and treating every visitor — whether choosing wedding attire or sourcing for an institution — like family. Come visit our shop in the heart of Indore, or browse our latest catalogue online.",
    ],
    featureImageUrl: '/assets/hero-textiles-CKsuSuq6.jpg',
    featureImageCaption: 'Traditional cloth, thoughtfully selected.',
    ctaLabel: 'Plan a Visit',
  },
  productsPage: {
    eyebrow: 'Curated Collections',
    heading: 'Traditional Indian Textiles',
    intro:
      'A complete selection of traditional Indian fabrics and finished pieces — thoughtfully curated for weddings, families, and boutique retailers. Click any category to view its full catalogue.',
    calloutHeading: 'Looking for something specific?',
    calloutBody:
      'Visit our landmark store in M.T. Cloth Market or connect on WhatsApp for personalized photos, rates, and selections.',
    calloutPrimaryBtn: 'View Full Catalogue',
    calloutSecondaryBtn: 'Contact Us',
  },
  cataloguePage: {
    eyebrow: 'Photo & Video',
    heading: 'Our Catalogue',
    intro: 'A growing collection of our latest traditional textiles.',
    searchPlaceholder: 'Search by code, weave...',
    noteTitle: 'Please note:',
    noteText:
      'This catalogue shows a curated selection of our stock. To explore our complete range of fabrics, please visit us at the shop in person or connect with us on WhatsApp.',
  },
  contact: {
    eyebrow: 'Get in Touch',
    heading: 'Visit, Call or Write to Us',
    address: '221, M.T. Cloth Market, Indore, MP',
    addressShort: '221, M.T. Cloth Market, Indore',
    phone1: '0731 245 9280',
    phone2: '+91 7869849449',
    email: 'info@baldevjijitmal.com',
    hours: 'Mon – Sat · 12:00 PM – 8:00 PM',
    instagramHandle: '@baldevji.jitmal',
    instagramUrl: 'https://instagram.com/baldevji.jitmal',
    mapEmbedUrl:
      'https://www.google.com/maps?q=Baldevji+Jitmal+Jitmal+%26+Sons+221+M.T.+Cloth+Market+Indore&output=embed',
    mapDirectionsUrl: 'https://maps.app.goo.gl/Rv2U7Fw3jMkcTBAx5',
    formHeading: 'Send an Inquiry',
    formSubtitle: "Tell us what you're looking for and we'll get back to you promptly.",
  },
  whatsappFloating: {
    enabled: true,
    label: 'Inquire on WhatsApp',
    message:
      'Namaste Baldevji Jitmal, I would like to inquire about your traditional textile collection. Please share designs and details.',
  },
  heritage: {
    eyebrow: 'Wholesale · Indore',
    heading: 'Generations of fabric, hand-picked for you',
    body: 'From the busy lanes of M.T. Cloth Market, we have served retailers, families and bulk buyers with honest pricing and a careful selection of traditional weaves. Visit our shop or browse our catalogue online.',
  },
  footer: {
    blurb:
      'A trusted name in traditional Indian textiles since 1937 — wholesale dhotis, dupattas, shawls, bedsheets and more from the heart of Indore.',
    copyrightNotice: 'Baldevji Jitmal. All rights reserved.',
    watermark: 'BJ',
  },
  theme: {
    background: '#f1e8d8',
    foreground: '#2a1f15',
    primary: '#5a1f1c',
    primaryForeground: '#fbf5e9',
    accent: '#b88636',
    gold: '#b88636',
    mutedForeground: '#5b4a3a',
    card: '#f9f1df',
    border: '#d5c4a8',
    sand200: '#e3d3b8',
  },
  highlights: [
    {
      title: 'Dhoti & Dupatta',
      desc: 'Cotton Dhoti and Dupatta sets, Single Dhotis and Dupattas.',
      imageUrl: '/assets/cat-dhoti-GEuIIywH.jpg',
      categorySlug: 'Dhotis',
    },
    {
      title: 'Artificial Silk Sets',
      desc: 'Premium Artificial silk dhotis and sets — heritage weaves.',
      imageUrl: '/assets/cat-silk-DHRRFLzi.jpg',
      categorySlug: 'Silk',
    },
    {
      title: 'Shawls — Ladies',
      desc: 'Soft pashmina and wool shawls in classic paisley and modern weaves.',
      imageUrl: '/assets/cat-shawl-D5bqtbMz.jpg',
      categorySlug: 'Ladies Shawl',
    },
    {
      title: 'Shawls — Gents',
      desc: 'Soft, pashmina and wool shawls in classic paisley and modern weaves.',
      imageUrl: '/assets/cat-shawl-D5bqtbMz.jpg',
      categorySlug: 'Gents Shawl',
    },
    {
      title: 'Home Textiles',
      desc: 'Bedsheets, blankets, towels and napkins for homes and bulk buyers.',
      imageUrl: '/assets/cat-home-BiWUfBZT.jpg',
      categorySlug: 'Home',
    },
    {
      title: 'Bhagalpuri',
      desc: 'Bhagalpuri Dhoti Dupatta sets and chaddars- your all-weather companion.',
      imageUrl: '/assets/cat-dhoti-GEuIIywH.jpg',
      categorySlug: 'Bhagalpuri',
    },
    {
      title: 'Kurta Cloth',
      desc: 'Full Kurta Cloth- Mix, Cotton, Linen',
      imageUrl: '/assets/cat-silk-DHRRFLzi.jpg',
      categorySlug: 'Kurta Cloth',
    },
  ],
};

const SiteContext = createContext({
  settings: defaultSettings,
  isLoading: false,
});

export function SiteProvider({ children }) {
  const { data: dbSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'site')
          .maybeSingle();

        if (error) {
          console.warn('Failed to fetch site_settings from Supabase:', error.message);
          // Check local cache
          try {
            const cached = localStorage.getItem('bj_site_settings_cache');
            if (cached) return JSON.parse(cached);
          } catch (_) {}
          return null;
        }

        if (data?.value) {
          try {
            localStorage.setItem('bj_site_settings_cache', JSON.stringify(data.value));
          } catch (_) {}
          return data.value;
        }

        return null;
      } catch (err) {
        console.warn('Site settings error:', err);
        try {
          const cached = localStorage.getItem('bj_site_settings_cache');
          if (cached) return JSON.parse(cached);
        } catch (_) {}
        return null;
      }
    },
  });

  // Deep merge settings with comprehensive defaults so no component ever breaks
  const mergedSettings = React.useMemo(() => {
    if (!dbSettings) return defaultSettings;
    return {
      ...defaultSettings,
      ...dbSettings,
      brand: {
        ...defaultSettings.brand,
        ...dbSettings.brand,
      },
      announcementBar: {
        ...defaultSettings.announcementBar,
        ...dbSettings.announcementBar,
      },
      nav: {
        ...defaultSettings.nav,
        ...dbSettings.nav,
      },
      hero: {
        ...defaultSettings.hero,
        ...dbSettings.hero,
      },
      marqueeRibbon: {
        ...defaultSettings.marqueeRibbon,
        ...dbSettings.marqueeRibbon,
        items:
          Array.isArray(dbSettings.marqueeRibbon?.items) && dbSettings.marqueeRibbon.items.length > 0
            ? dbSettings.marqueeRibbon.items
            : defaultSettings.marqueeRibbon.items,
      },
      stats: {
        ...defaultSettings.stats,
        ...dbSettings.stats,
      },
      pillars:
        Array.isArray(dbSettings.pillars) && dbSettings.pillars.length > 0
          ? dbSettings.pillars
          : defaultSettings.pillars,
      homeCollections: {
        ...defaultSettings.homeCollections,
        ...dbSettings.homeCollections,
      },
      heritageSeal: {
        ...defaultSettings.heritageSeal,
        ...dbSettings.heritageSeal,
      },
      editorial: {
        ...defaultSettings.editorial,
        ...dbSettings.editorial,
        chapters:
          Array.isArray(dbSettings.editorial?.chapters) && dbSettings.editorial.chapters.length > 0
            ? dbSettings.editorial.chapters
            : defaultSettings.editorial.chapters,
      },
      faqSection: {
        ...defaultSettings.faqSection,
        ...dbSettings.faqSection,
      },
      shop: {
        ...defaultSettings.shop,
        ...dbSettings.shop,
      },
      faqs:
        Array.isArray(dbSettings.faqs) && dbSettings.faqs.length > 0
          ? dbSettings.faqs
          : defaultSettings.faqs,
      about: {
        ...defaultSettings.about,
        ...dbSettings.about,
        paragraphs:
          Array.isArray(dbSettings.about?.paragraphs) && dbSettings.about.paragraphs.length > 0
            ? dbSettings.about.paragraphs
            : defaultSettings.about.paragraphs,
      },
      productsPage: {
        ...defaultSettings.productsPage,
        ...dbSettings.productsPage,
      },
      cataloguePage: {
        ...defaultSettings.cataloguePage,
        ...dbSettings.cataloguePage,
      },
      contact: {
        ...defaultSettings.contact,
        ...dbSettings.contact,
        phone2:
          !dbSettings.contact?.phone2 ||
          dbSettings.contact?.phone2.includes('78280') ||
          dbSettings.contact?.phone2.includes('72394')
            ? '+91 7869849449'
            : dbSettings.contact.phone2,
      },
      whatsappFloating: {
        ...defaultSettings.whatsappFloating,
        ...dbSettings.whatsappFloating,
      },
      heritage: {
        ...defaultSettings.heritage,
        ...dbSettings.heritage,
      },
      footer: {
        ...defaultSettings.footer,
        ...dbSettings.footer,
      },
      theme: {
        ...defaultSettings.theme,
        ...dbSettings.theme,
      },
      highlights:
        Array.isArray(dbSettings.highlights) && dbSettings.highlights.length > 0
          ? dbSettings.highlights
          : defaultSettings.highlights,
    };
  }, [dbSettings]);

  // Apply theme variables to CSS root
  useEffect(() => {
    const root = document.documentElement;
    const theme = mergedSettings.theme;
    if (theme) {
      if (theme.background) root.style.setProperty('--background', theme.background);
      if (theme.foreground) root.style.setProperty('--foreground', theme.foreground);
      if (theme.primary) root.style.setProperty('--primary', theme.primary);
      if (theme.primaryForeground) root.style.setProperty('--primary-foreground', theme.primaryForeground);
      if (theme.accent) root.style.setProperty('--accent', theme.accent);
      if (theme.gold) root.style.setProperty('--gold', theme.gold);
      if (theme.mutedForeground) root.style.setProperty('--muted-foreground', theme.mutedForeground);
      if (theme.card) root.style.setProperty('--card', theme.card);
      if (theme.border) root.style.setProperty('--border', theme.border);
      if (theme.border) root.style.setProperty('--input', theme.border);
      if (theme.sand200) root.style.setProperty('--sand-200', theme.sand200);
      if (theme.background) root.style.setProperty('--sand-100', theme.background);
      if (theme.primary) root.style.setProperty('--maroon', theme.primary);
      if (theme.primary) root.style.setProperty('--ring', theme.primary);
    }
  }, [mergedSettings.theme]);

  return (
    <SiteContext.Provider value={{ settings: mergedSettings, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteContext);
  return context.settings;
}
