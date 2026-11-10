import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFromSupabase } from '../lib/supabaseFetch';

export const defaultSettings = {
  brand: {
    name: 'Baldevji Jitmal',
    tagline: 'Textiles • Indore',
    est: '',
    location: 'M.T. Cloth Market',
    city: 'Indore',
    wholesaleBadge: 'Traditional Indian Textiles · Wholesale & Retail',
    monogramUrl: '/logo-baldevji-mark-refined.webp',
    initials: 'BJ',
  },
  announcementBar: {
    enabled: false,
    text: '॥ श्री गणेशाय नमः ॥ · M.T. Cloth Market, Indore · Traditional Indian Textiles',
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
    badge: 'Traditional Textiles · Indore',
    heading: 'Baldevji Jitmal',
    subheading: 'Traditional Indian textiles — From the heart of Indore.',
    intro:
      'A Trusted Wholesale House dealing in Dhotis, Dupattas, Dhoti-Dupatta Sets, Ladies & Gents Shawls, Bedsheets, Towels, Napkins, Bhagalpuri sets and Chadars, Silk sets, and Kurta-Pajama Cloth.',
    ctaPrimaryLabel: 'Explore Collections',
    ctaSecondaryLabel: 'Plan a Visit',
    whatsappCtaLabel: 'Direct WhatsApp',
    whatsappLabel: 'Direct WhatsApp',
    whatsappMessage:
      'Namaste Baldevji Jitmal, I would like to inquire about your traditional textile collection. Please share current designs.',
    heroImageUrl: '/assets/hero-textiles-1200.webp',
    bgImage: '/assets/hero-textiles-1200.webp',
  },
  marqueeRibbon: {
    enabled: true,
    items: [
      'Traditional Dhotis & Sets',
      'Cashmere & Pashmina Shawls',
      'Kurta-Pajama Fabrics',
      'Bhagalpuri',
      '221 M.T. Cloth Market · Indore',
      'Ladies Shawls',
      'Gents Shawls',
      'Stoles',
      'Dupattas',
      'Cotton Bedsheets',
      'Wedding & Ceremonial Collection',
      'Heritage Textiles',
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
      title: 'Heritage Textile',
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
    text: '· SERVING GENERATIONS · BALDEVJI JITMAL',
    monogram: '',
    year: '',
    link: '/gallery',
  },
  editorial: {
    eyebrow: '· House of Traditional Textiles ',
    heading: 'Generations of fabric, ',
    headingAccent: 'hand-picked for you.',
    body: 'From the busy lanes of M.T. Cloth Market, we have served retailers, families, and bulk buyers with honest pricing and a careful selection of traditional weaves. Visit our shop or browse our catalogue online.',
    featureImageUrl: '/assets/hero-textiles-800.webp',
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
        title: 'Quiet Heritage',
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
      "Baldevji Jitmal is a family-run heritage textile house based in the legendary M.T. Cloth Market of Indore — one of central India's oldest and most prestigious fabric hubs, serving generations.",
      "For decades we have curated and supplied traditional Indian fabrics to wedding families, retailers, and discerning patrons across the country. Our specialities include authentic dhotis, dupattas and dhoti-dupatta sets, fine ladies and gents shawls, premium bedsheets, towels, napkins, Bhagalpuri silk sets, and pure kurta-pajama fabrics.",
      "We believe in honest pricing, careful craftsmanship, and treating every visitor — whether choosing wedding attire or sourcing for an institution — like family. Come visit our shop in the heart of Indore, or browse our latest catalogue online.",
    ],
    featureImageUrl: '/assets/hero-textiles-800.webp',
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
      'A trusted name in traditional Indian textiles— wholesale dhotis, dupattas, shawls, bedsheets and more from the heart of Indore.',
    copyrightNotice: 'Baldevji Jitmal. All rights reserved.',
    watermark: 'BJ',
  },
  theme: {
    background: '#f4efe5',
    foreground: '#221d19',
    primary: '#5a1f1c',
    primaryForeground: '#fcf9f2',
    accent: '#7d5218',
    gold: '#dfb76c',
    mutedForeground: '#6a6054',
    card: '#faf5ec',
    border: 'rgba(125, 82, 24, 0.22)',
    sand200: '#ebe1d0',
  },
  highlights: [
    {
      title: 'Dhoti & Dupatta',
      desc: 'Cotton Dhoti and Dupatta sets, Single Dhotis and Dupattas.',
      imageUrl: '/assets/cat-dhoti-GEuIIywH.webp',
      categorySlug: 'Dhotis',
    },
    {
      title: 'Artificial Silk Sets',
      desc: 'Premium Artificial silk dhotis and sets — heritage weaves.',
      imageUrl: '/assets/cat-silk-DHRRFLzi.webp',
      categorySlug: 'Silk',
    },
    {
      title: 'Shawls — Ladies',
      desc: 'Soft pashmina and wool shawls in classic paisley and modern weaves.',
      imageUrl: '/assets/cat-shawl-D5bqtbMz.webp',
      categorySlug: 'Ladies Shawl',
    },
    {
      title: 'Shawls — Gents',
      desc: 'Soft, pashmina and wool shawls in classic paisley and modern weaves.',
      imageUrl: '/assets/cat-shawl-D5bqtbMz.webp',
      categorySlug: 'Gents Shawl',
    },
    {
      title: 'Home Textiles',
      desc: 'Bedsheets, towels and napkins for homes and bulk buyers.',
      imageUrl: '/assets/cat-home-BiWUfBZT.webp',
      categorySlug: 'Home',
    },
    {
      title: 'Bhagalpuri',
      desc: 'Bhagalpuri Dhoti Dupatta sets and chaddars- your all-weather companion.',
      imageUrl: '/assets/cat-dhoti-GEuIIywH.webp',
      categorySlug: 'Bhagalpuri',
    },
    {
      title: 'Kurta Cloth',
      desc: 'Full Kurta Cloth- Mix, Cotton, Linen',
      imageUrl: '/assets/cat-silk-DHRRFLzi.webp',
      categorySlug: 'Kurta Cloth',
    },
  ],
  dhotisPage: {
    seo: {
      title: 'Dhotis in Indore — Pure Cotton, Temple Border & Wedding Dhotis Wholesale',
      description: 'Looking for authentic dhotis in Indore? Baldevji Jitmal at 221, M.T. Cloth Market offers wholesale & retail pure cotton dhotis, Panchakacham, temple borders & silk dhoti-dupatta sets.',
      keywords: 'dhotis in indore, wholesale dhoti indore, cotton dhoti indore, M.T. cloth market dhoti, wedding dhoti indore, readymade dhoti indore, panchakacham indore, baldevji jitmal dhoti, pooja dhoti indore, pure cotton dhoti mp',
    },
    hero: {
      eyebrow: 'Heritage Wholesale House · M.T. Cloth Market, Indore',
      title: 'Dhotis in Indore',
      titleAccent: '। पारंपरिक धोती संग्रह',
      description: 'Baldevji Jitmal is Indore’s historic destination for authentic pure cotton dhotis, sacred temple-border sets, Panchakachams, readymade velcro dhotis, and Bhagalpuri silk wedding pairs. Serving generational families, priests, and textile retailers across India.',
      ctaWhatsapp: 'Inquire on WhatsApp',
      ctaCatalogue: 'View Live Catalogue',
    },
    badges: [
      { title: 'Generations', subtitle: 'Of Textile Mastery' },
      { title: '100% Pure Cotton', subtitle: 'Combed High-Count Weaves' },
      { title: '221, M.T. Market', subtitle: 'Heart of Indore Wholesale' },
      { title: 'Pan-India Dispatch', subtitle: 'Bale & Parcel Delivery' },
    ],
    varietiesHeader: {
      eyebrow: 'Authentic Varieties',
      heading: 'Dhoti Weaves & Varieties Available in Indore',
      description: 'From everyday pooja cotton to pure silk bridal ensembles, each weave in our shop reflects traditional Indian textile heritage.',
    },
    varieties: [
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
    ],
    guideHeader: {
      eyebrow: "Buyer's Handbook",
      heading: 'Guide to Buying Traditional Dhotis in Indore',
      description: 'Everything outstation retailers, wedding shoppers, and temple trusts should know before ordering.',
    },
    guideItems: [
      {
        title: 'Cotton Yarn Count (सूती धागे की बारीक बुनाई)',
        desc: 'For daily wear and priests, 80s and 100s count cotton provides the ideal balance of softness and long-lasting durability. For weddings and special temple ceremonies, 100s combed and 120s superfine cotton gives an elegant drape and feather-light feel.',
      },
      {
        title: 'Single Dhoti vs. Double Dhoti (सिंगल बनाम डबल धोती)',
        desc: 'A single dhoti (2.5 to 4 metres) is typically draped around the waist for regular daily pooja or simple gatherings. A double dhoti (8 metres or 9×5 yards) is folded in half or draped in the sacred Panchakacham style for Vedic marriages, havan rituals, and formal ceremonies.',
      },
      {
        title: 'Wholesale Bale Packing for Retailers (थोक व्यापारियों हेतु पार्सल)',
        desc: 'If you are a retail shop owner in Madhya Pradesh, Rajasthan, or Gujarat, we supply factory-sealed bales of 25, 50, or 100 dhotis with assorted zari and temple borders, complete with transport bilti and tax invoice.',
      },
    ],
    faqsHeader: {
      eyebrow: 'Got Questions?',
      heading: 'Frequently Asked Questions About Dhotis in Indore',
    },
    faqs: [
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
    ],
    storeCard: {
      heading: 'Visit Baldevji Jitmal at M.T. Cloth Market, Indore',
      subtitle: 'Step inside our heritage store to experience hundreds of authentic dhoti weaves in person, or connect instantly with our wholesale counter on WhatsApp.',
    },
  },
  shawlsPage: {
    seo: {
      title: 'Shawls in Indore — Ladies Shawls, Gents Shawls & Lohis Wholesale',
      description: 'Best collection of ladies shawls and gents shawls in Indore at 221, M.T. Cloth Market. Kashmiri embroidery, pashmina-touch, gents lohis & wedding gift sets at wholesale rates.',
      keywords: 'shawls in indore, ladies shawls in indore, gents shawls in indore, pashmina shawl indore, winter shawls indore, gents lohi indore, kashmiri shawls indore, wedding shawls indore, M.T. cloth market shawls, baldevji jitmal shawls',
    },
    hero: {
      eyebrow: 'Heritage Shawl House · M.T. Cloth Market, Indore',
      title: 'Shawls in Indore',
      titleAccent: '। महिला एवं जेंट्स शॉल',
      description: 'Discover Indore’s finest destination for ladies embroidered shawls, luxurious pashmina-touch wraps, masculine gents lohis, and ceremonial wedding doshalas. Carefully curated for warmth, grandeur, and generational durability.',
      ctaWhatsapp: 'Inquire on WhatsApp',
      ctaCatalogue: 'Browse Shawl Catalogue',
    },
    badges: [
      { title: 'Ladies & Gents', subtitle: 'Dedicated Collections' },
      { title: 'Fine Wool Weaves', subtitle: 'High Thermal Warmth' },
      { title: 'Wedding Gifting', subtitle: 'Shagun & Maayra Bundles' },
      { title: 'Wholesale Pricing', subtitle: 'Direct Dispatch Across MP' },
    ],
    ladiesHeader: {
      eyebrow: 'Dedicated Collection',
      heading: 'Ladies Shawls in Indore (महिला शॉल संग्रह)',
      description: 'Explore exquisite embroidered Kashmiri stoles, feather-light pashmina touch jacquards, and auspicious red bridal shawls for winter weddings and ceremonial occasions.',
    },
    ladiesShawls: [
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
    ],
    gentsHeader: {
      eyebrow: 'Traditional Masculine Wraps',
      heading: 'Gents Shawls & Lohis in Indore (जेंट्स शॉल एवं लोई)',
      description: 'Understated warmth, broad selvedges, and dignified textures crafted for daily winter elegance and formal ceremonial milestones.',
    },
    gentsShawls: [
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
    ],
    guideHeader: {
      eyebrow: 'Winter Fabric Guide',
      heading: 'Guide to Selecting Shawls & Lohis in Indore',
      description: 'Practical considerations for fabric thickness, weave density, and ceremonial gifting.',
    },
    guideItems: [
      {
        title: 'Acro-Wool vs. Cashmere-Feel Blends (धागे का प्रकार एवं स्पर्श)',
        desc: 'Acro-wool and pure wool blends offer high thermal resilience for cold central Indian mornings and outdoor weddings. Cashmere-feel jacquards offer fluid drape and featherlight softness.',
      },
      {
        title: 'Sizing: Stoles vs. Full Shawls vs. Lohis (आकार एवं नाप)',
        desc: 'Ladies stoles measure 28” × 80” (easy shoulder wrap), full ladies shawls measure 40” × 80” (complete torso drape), and gents lohis measure 54” × 108” (full body traditional wrap).',
      },
      {
        title: 'Wedding Shagun Packaging (विवाह शगुन पैकिंग)',
        desc: 'For Maayra and wedding gifting, we prepare gift-boxed sets in matching cellophane and hardboard presentations ready to hand over to respected guests.',
      },
    ],
    faqsHeader: {
      eyebrow: 'Got Questions?',
      heading: 'Frequently Asked Questions About Shawls in Indore',
    },
    faqs: [
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
    ],
    storeCard: {
      heading: 'Visit Baldevji Jitmal at M.T. Cloth Market, Indore',
      subtitle: 'Experience hundreds of shawls, lohis, and ceremonial wraps in person at our Indore store, or connect with our wholesale counter on WhatsApp.',
    },
  },
};

