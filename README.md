# Baldevji Jitmal — Wholesale Traditional Textiles, Indore

A high-performance modern web application for **Baldevji Jitmal**, a premier wholesale textile house based in the heritage M.T. Cloth Market in Indore (established 1937).

Rebuilt with clean, maintainable architecture in Vite + React, Tailwind CSS, TanStack Query, and Supabase.

---

## 🌟 Features

- **Heritage Wholesale Aesthetic**: Custom palette featuring royal deep maroon (`#5a1f1c`), parchment beige (`#f1e8d8`), warm gold accents (`#b88636`), and bespoke typography (`Instrument Serif` & `Work Sans`).
- **Interactive Home Page**:
  - Immersive hero section with textured textile background, gold accent line draw, and floating address info.
  - Animated live stat counter for product ranges and years of trust with cubic easing.
  - Curated collections grid with smooth zoom transitions and numbered badges.
  - Heritage quote section with watermark typography.
  - Storefront showcase featuring real Indore storefront photography.
- **Product Collections (`/products`)**:
  - Dynamic category listings sourced directly from Supabase backend.
  - Seamless navigation to collection-specific filtered catalogues.
- **Dynamic Catalogue (`/gallery`)**:
  - Multi-column masonry responsive layout supporting both high-resolution photography and video.
  - Category filter pills with real-time URL synchronization (`?category=...`).
  - Sort options: Random, Newest first, Oldest first.
  - Inline administrative editing for category and description when authenticated.
- **Contact & Wholesale Inquiries (`/contact`)**:
  - Location details, direct calling links (`0731 245 9280`, `+91 78280 72394`), and Instagram integration (`@baldevji.jitmal`).
  - Interactive embedded Google Map.
  - Wholesale inquiry form with client validation, anti-spam honeypot, and Supabase database submission.
- **Full Administrative Suite (`/admin`)**:
  - **Site Content**: Live visual management for brand names, taglines, hero copy, CTAs, contact information, storefront photography, and home highlight cards.
  - **Theme Studio**: Real-time CSS theme customizer with interactive color swatches and hex inputs affecting CSS custom variables across the entire application.
  - **Categories Manager**: Add, edit, sort, and delete categories with automated media upload to Supabase storage.
  - **Catalogue Manager**: Multi-file batch image and video uploader with category tagging, inline description editing, and media replacement.
  - **Customer Inquiries**: Real-time review and triage of incoming customer inquiries.
  - **Backup & Restore**: One-click JSON backup export with embedded base64 media and automated cloud restore capability.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Check `.env`:
```env
VITE_SUPABASE_URL=https://brlkrualghugxskjzydi.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
