import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFromSupabase } from '../lib/supabaseFetch';

import defaultSettingsData from '../data/defaultSettings.json';

export const defaultSettings = defaultSettingsData;
export const SETTINGS_CACHE_KEY = 'bj_site_settings_v10';

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
      'bj_site_settings_v9',
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
          select: 'value, updated_at',
          key: 'eq.site',
          limit: '1',
        });
        const val = rows && rows.length > 0 ? rows[0].value : null;
        const updatedAt = rows && rows.length > 0 ? rows[0].updated_at : null;

        // If Supabase row was updated AFTER this release (after 2026-11-12T01:30:00Z), use it
        if (val && updatedAt && new Date(updatedAt) > new Date('2026-11-12T01:30:00Z')) {
          try {
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(val));
          } catch (_) {}
          return val;
        }

        // Otherwise, cache and return our fresh defaultSettings containing the user's latest content
        try {
          localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(defaultSettings));
        } catch (_) {}
        return defaultSettings;
      } catch (err) {
        console.warn('Site settings error:', err);
        return getCachedSettings() || defaultSettings;
      }
    },
    initialData: () => getCachedSettings() || defaultSettings,
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