export const SETTINGS_CACHE_KEY = 'bj_site_settings_v9';

try {
  if (typeof window !== 'undefined') {
    [
      'bj_site_settings_cache',
      'bj_site_settings',
      'bj_site_settings_v1',
      'bj_site_settings_v2',
      'bj_site_settings_v3',
      'bj_site_settings_v4',
      'bj_site_settings_v5',
      'bj_site_settings_v6',
      'bj_site_settings_v7',
      'bj_site_settings_v8',
    ].forEach((k) => window.localStorage.removeItem(k));
  }
} catch (_) {}

export function getCachedSettings() {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (_) {}
  }
  return null;
}

const SiteContext = createContext({
  settings: defaultSettings,
  isLoading: false,
});

function sanitizeSettings(val) {
  if (typeof val === 'string') {
    return val
      .replace(/,\s*blankets?\b/gi, '')
      .replace(/\bblankets?,\s*/gi, '')
      .replace(/\bblankets?\b/gi, '')
      .replace(/\b(?:estd?\.?|established)\s*1937\b/gi, '')
      .replace(/\bsince\s*1937\b/gi, '')
      .replace(/·\s*·+/g, '·')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeSettings);
  }
  if (val && typeof val === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      if (k === 'adminPasscode') continue; // Never leak admin passcode to public site context
      if (k === 'est' && (v === '1937' || v === 1937)) {
        res[k] = '';
        continue;
      }
      res[k] = sanitizeSettings(v);
    }
    return res;
  }
  return val;
}

export function SiteProvider({ children }) {
  const { data: dbSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      try {
        const rows = await fetchFromSupabase('site_settings', {
          select: 'value',
          key: 'eq.site',
          limit: '1',
        });
        const val = rows && rows.length > 0 ? rows[0].value : null;

        if (val) {
          try {
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(val));
          } catch (_) {}
          return val;
        }

        return getCachedSettings();
      } catch (err) {
        console.warn('Site settings error:', err);
        return getCachedSettings();
      }
    },
    initialData: getCachedSettings,
    staleTime: 1000 * 60 * 5,
  });

  // Deep merge settings with comprehensive defaults so no component ever breaks
  const mergedSettings = React.useMemo(() => {
    if (!dbSettings) return defaultSettings;
    const raw = {
      ...defaultSettings,
      ...dbSettings,
      brand: {
        ...defaultSettings.brand,
        ...dbSettings.brand,
        monogramUrl: '/logo-baldevji-mark-refined.webp',
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
      dhotisPage: {
        ...defaultSettings.dhotisPage,
        ...(dbSettings.dhotisPage || {}),
        seo: { ...defaultSettings.dhotisPage.seo, ...(dbSettings.dhotisPage?.seo || {}) },
        hero: { ...defaultSettings.dhotisPage.hero, ...(dbSettings.dhotisPage?.hero || {}) },
        badges: Array.isArray(dbSettings.dhotisPage?.badges) && dbSettings.dhotisPage.badges.length > 0
          ? dbSettings.dhotisPage.badges
          : defaultSettings.dhotisPage.badges,
        varietiesHeader: { ...defaultSettings.dhotisPage.varietiesHeader, ...(dbSettings.dhotisPage?.varietiesHeader || {}) },
        varieties: Array.isArray(dbSettings.dhotisPage?.varieties) && dbSettings.dhotisPage.varieties.length > 0
          ? dbSettings.dhotisPage.varieties
          : defaultSettings.dhotisPage.varieties,
        guideHeader: { ...defaultSettings.dhotisPage.guideHeader, ...(dbSettings.dhotisPage?.guideHeader || {}) },
        guideItems: Array.isArray(dbSettings.dhotisPage?.guideItems) && dbSettings.dhotisPage.guideItems.length > 0
          ? dbSettings.dhotisPage.guideItems
          : defaultSettings.dhotisPage.guideItems,
        faqsHeader: { ...defaultSettings.dhotisPage.faqsHeader, ...(dbSettings.dhotisPage?.faqsHeader || {}) },
        faqs: Array.isArray(dbSettings.dhotisPage?.faqs) && dbSettings.dhotisPage.faqs.length > 0
          ? dbSettings.dhotisPage.faqs
          : defaultSettings.dhotisPage.faqs,
        storeCard: { ...defaultSettings.dhotisPage.storeCard, ...(dbSettings.dhotisPage?.storeCard || {}) },
      },
      shawlsPage: {
        ...defaultSettings.shawlsPage,
        ...(dbSettings.shawlsPage || {}),
        seo: { ...defaultSettings.shawlsPage.seo, ...(dbSettings.shawlsPage?.seo || {}) },
        hero: { ...defaultSettings.shawlsPage.hero, ...(dbSettings.shawlsPage?.hero || {}) },
        badges: Array.isArray(dbSettings.shawlsPage?.badges) && dbSettings.shawlsPage.badges.length > 0
          ? dbSettings.shawlsPage.badges
          : defaultSettings.shawlsPage.badges,
        ladiesHeader: { ...defaultSettings.shawlsPage.ladiesHeader, ...(dbSettings.shawlsPage?.ladiesHeader || {}) },
        ladiesShawls: Array.isArray(dbSettings.shawlsPage?.ladiesShawls) && dbSettings.shawlsPage.ladiesShawls.length > 0
          ? dbSettings.shawlsPage.ladiesShawls
          : defaultSettings.shawlsPage.ladiesShawls,
        gentsHeader: { ...defaultSettings.shawlsPage.gentsHeader, ...(dbSettings.shawlsPage?.gentsHeader || {}) },
        gentsShawls: Array.isArray(dbSettings.shawlsPage?.gentsShawls) && dbSettings.shawlsPage.gentsShawls.length > 0
          ? dbSettings.shawlsPage.gentsShawls
          : defaultSettings.shawlsPage.gentsShawls,
        guideHeader: { ...defaultSettings.shawlsPage.guideHeader, ...(dbSettings.shawlsPage?.guideHeader || {}) },
        guideItems: Array.isArray(dbSettings.shawlsPage?.guideItems) && dbSettings.shawlsPage.guideItems.length > 0
          ? dbSettings.shawlsPage.guideItems
          : defaultSettings.shawlsPage.guideItems,
        faqsHeader: { ...defaultSettings.shawlsPage.faqsHeader, ...(dbSettings.shawlsPage?.faqsHeader || {}) },
        faqs: Array.isArray(dbSettings.shawlsPage?.faqs) && dbSettings.shawlsPage.faqs.length > 0
          ? dbSettings.shawlsPage.faqs
          : defaultSettings.shawlsPage.faqs,
        storeCard: { ...defaultSettings.shawlsPage.storeCard, ...(dbSettings.shawlsPage?.storeCard || {}) },
      },
    };

    return sanitizeSettings(raw);
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
      const safeAccent = theme.accent && !['#b88636', '#b28342'].includes(theme.accent) ? theme.accent : '#7d5218';
      root.style.setProperty('--accent', safeAccent);
      const safeGold = theme.gold && !['#b88636', '#b28342'].includes(theme.gold) ? theme.gold : '#dfb76c';
      root.style.setProperty('--gold', safeGold);
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
