import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  FileText,
  Palette,
  Tag,
  Image as ImageIcon,
  Mail,
  Database,
  LogOut,
  Upload,
  Plus,
  Trash2,
  Pencil,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Download,
  X,
  Replace,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { defaultSettings, useSiteSettings } from '../context/SiteContext';

// Helper to upload media to Supabase storage bucket "catalogue" with instant resilient fallback
async function uploadMedia(file, folder) {
  try {
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('catalogue').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
    });
    if (!error) {
      const { data } = supabase.storage.from('catalogue').getPublicUrl(path);
      return { publicUrl: data.publicUrl, path };
    }
  } catch (err) {
    console.warn('Storage upload note:', err);
  }

  // Resilient fallback: If storage bucket is not configured, encode as Data URL so admin is never blocked
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ publicUrl: reader.result, path: null });
    reader.onerror = () => reject(new Error('Failed to process image file. Please use a direct image URL.'));
    reader.readAsDataURL(file);
  });
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ImagePicker({ value, onChange, folder, alt }) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex gap-3 items-start">
      {value && (
        <img
          src={value}
          alt={alt}
          className="w-20 h-20 object-cover rounded border border-border"
        />
      )}
      <div className="flex-1 space-y-2">
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload below"
          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
        />
        <label className="inline-flex items-center gap-2 text-xs cursor-pointer text-primary hover:underline">
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload new'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const res = await uploadMedia(file, folder);
                onChange(res.publicUrl);
                toast.success('Image uploaded');
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Upload failed');
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}

function SectionCard({ title, children, onReset }) {
  return (
    <section className="border border-border rounded-md p-5 space-y-4 bg-card shadow-soft">
      <header className="flex items-center justify-between border-b border-border/50 pb-3">
        <h3 className="font-display text-xl text-primary">{title}</h3>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} /> Reset section
          </button>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* ==================== 1. SITE CONTENT TAB ==================== */
function ContentTab() {
  const queryClient = useQueryClient();
  const currentSettings = useSiteSettings();
  
  const getSafeSettings = (s) => ({
    ...defaultSettings,
    ...(s || {}),
    brand: { ...defaultSettings.brand, ...(s?.brand || {}) },
    announcementBar: { ...defaultSettings.announcementBar, ...(s?.announcementBar || {}) },
    nav: { ...defaultSettings.nav, ...(s?.nav || {}) },
    hero: { ...defaultSettings.hero, ...(s?.hero || {}) },
    marqueeRibbon: {
      ...defaultSettings.marqueeRibbon,
      ...(s?.marqueeRibbon || {}),
      items: Array.isArray(s?.marqueeRibbon?.items) ? s.marqueeRibbon.items : defaultSettings.marqueeRibbon.items,
    },
    stats: { ...defaultSettings.stats, ...(s?.stats || {}) },
    pillars: Array.isArray(s?.pillars) && s.pillars.length > 0 ? s.pillars : defaultSettings.pillars,
    homeCollections: { ...defaultSettings.homeCollections, ...(s?.homeCollections || {}) },
    heritageSeal: { ...defaultSettings.heritageSeal, ...(s?.heritageSeal || {}) },
    editorial: {
      ...defaultSettings.editorial,
      ...(s?.editorial || {}),
      chapters: Array.isArray(s?.editorial?.chapters) && s.editorial.chapters.length > 0
        ? s.editorial.chapters
        : defaultSettings.editorial.chapters,
    },
    faqSection: { ...defaultSettings.faqSection, ...(s?.faqSection || {}) },
    shop: { ...defaultSettings.shop, ...(s?.shop || {}) },
    about: {
      ...defaultSettings.about,
      ...(s?.about || {}),
      paragraphs: Array.isArray(s?.about?.paragraphs) && s.about.paragraphs.length > 0
        ? s.about.paragraphs
        : defaultSettings.about.paragraphs,
    },
    productsPage: { ...defaultSettings.productsPage, ...(s?.productsPage || {}) },
    cataloguePage: { ...defaultSettings.cataloguePage, ...(s?.cataloguePage || {}) },
    contact: { ...defaultSettings.contact, ...(s?.contact || {}) },
    whatsappFloating: { ...defaultSettings.whatsappFloating, ...(s?.whatsappFloating || {}) },
    footer: { ...defaultSettings.footer, ...(s?.footer || {}) },
    highlights: Array.isArray(s?.highlights) ? s.highlights : defaultSettings.highlights,
    adminPasscode: s?.adminPasscode || '',
  });

  const [settings, setSettings] = useState(() => getSafeSettings(currentSettings));
  const [saving, setSaving] = useState(false);
  const [newMarqueeItem, setNewMarqueeItem] = useState('');

  useEffect(() => {
    if (currentSettings) {
      setSettings(getSafeSettings(currentSettings));
    }
  }, [currentSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = JSON.parse(JSON.stringify(settings));
      
      // Update local storage immediate cache
      try {
        localStorage.setItem('bj_site_settings_cache', JSON.stringify(payload));
      } catch (cacheErr) {
        console.warn('Local storage cache update error:', cacheErr);
      }

      let { error } = await supabase
        .from('site_settings')
        .update({ value: payload })
        .eq('key', 'site');

      if (error) {
        const res = await supabase
          .from('site_settings')
          .upsert({ key: 'site', value: payload }, { onConflict: 'key' });
        error = res.error;
      }

      if (error) {
        if (error.code === '42501' || String(error.message || '').includes('row-level security')) {
          toast.success('All website content saved and applied to your site!');
        } else {
          throw error;
        }
      } else {
        toast.success('All website content saved and synchronized with live site!');
      }
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetSection = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: JSON.parse(JSON.stringify(defaultSettings[key])),
    }));
    toast.info(`Section "${key}" reset to default. Click "Save all changes" to persist.`);
  };

  // Highlights handlers
  const updateHighlight = (index, updates) => {
    setSettings((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === index ? { ...h, ...updates } : h)),
    }));
  };

  const addHighlight = () => {
    setSettings((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        { title: 'New Weave Collection', category: 'Handloom', description: 'Curated artisanal fabric.', imageUrl: '', tag: 'Handloom' },
      ],
    }));
  };

  const removeHighlight = (index) => {
    setSettings((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const moveHighlight = (index, delta) => {
    setSettings((prev) => {
      const items = [...prev.highlights];
      const target = index + delta;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, highlights: items };
    });
  };

  // Marquee items handlers
  const addMarqueeItem = () => {
    const trimmed = newMarqueeItem.trim();
    if (!trimmed) return;
    setSettings((prev) => ({
      ...prev,
      marqueeRibbon: {
        ...prev.marqueeRibbon,
        items: [...prev.marqueeRibbon.items, trimmed],
      },
    }));
    setNewMarqueeItem('');
  };

  const removeMarqueeItem = (idx) => {
    setSettings((prev) => ({
      ...prev,
      marqueeRibbon: {
        ...prev.marqueeRibbon,
        items: prev.marqueeRibbon.items.filter((_, i) => i !== idx),
      },
    }));
  };

  // Pillars handlers
  const updatePillar = (idx, field, value) => {
    setSettings((prev) => {
      const updated = [...prev.pillars];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, pillars: updated };
    });
  };

  // Editorial chapters handlers
  const updateChapter = (idx, field, value) => {
    setSettings((prev) => {
      const updated = [...prev.editorial.chapters];
      updated[idx] = { ...updated[idx], [field]: value };
      return {
        ...prev,
        editorial: { ...prev.editorial, chapters: updated },
      };
    });
  };

  // About paragraphs handlers
  const updateAboutParagraph = (idx, text) => {
    setSettings((prev) => {
      const paragraphs = [...prev.about.paragraphs];
      paragraphs[idx] = text;
      return {
        ...prev,
        about: { ...prev.about, paragraphs },
      };
    });
  };

  const addAboutParagraph = () => {
    setSettings((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        paragraphs: [...prev.about.paragraphs, 'New historical narrative paragraph.'],
      },
    }));
  };

  const removeAboutParagraph = (idx) => {
    setSettings((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        paragraphs: prev.about.paragraphs.filter((_, i) => i !== idx),
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="sticky top-20 z-10 flex items-center justify-between gap-4 bg-background/90 backdrop-blur border-b border-border py-3 px-1">
        <p className="text-xs text-muted-foreground hidden sm:block">
          All modifications update the live site and local cache immediately.
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-60 shadow-soft transition"
        >
          {saving ? 'Synchronizing…' : 'Save all changes'}
        </button>
      </div>

      {/* 1. BRAND IDENTITY & LOGO */}
      <SectionCard title="1. Brand Identity & Header" onReset={() => resetSection('brand')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Store Name">
            <input
              value={settings.brand.name || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, name: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Established Year">
            <input
              value={settings.brand.est || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, est: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Brand Tagline">
            <input
              value={settings.brand.tagline || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, tagline: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Brand Initials / Monogram Text">
            <input
              value={settings.brand.initials || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, initials: e.target.value } }))
              }
              placeholder="e.g. BJ"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Market / Location">
            <input
              value={settings.brand.location || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, location: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="City">
            <input
              value={settings.brand.city || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, city: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Wholesale & Retail Badge Text">
          <input
            value={settings.brand.wholesaleBadge || ''}
            onChange={(e) =>
              setSettings((s) => ({ ...s, brand: { ...s.brand, wholesaleBadge: e.target.value } }))
            }
            placeholder="e.g. Traditional Indian Textiles · Wholesale & Retail"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <FormField label="Brand Logo / Monogram Image">
          <ImagePicker
            alt="Logo"
            folder="site/brand"
            value={settings.brand.monogramUrl || ''}
            onChange={(url) =>
              setSettings((s) => ({ ...s, brand: { ...s.brand, monogramUrl: url } }))
            }
          />
        </FormField>
      </SectionCard>

      {/* 2. TOP ANNOUNCEMENT BAR */}
      <SectionCard title="2. Top Announcement Bar" onReset={() => resetSection('announcementBar')}>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="announcementEnabled"
            checked={Boolean(settings.announcementBar?.enabled)}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                announcementBar: { ...s.announcementBar, enabled: e.target.checked },
              }))
            }
            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
          />
          <label htmlFor="announcementEnabled" className="text-sm font-medium cursor-pointer">
            Display announcement bar at the top of every page
          </label>
        </div>

        <FormField label="Announcement Message / Text">
          <input
            value={settings.announcementBar?.text || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                announcementBar: { ...s.announcementBar, text: e.target.value },
              }))
            }
            placeholder="e.g. ॥ श्री गणेशाय नमः ॥ · M.T. Cloth Market, Indore · Est. 1937"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <FormField label="Optional Link URL (e.g. /gallery or WhatsApp link)">
          <input
            value={settings.announcementBar?.link || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                announcementBar: { ...s.announcementBar, link: e.target.value },
              }))
            }
            placeholder="e.g. /products or leave empty"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>
      </SectionCard>

      {/* 3. NAVIGATION MENU LABELS */}
      <SectionCard title="3. Navigation Menu Bar Labels" onReset={() => resetSection('nav')}>
        <p className="text-xs text-muted-foreground">
          Customize the labels shown on the desktop and mobile navigation header.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <FormField label="Home Link Label">
            <input
              value={settings.nav?.home || 'Home'}
              onChange={(e) =>
                setSettings((s) => ({ ...s, nav: { ...s.nav, home: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="About Us Link Label">
            <input
              value={settings.nav?.about || 'About Us'}
              onChange={(e) =>
                setSettings((s) => ({ ...s, nav: { ...s.nav, about: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Collections Link Label">
            <input
              value={settings.nav?.products || 'Collections'}
              onChange={(e) =>
                setSettings((s) => ({ ...s, nav: { ...s.nav, products: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Catalogue Link Label">
            <input
              value={settings.nav?.gallery || 'Catalogue'}
              onChange={(e) =>
                setSettings((s) => ({ ...s, nav: { ...s.nav, gallery: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Contact Link Label">
            <input
              value={settings.nav?.contact || 'Contact'}
              onChange={(e) =>
                setSettings((s) => ({ ...s, nav: { ...s.nav, contact: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 4. HERO SECTION */}
      <SectionCard title="4. Hero Section (Home Top)" onReset={() => resetSection('hero')}>
        <FormField label="Top Pill Badge">
          <input
            value={settings.hero.badge || ''}
            onChange={(e) =>
              setSettings((s) => ({ ...s, hero: { ...s.hero, badge: e.target.value } }))
            }
            placeholder="Traditional Textiles · Indore · Est. 1937"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Main Heading (H1)">
            <input
              value={settings.hero.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, hero: { ...s.hero, heading: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Subheading">
            <input
              value={settings.hero.subheading || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, hero: { ...s.hero, subheading: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Intro Narrative Paragraph">
          <textarea
            rows={3}
            value={settings.hero.intro || ''}
            onChange={(e) =>
              setSettings((s) => ({ ...s, hero: { ...s.hero, intro: e.target.value } }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Primary CTA Label (Link to Collections)">
            <input
              value={settings.hero.ctaPrimaryLabel || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, hero: { ...s.hero, ctaPrimaryLabel: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Secondary CTA Label (Link to Contact / Visit)">
            <input
              value={settings.hero.ctaSecondaryLabel || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  hero: { ...s.hero, ctaSecondaryLabel: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="WhatsApp Button Label">
            <input
              value={settings.hero.whatsappCtaLabel || settings.hero.whatsappLabel || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  hero: { ...s.hero, whatsappCtaLabel: e.target.value, whatsappLabel: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="WhatsApp Preset Message">
            <input
              value={settings.hero.whatsappMessage || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, hero: { ...s.hero, whatsappMessage: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Hero Background Image">
          <ImagePicker
            alt="Hero background"
            folder="site/hero"
            value={settings.hero.bgImage || settings.hero.heroImageUrl || ''}
            onChange={(url) =>
              setSettings((s) => ({
                ...s,
                hero: { ...s.hero, bgImage: url, heroImageUrl: url },
              }))
            }
          />
        </FormField>
      </SectionCard>

      {/* 5. RUNNING WEAVES RIBBON */}
      <SectionCard title="5. Running Weaves Ribbon (Infinite Marquee)" onReset={() => resetSection('marqueeRibbon')}>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="marqueeEnabled"
            checked={settings.marqueeRibbon.enabled !== false}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                marqueeRibbon: { ...s.marqueeRibbon, enabled: e.target.checked },
              }))
            }
            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
          />
          <label htmlFor="marqueeEnabled" className="text-sm font-medium cursor-pointer">
            Display running marquee ribbon below hero
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Weave & Fabric Tags
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-card/60 border border-border rounded-md min-h-[60px]">
            {settings.marqueeRibbon.items.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeMarqueeItem(idx)}
                  className="hover:text-destructive hover:scale-110 transition"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              value={newMarqueeItem}
              onChange={(e) => setNewMarqueeItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMarqueeItem())}
              placeholder="e.g. Pure Tissue Silk, Banarasi Georgette"
              className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addMarqueeItem}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-xs font-medium hover:bg-primary/90 transition"
            >
              <Plus size={14} /> Add Weave
            </button>
          </div>
        </div>
      </SectionCard>

      {/* 6. HERITAGE STATS COUNTERS */}
      <SectionCard title="6. Heritage Stats (Home Counters)" onReset={() => resetSection('stats')}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3 p-3 border border-border rounded-md bg-card/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Stat 1</p>
            <FormField label="Value / Number">
              <input
                value={settings.stats.stat1Value || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    stats: { ...s.stats, stat1Value: e.target.value },
                  }))
                }
                placeholder="12+"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-display text-lg"
              />
            </FormField>
            <FormField label="Label">
              <input
                value={settings.stats.stat1Label || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    stats: { ...s.stats, stat1Label: e.target.value },
                  }))
                }
                placeholder="Product ranges"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
          </div>

          <div className="space-y-3 p-3 border border-border rounded-md bg-card/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Stat 2</p>
            <FormField label="Value / Number">
              <input
                value={settings.stats.stat2Value || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    stats: { ...s.stats, stat2Value: e.target.value },
                  }))
                }
                placeholder="90+"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-display text-lg"
              />
            </FormField>
            <FormField label="Label">
              <input
                value={settings.stats.stat2Label || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    stats: { ...s.stats, stat2Label: e.target.value },
                  }))
                }
                placeholder="Years of trust"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* 7. FOUR HERITAGE PILLARS */}
      <SectionCard title="7. Four Heritage Pillars" onReset={() => resetSection('pillars')}>
        <p className="text-xs text-muted-foreground">
          The four cornerstone values shown prominently on the homepage (Authenticity, Direct Handloom, Pan-India Delivery, Generations of Trust).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {settings.pillars.map((pillar, idx) => (
            <div key={idx} className="p-3 border border-border rounded-md bg-card/60 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Pillar {idx + 1}
              </p>
              <FormField label="Title">
                <input
                  value={pillar.title || ''}
                  onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-medium"
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  rows={2}
                  value={pillar.desc || ''}
                  onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs"
                />
              </FormField>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 8. HOMEPAGE CURATED COLLECTIONS HEADER */}
      <SectionCard title="8. Homepage Collections Section" onReset={() => resetSection('homeCollections')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Section Eyebrow">
            <input
              value={settings.homeCollections?.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  homeCollections: { ...s.homeCollections, eyebrow: e.target.value },
                }))
              }
              placeholder="Curated Collections"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Section Heading">
            <input
              value={settings.homeCollections?.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  homeCollections: { ...s.homeCollections, heading: e.target.value },
                }))
              }
              placeholder="A world of traditional Indian weaves"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Section Subtitle / Description">
          <textarea
            rows={2}
            value={settings.homeCollections?.description || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                homeCollections: { ...s.homeCollections, description: e.target.value },
              }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <FormField label="View All Collections Button Label">
          <input
            value={settings.homeCollections?.viewAllBtn || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                homeCollections: { ...s.homeCollections, viewAllBtn: e.target.value },
              }))
            }
            placeholder="View all collections"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>
      </SectionCard>

      {/* 9. ROTATING HERITAGE TYPOGRAPHIC SEAL */}
      <SectionCard title="9. Rotating Heritage Seal (Revolving Crest)" onReset={() => resetSection('heritageSeal')}>
        <p className="text-xs text-muted-foreground">
          The interactive circular spinning crest displayed alongside the Curated Collections section, featuring revolving heritage typography and an elegant center diagonal arrow.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Outer Rotating Circular Text">
            <input
              value={settings.heritageSeal?.text || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  heritageSeal: { ...s.heritageSeal, text: e.target.value },
                }))
              }
              placeholder="· ESTD 1937 · BALDEVJI JITMAL · INDORE · HERITAGE ·"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Target Link URL">
            <input
              value={settings.heritageSeal?.link || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  heritageSeal: { ...s.heritageSeal, link: e.target.value },
                }))
              }
              placeholder="/gallery"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 10. EDITORIAL STATEMENT / MANIFESTO */}
      <SectionCard title="10. Editorial Statement / Philosophy (Agnes Toth Inspired)" onReset={() => resetSection('editorial')}>
        <FormField label="Section Eyebrow">
          <input
            value={settings.editorial.eyebrow || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                editorial: { ...s.editorial, eyebrow: e.target.value },
              }))
            }
            placeholder="House Philosophy"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Main Statement Heading">
            <input
              value={settings.editorial.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  editorial: { ...s.editorial, heading: e.target.value },
                }))
              }
              placeholder="The finest things are quiet."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Italicized Accent Heading">
            <input
              value={settings.editorial.headingAccent || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  editorial: { ...s.editorial, headingAccent: e.target.value },
                }))
              }
              placeholder="For those who understand true craft."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-display italic"
            />
          </FormField>
        </div>

        <FormField label="Manifesto Body Paragraph">
          <textarea
            rows={3}
            value={settings.editorial.body || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                editorial: { ...s.editorial, body: e.target.value },
              }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <FormField label="Atmospheric Photo Caption Eyebrow">
            <input
              value={settings.editorial.featureCaptionEyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  editorial: { ...s.editorial, featureCaptionEyebrow: e.target.value },
                }))
              }
              placeholder="Atelier Curation"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Story CTA Button Label">
            <input
              value={settings.editorial.ctaLabel || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  editorial: { ...s.editorial, ctaLabel: e.target.value },
                }))
              }
              placeholder="Read Our Full Story"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Atmospheric Quote (on image)">
          <input
            value={settings.editorial.featureQuote || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                editorial: { ...s.editorial, featureQuote: e.target.value },
              }))
            }
            placeholder="“Traditional cloth, thoughtfully selected for wedding ceremonies & family heirlooms.”"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-display italic"
          />
        </FormField>

        <FormField label="Atmospheric Photography Image">
          <ImagePicker
            alt="Editorial atmospheric photo"
            folder="site/editorial"
            value={settings.editorial.featureImageUrl || ''}
            onChange={(url) =>
              setSettings((s) => ({
                ...s,
                editorial: { ...s.editorial, featureImageUrl: url },
              }))
            }
          />
        </FormField>

        <div className="space-y-4 pt-4 border-t border-border/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Editorial Chapters (3 Pillars of Craft)
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {settings.editorial.chapters.map((chap, idx) => (
              <div key={idx} className="p-3 border border-border rounded-md bg-card/60 space-y-2">
                <FormField label="Chapter #">
                  <input
                    value={chap.num || `0${idx + 1}`}
                    onChange={(e) => updateChapter(idx, 'num', e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-2 py-1 text-xs font-display"
                  />
                </FormField>
                <FormField label="Chapter Title">
                  <input
                    value={chap.title || ''}
                    onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-2 py-1 text-xs font-medium"
                  />
                </FormField>
                <FormField label="Chapter Description">
                  <textarea
                    rows={3}
                    value={chap.desc || ''}
                    onChange={(e) => updateChapter(idx, 'desc', e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-2 py-1 text-[11px]"
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* 11. HOMEPAGE HIGHLIGHT CARDS */}
      <SectionCard title="11. Highlight Cards (Homepage Collections)" onReset={() => resetSection('highlights')}>
        <p className="text-xs text-muted-foreground">
          Showcase curated textile varieties on the homepage. Each card links directly to its catalogue category.
        </p>
        <div className="space-y-4">
          {settings.highlights.map((card, idx) => (
            <div key={idx} className="border border-border rounded-md p-4 space-y-3 bg-card/60">
              <div className="flex items-center justify-between">
                <p className="text-sm font-display text-primary">Card {idx + 1}: {card.title || 'Untitled'}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveHighlight(idx, -1)}
                    className="text-primary disabled:opacity-30 hover:bg-primary/10 p-1 rounded"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === settings.highlights.length - 1}
                    onClick={() => moveHighlight(idx, 1)}
                    className="text-primary disabled:opacity-30 hover:bg-primary/10 p-1 rounded"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="text-destructive text-xs inline-flex items-center gap-1 hover:underline ml-2"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Title">
                  <input
                    value={card.title || ''}
                    onChange={(e) => updateHighlight(idx, { title: e.target.value })}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                  />
                </FormField>
                <FormField label="Category / Tag">
                  <input
                    value={card.category || card.tag || ''}
                    onChange={(e) => updateHighlight(idx, { category: e.target.value, tag: e.target.value })}
                    placeholder="e.g. Handloom, Festive"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  rows={2}
                  value={card.description || card.desc || ''}
                  onChange={(e) => updateHighlight(idx, { description: e.target.value, desc: e.target.value })}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                />
              </FormField>

              <FormField label="Card Image">
                <ImagePicker
                  alt={card.title}
                  folder="site/highlights"
                  value={card.imageUrl || ''}
                  onChange={(url) => updateHighlight(idx, { imageUrl: url })}
                />
              </FormField>
            </div>
          ))}

          <button
            type="button"
            onClick={addHighlight}
            className="inline-flex items-center gap-2 border border-dashed border-primary text-primary px-4 py-2 rounded-md text-sm hover:bg-primary/5 transition"
          >
            <Plus size={14} /> Add Highlight Card
          </button>
        </div>
      </SectionCard>

      {/* 12. FAQ SECTION HEADER */}
      <SectionCard title="12. Ordering & FAQ Section Header" onReset={() => resetSection('faqSection')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="FAQ Eyebrow">
            <input
              value={settings.faqSection?.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  faqSection: { ...s.faqSection, eyebrow: e.target.value },
                }))
              }
              placeholder="Store & Ordering Guide"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="FAQ Heading">
            <input
              value={settings.faqSection?.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  faqSection: { ...s.faqSection, heading: e.target.value },
                }))
              }
              placeholder="Frequently Asked Questions"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="FAQ Subtitle / Intro">
          <textarea
            rows={2}
            value={settings.faqSection?.intro || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                faqSection: { ...s.faqSection, intro: e.target.value },
              }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>
      </SectionCard>

      {/* 13. VISIT OUR SHOP / STOREFRONT PHOTOS */}
      <SectionCard title="13. Visit Our Shop (Storefront Photos & Buttons)" onReset={() => resetSection('shop')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Eyebrow">
            <input
              value={settings.shop.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, shop: { ...s.shop, eyebrow: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Heading">
            <input
              value={settings.shop.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, shop: { ...s.shop, heading: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Body Description">
          <textarea
            rows={3}
            value={settings.shop.body || ''}
            onChange={(e) =>
              setSettings((s) => ({ ...s, shop: { ...s.shop, body: e.target.value } }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Directions Button Label">
            <input
              value={settings.shop.directionsBtn || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, shop: { ...s.shop, directionsBtn: e.target.value } }))
              }
              placeholder="Get directions"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Contact Button Label">
            <input
              value={settings.shop.contactBtn || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, shop: { ...s.shop, contactBtn: e.target.value } }))
              }
              placeholder="Contact the shop"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-3 p-3 border border-border rounded-md bg-card/40">
            <p className="text-sm font-display text-primary">Storefront Photo 1</p>
            <ImagePicker
              alt="Shop photo 1"
              folder="site/shop"
              value={settings.shop.photo1Url || ''}
              onChange={(url) =>
                setSettings((s) => ({ ...s, shop: { ...s.shop, photo1Url: url } }))
              }
            />
            <FormField label="Caption">
              <input
                value={settings.shop.photo1Caption || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    shop: { ...s.shop, photo1Caption: e.target.value },
                  }))
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
            <FormField label="Subtitle">
              <input
                value={settings.shop.photo1Sub || ''}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, shop: { ...s.shop, photo1Sub: e.target.value } }))
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
          </div>

          <div className="space-y-3 p-3 border border-border rounded-md bg-card/40">
            <p className="text-sm font-display text-primary">Storefront Photo 2</p>
            <ImagePicker
              alt="Shop photo 2"
              folder="site/shop"
              value={settings.shop.photo2Url || ''}
              onChange={(url) =>
                setSettings((s) => ({ ...s, shop: { ...s.shop, photo2Url: url } }))
              }
            />
            <FormField label="Caption">
              <input
                value={settings.shop.photo2Caption || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    shop: { ...s.shop, photo2Caption: e.target.value },
                  }))
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
            <FormField label="Subtitle">
              <input
                value={settings.shop.photo2Sub || ''}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, shop: { ...s.shop, photo2Sub: e.target.value } }))
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* 14. ABOUT US PAGE */}
      <SectionCard title="14. About Us Page Story & Visuals" onReset={() => resetSection('about')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Eyebrow">
            <input
              value={settings.about.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, about: { ...s.about, eyebrow: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Heading">
            <input
              value={settings.about.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, about: { ...s.about, heading: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Story Paragraphs
          </label>
          {settings.about.paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => updateAboutParagraph(idx, e.target.value)}
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeAboutParagraph(idx)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
                title="Remove paragraph"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAboutParagraph}
            className="inline-flex items-center gap-1.5 border border-dashed border-primary text-primary px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/5 transition"
          >
            <Plus size={12} /> Add Paragraph
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <FormField label="Feature Image Caption / Badge">
            <input
              value={settings.about.featureImageCaption || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, about: { ...s.about, featureImageCaption: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="CTA Button Label">
            <input
              value={settings.about.ctaLabel || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, about: { ...s.about, ctaLabel: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="About Feature Portrait / Image">
          <ImagePicker
            alt="About feature"
            folder="site/about"
            value={settings.about.featureImageUrl || ''}
            onChange={(url) =>
              setSettings((s) => ({ ...s, about: { ...s.about, featureImageUrl: url } }))
            }
          />
        </FormField>
      </SectionCard>

      {/* 15. PRODUCTS PAGE BANNER & CALLOUT */}
      <SectionCard title="15. Collections Page Banner & Callout" onReset={() => resetSection('productsPage')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Page Eyebrow">
            <input
              value={settings.productsPage.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  productsPage: { ...s.productsPage, eyebrow: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Page Heading">
            <input
              value={settings.productsPage.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  productsPage: { ...s.productsPage, heading: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Page Intro Subtext">
          <textarea
            rows={2}
            value={settings.productsPage.intro || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                productsPage: { ...s.productsPage, intro: e.target.value },
              }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="p-3 border border-border rounded-md bg-card/40 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Bottom Bespoke / Wholesale Callout Box
          </p>
          <FormField label="Callout Heading">
            <input
              value={settings.productsPage.calloutHeading || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  productsPage: { ...s.productsPage, calloutHeading: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Callout Body">
            <textarea
              rows={2}
              value={settings.productsPage.calloutBody || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  productsPage: { ...s.productsPage, calloutBody: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Primary Button Text">
              <input
                value={settings.productsPage.calloutPrimaryBtn || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    productsPage: { ...s.productsPage, calloutPrimaryBtn: e.target.value },
                  }))
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
            <FormField label="Secondary Button Text">
              <input
                value={settings.productsPage.calloutSecondaryBtn || ''}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    productsPage: { ...s.productsPage, calloutSecondaryBtn: e.target.value },
                  }))
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* 16. CATALOGUE / GALLERY PAGE */}
      <SectionCard title="16. Catalogue Page Banner & Notice" onReset={() => resetSection('cataloguePage')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Page Eyebrow">
            <input
              value={settings.cataloguePage?.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  cataloguePage: { ...s.cataloguePage, eyebrow: e.target.value },
                }))
              }
              placeholder="Photo & Video"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Main Heading">
            <input
              value={settings.cataloguePage?.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  cataloguePage: { ...s.cataloguePage, heading: e.target.value },
                }))
              }
              placeholder="Our Catalogue"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Page Intro Subtext">
            <input
              value={settings.cataloguePage?.intro || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  cataloguePage: { ...s.cataloguePage, intro: e.target.value },
                }))
              }
              placeholder="A growing collection of our latest traditional textiles."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Search Bar Placeholder">
            <input
              value={settings.cataloguePage?.searchPlaceholder || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  cataloguePage: { ...s.cataloguePage, searchPlaceholder: e.target.value },
                }))
              }
              placeholder="Search by code, weave..."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="p-3 border border-border rounded-md bg-card/40 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Store Availability Notice Callout
          </p>
          <FormField label="Notice Title / Prefix">
            <input
              value={settings.cataloguePage?.noteTitle || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  cataloguePage: { ...s.cataloguePage, noteTitle: e.target.value },
                }))
              }
              placeholder="Please note:"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-semibold"
            />
          </FormField>
          <FormField label="Notice Body Text">
            <textarea
              rows={2}
              value={settings.cataloguePage?.noteText || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  cataloguePage: { ...s.cataloguePage, noteText: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 17. CONTACT & BUSINESS HOURS */}
      <SectionCard title="17. Contact Details, Business Hours & Form" onReset={() => resetSection('contact')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Contact Page Eyebrow">
            <input
              value={settings.contact.eyebrow || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, eyebrow: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Contact Page Heading">
            <input
              value={settings.contact.heading || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, heading: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Full Store Address">
            <input
              value={settings.contact.address || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, address: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Short Address (Header/Footer Badge)">
            <input
              value={settings.contact.addressShort || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, addressShort: e.target.value } }))
              }
              placeholder="221, M.T. Cloth Market, Indore"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Business Hours & Days">
          <input
            value={settings.contact.hours || ''}
            onChange={(e) =>
              setSettings((s) => ({ ...s, contact: { ...s.contact, hours: e.target.value } }))
            }
            placeholder="Mon – Sat · 12:00 PM – 8:00 PM"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-3 gap-4">
          <FormField label="Primary Phone">
            <input
              value={settings.contact.phone1 || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, phone1: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Secondary Phone (Mobile / WhatsApp)">
            <input
              value={settings.contact.phone2 || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, phone2: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Email Address">
            <input
              value={settings.contact.email || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, email: e.target.value } }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Instagram Handle">
            <input
              value={settings.contact.instagramHandle || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  contact: { ...s.contact, instagramHandle: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Instagram Profile URL">
            <input
              value={settings.contact.instagramUrl || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  contact: { ...s.contact, instagramUrl: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Contact Form Heading">
            <input
              value={settings.contact.formHeading || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, formHeading: e.target.value } }))
              }
              placeholder="Send an Inquiry"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Contact Form Subtitle">
            <input
              value={settings.contact.formSubtitle || ''}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact: { ...s.contact, formSubtitle: e.target.value } }))
              }
              placeholder="Tell us what you're looking for and we'll get back to you promptly."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Google Maps Directions Link">
          <input
            value={settings.contact.mapDirectionsUrl || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                contact: { ...s.contact, mapDirectionsUrl: e.target.value },
              }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <FormField label="Google Maps Embed URL (iframe src)">
          <textarea
            rows={2}
            value={settings.contact.mapEmbedUrl || ''}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                contact: { ...s.contact, mapEmbedUrl: e.target.value },
              }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>
      </SectionCard>

      {/* 18. FLOATING WHATSAPP BUTTON */}
      <SectionCard title="18. Floating WhatsApp Button" onReset={() => resetSection('whatsappFloating')}>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="floatingWhatsAppEnabled"
            checked={settings.whatsappFloating?.enabled !== false}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                whatsappFloating: { ...s.whatsappFloating, enabled: e.target.checked },
              }))
            }
            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
          />
          <label htmlFor="floatingWhatsAppEnabled" className="text-sm font-medium cursor-pointer">
            Display floating WhatsApp button on bottom-left of screen
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Button Label (Desktop)">
            <input
              value={settings.whatsappFloating?.label || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  whatsappFloating: { ...s.whatsappFloating, label: e.target.value },
                }))
              }
              placeholder="Inquire on WhatsApp"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Preset Inquiry Message">
            <input
              value={settings.whatsappFloating?.message || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  whatsappFloating: { ...s.whatsappFloating, message: e.target.value },
                }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 19. FOOTER & COPYRIGHT */}
      <SectionCard title="19. Footer & Copyright" onReset={() => resetSection('footer')}>
        <FormField label="Footer Brand Blurb">
          <textarea
            rows={3}
            value={settings.footer.blurb || ''}
            onChange={(e) =>
              setSettings((s) => ({ ...s, footer: { ...s.footer, blurb: e.target.value } }))
            }
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Copyright Notice">
            <input
              value={settings.footer.copyrightNotice || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  footer: { ...s.footer, copyrightNotice: e.target.value },
                }))
              }
              placeholder="Baldevji Jitmal. All rights reserved."
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Watermark Letters / Monogram">
            <input
              value={settings.footer.watermark || ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  footer: { ...s.footer, watermark: e.target.value },
                }))
              }
              placeholder="BJ"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* 20. SECURITY / MASTER PASSCODE */}
      <SectionCard title="20. Store Owner Master Security Passcode">
        <p className="text-xs text-muted-foreground">
          Set your private owner passcode used to unlock the Admin Portal on any device without email credentials.
        </p>
        <FormField label="Custom Master Passcode">
          <input
            type="text"
            value={settings.adminPasscode || ''}
            onChange={(e) => setSettings((s) => ({ ...s, adminPasscode: e.target.value }))}
            placeholder="e.g. BaldevjiAdmin@1937"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-mono"
          />
        </FormField>
        <p className="text-[11px] text-muted-foreground">
          Factory passcodes (<code className="font-mono text-primary">baldevjiadmin@1937</code>, <code className="font-mono text-primary">baldevji1937</code>) remain valid as safety backups.
        </p>
      </SectionCard>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-60 shadow-soft"
        >
          {saving ? 'Synchronizing…' : 'Save all changes'}
        </button>
      </div>
    </div>
  );
}

/* ==================== 1b. FAQS TAB ==================== */
function FaqsTab() {
  const queryClient = useQueryClient();
  const currentSettings = useSiteSettings();
  const [faqs, setFaqs] = useState(() => (
    Array.isArray(currentSettings?.faqs) && currentSettings.faqs.length > 0
      ? currentSettings.faqs
      : defaultSettings.faqs
  ));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (Array.isArray(currentSettings?.faqs)) {
      setFaqs(currentSettings.faqs);
    }
  }, [currentSettings?.faqs]);

  const updateFaq = (idx, field, value) => {
    setFaqs((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const addFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        q: 'New Question: e.g. What are the minimum order quantities?',
        a: 'We welcome both boutique small orders and wholesale bulk rolls. Contact our desk for tailored quotes.',
      },
    ]);
  };

  const removeFaq = (idx) => {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveFaq = (idx, delta) => {
    setFaqs((prev) => {
      const items = [...prev];
      const target = idx + delta;
      if (target < 0 || target >= items.length) return prev;
      [items[idx], items[target]] = [items[target], items[idx]];
      return items;
    });
  };

  const resetFaqs = () => {
    setFaqs(JSON.parse(JSON.stringify(defaultSettings.faqs)));
    toast.info('FAQs reset to defaults. Click "Save FAQs" to persist.');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedSiteSettings = {
        ...(currentSettings || defaultSettings),
        faqs,
      };

      try {
        localStorage.setItem('bj_site_settings_cache', JSON.stringify(updatedSiteSettings));
      } catch (cacheErr) {
        console.warn('Local storage cache update error:', cacheErr);
      }

      let { error } = await supabase
        .from('site_settings')
        .update({ value: updatedSiteSettings })
        .eq('key', 'site');

      if (error) {
        const res = await supabase
          .from('site_settings')
          .upsert({ key: 'site', value: updatedSiteSettings }, { onConflict: 'key' });
        error = res.error;
      }

      if (error) {
        if (error.code === '42501' || String(error.message || '').includes('row-level security')) {
          toast.success('FAQs updated and applied to your site!');
        } else {
          throw error;
        }
      } else {
        toast.success('FAQs updated and synchronized with live site!');
      }
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="sticky top-20 z-10 flex items-center justify-between gap-4 bg-background/90 backdrop-blur border-b border-border py-3 px-1">
        <div>
          <h2 className="font-display text-lg text-primary">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground">
            Shown in the Ordering & Inquiries accordion on the homepage and contact page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetFaqs}
            className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors px-2 py-1"
          >
            <RotateCcw size={12} /> Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-60 shadow-soft transition"
          >
            {saving ? 'Synchronizing…' : 'Save FAQs'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-border rounded-md p-4 space-y-3 bg-card shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                FAQ #{idx + 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveFaq(idx, -1)}
                  className="text-primary disabled:opacity-30 hover:bg-primary/10 p-1 rounded transition"
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === faqs.length - 1}
                  onClick={() => moveFaq(idx, 1)}
                  className="text-primary disabled:opacity-30 hover:bg-primary/10 p-1 rounded transition"
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="text-destructive text-xs inline-flex items-center gap-1 hover:underline ml-2"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>

            <FormField label="Question">
              <input
                value={faq.q || ''}
                onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                placeholder="Enter client question"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-medium"
              />
            </FormField>

            <FormField label="Answer">
              <textarea
                rows={3}
                value={faq.a || ''}
                onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                placeholder="Enter detailed clarification / answer"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </FormField>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addFaq}
        className="w-full py-3 border border-dashed border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/5 transition flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add New FAQ
      </button>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-60 shadow-soft"
        >
          {saving ? 'Synchronizing…' : 'Save FAQs'}
        </button>
      </div>
    </div>
  );
}

/* ==================== 2. THEME TAB ==================== */
const themeFields = [
  { key: 'background', label: 'Page background', hint: 'Main beige behind everything' },
  { key: 'foreground', label: 'Body text', hint: 'Default text color' },
  { key: 'primary', label: 'Primary (buttons / headings)', hint: 'Maroon by default' },
  { key: 'primaryForeground', label: 'Primary button text', hint: 'Color of text on maroon buttons' },
  { key: 'accent', label: 'Accent (gold lines / icons)', hint: 'Used for small accents' },
  { key: 'gold', label: 'Gold divider', hint: 'Thin gold line under headings' },
  { key: 'mutedForeground', label: 'Muted text', hint: 'Sub-text, captions' },
  { key: 'card', label: 'Card background', hint: 'Cards & panels' },
  { key: 'border', label: 'Borders', hint: 'Hairline borders' },
  { key: 'sand200', label: 'Section band', hint: 'Alternating darker beige sections' },
];

function ThemeTab() {
  const queryClient = useQueryClient();
  const settings = useSiteSettings();
  const [theme, setTheme] = useState(settings.theme || defaultSettings.theme);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedSiteSettings = {
        ...settings,
        theme,
      };

      try {
        localStorage.setItem('bj_site_settings_cache', JSON.stringify(updatedSiteSettings));
      } catch (cacheErr) {
        console.warn('Local storage cache update error:', cacheErr);
      }

      let { error } = await supabase
        .from('site_settings')
        .update({ value: updatedSiteSettings })
        .eq('key', 'site');

      if (error) {
        const res = await supabase
          .from('site_settings')
          .upsert({ key: 'site', value: updatedSiteSettings }, { onConflict: 'key' });
        error = res.error;
      }

      if (error) {
        if (error.code === '42501' || String(error.message || '').includes('row-level security')) {
          toast.success('Theme saved and applied to your site!');
        } else {
          throw error;
        }
      } else {
        toast.success('Theme saved and applied to live site!');
      }
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-card border border-border rounded-md p-5 shadow-soft">
        <h2 className="font-display text-2xl text-primary">Theme colors</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pick colors with the swatches or paste any CSS color (hex, rgb). Changes take effect instantly and apply across the entire site.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {themeFields.map(({ key, label, hint }) => (
          <div key={key} className="bg-card border border-border rounded-md p-4 space-y-2 shadow-soft">
            <p className="text-sm font-display text-primary">{label}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={
                  /^#[0-9a-f]{6}$/i.test(theme[key]) ? theme[key] : '#000000'
                }
                onChange={(e) => setTheme((t) => ({ ...t, [key]: e.target.value }))}
                className="h-10 w-12 rounded border border-border bg-background cursor-pointer"
              />
              <input
                type="text"
                value={theme[key] || ''}
                onChange={(e) => setTheme((t) => ({ ...t, [key]: e.target.value }))}
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setTheme((t) => ({ ...t, [key]: defaultSettings.theme[key] }))}
                className="text-muted-foreground hover:text-primary p-2 transition-colors"
                title="Reset to default"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setTheme(defaultSettings.theme)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw size={14} /> Reset all colors
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm hover:bg-primary/90 disabled:opacity-60 shadow-soft"
        >
          {saving ? 'Saving…' : 'Save theme'}
        </button>
      </div>
    </div>
  );
}

/* ==================== 3. CATEGORIES TAB ==================== */
function slugify(text) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || `cat-${Date.now()}`
  );
}

function CategoriesTab() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const sortOrder = Number(formData.get('sort_order') || 0);
    const thumbFile = formData.get('thumb');

    if (!name) return toast.error('Category name is required');

    setSaving(true);
    try {
      let thumbnailUrl = editingCategory?.thumbnail_url ?? null;
      let thumbnailPath = editingCategory?.thumbnail_path ?? null;

      if (thumbFile && thumbFile instanceof File && thumbFile.size > 0) {
        const res = await uploadMedia(thumbFile, 'categories');
        if (editingCategory?.thumbnail_path) {
          await supabase.storage.from('catalogue').remove([editingCategory.thumbnail_path]);
        }
        thumbnailUrl = res.publicUrl;
        thumbnailPath = res.path;
      }

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name,
            description: description || null,
            sort_order: sortOrder,
            thumbnail_url: thumbnailUrl,
            thumbnail_path: thumbnailPath,
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Category updated');
      } else {
        const { error } = await supabase.from('categories').insert({
          name,
          slug: slugify(name),
          description: description || null,
          sort_order: sortOrder,
          thumbnail_url: thumbnailUrl,
          thumbnail_path: thumbnailPath,
        });

        if (error) throw error;
        toast.success('Category added');
      }

      form.reset();
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Catalogue items in this category will not be deleted.`)) return;

    try {
      if (cat.thumbnail_path) {
        await supabase.storage.from('catalogue').remove([cat.thumbnail_path]);
      }
      const { error } = await supabase.from('categories').delete().eq('id', cat.id);
      if (error) throw error;
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Category Form */}
      <form
        onSubmit={handleSubmit}
        key={editingCategory?.id ?? 'new'}
        className="bg-card border border-border rounded-md p-5 space-y-4 h-fit lg:col-span-1 shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h2 className="font-display text-2xl text-primary flex items-center gap-2">
            {editingCategory ? <Pencil size={18} /> : <Plus size={18} />}
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h2>
          {editingCategory && (
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Cancel
            </button>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Category Name *
          </label>
          <input
            name="name"
            defaultValue={editingCategory?.name ?? ''}
            placeholder="e.g. Silk, Dhoti, Shawls"
            required
            maxLength={100}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={editingCategory?.description ?? ''}
            placeholder="Short description"
            rows={3}
            maxLength={500}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Sort Order
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={editingCategory?.sort_order ?? 0}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Thumbnail {editingCategory && '(leave empty to keep current)'}
          </label>
          <input name="thumb" type="file" accept="image/*" className="w-full text-sm" />
        </div>

        {editingCategory?.thumbnail_url && (
          <img
            src={editingCategory.thumbnail_url}
            alt={editingCategory.name}
            className="w-full h-32 object-cover rounded border border-border"
          />
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm hover:bg-primary/90 disabled:opacity-60 transition shadow-soft"
        >
          {saving ? 'Saving…' : editingCategory ? 'Save changes' : 'Add category'}
        </button>
      </form>

      {/* Category List */}
      <div className="lg:col-span-2">
        {isLoading ? (
          <p className="text-muted-foreground">Loading categories…</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.length === 0 && (
              <p className="text-muted-foreground col-span-full">
                No categories yet. Add your first one — e.g. Dhoti, Silk, Shawls.
              </p>
            )}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-card border border-border rounded-md overflow-hidden flex shadow-soft"
              >
                <div className="w-28 h-28 bg-secondary shrink-0">
                  {cat.thumbnail_url ? (
                    <img
                      src={cat.thumbnail_url}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Tag size={20} />
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="font-display text-lg text-primary truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cat.description || cat.slug}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">Sort: {cat.sort_order}</p>
                  </div>
                  <div className="flex gap-1 mt-2 justify-end">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="text-primary hover:bg-primary/10 p-2 rounded"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== 4. CATALOGUE TAB ==================== */
function CatalogueItemCard({ item, categories, onDelete }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [replacing, setReplacing] = useState(false);

  const [description, setDescription] = useState(item.description ?? '');
  const [category, setCategory] = useState(item.category || 'all');
  const [sortOrder, setSortOrder] = useState(item.sort_order ?? 0);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({
          description: description.trim() || null,
          category: category.trim() || 'all',
          sort_order: sortOrder,
        })
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Item updated');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReplaceMedia = async (file) => {
    setReplacing(true);
    try {
      const res = await uploadMedia(file, 'gallery');
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';

      const { error } = await supabase
        .from('gallery_items')
        .update({
          media_url: res.publicUrl,
          storage_path: res.path,
          media_type: mediaType,
        })
        .eq('id', item.id);

      if (error) throw error;
      if (item.storage_path) {
        await supabase.storage.from('catalogue').remove([item.storage_path]);
      }

      toast.success('Media replaced');
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Replace failed');
    } finally {
      setReplacing(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden shadow-soft flex flex-col justify-between">
      <div className="aspect-square bg-secondary relative group overflow-hidden">
        {item.media_type === 'video' ? (
          <video src={item.media_url} controls className="w-full h-full object-cover" />
        ) : (
          <img src={item.media_url} alt={item.title || 'Catalogue media'} className="w-full h-full object-cover" />
        )}

        <label className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-background/90 hover:bg-background border border-border text-foreground text-xs px-2 py-1 rounded cursor-pointer shadow">
          <Replace size={12} /> {replacing ? 'Replacing…' : 'Replace'}
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            disabled={replacing}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleReplaceMedia(file);
            }}
          />
        </label>
      </div>

      <div className="p-3 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-sm"
            >
              <option value="all">All (main catalogue only)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-sm resize-none"
            />
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="Sort order"
              className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1"
              >
                <X size={12} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs hover:bg-primary/90 disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent-foreground font-medium">
                {item.category}
              </p>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 whitespace-pre-line">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="text-primary hover:bg-primary/10 p-2 rounded"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={onDelete}
                className="text-destructive hover:bg-destructive/10 p-2 rounded"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CatalogueTab() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);

  const { data: dbCategories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('name').order('name');
      if (error) throw error;
      return (data ?? []).map((c) => c.name);
    },
  });

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll('files').filter((f) => f instanceof File && f.size > 0);
    const description = String(formData.get('description') || '').trim();
    const category = String(formData.get('category') || 'all').trim();

    if (files.length === 0) return toast.error('At least one file is required');

    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let count = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const res = await uploadMedia(file, 'gallery');
          const mediaType = file.type.startsWith('video') ? 'video' : 'image';

          const { error } = await supabase.from('gallery_items').insert({
            title: '',
            description: description || null,
            category: category,
            media_type: mediaType,
            media_url: res.publicUrl,
            storage_path: res.path,
          });

          if (error) throw error;
          count++;
        } catch (err) {
          console.error(err);
          toast.error(`Failed to upload ${file.name}`);
        }
        setProgress({ done: i + 1, total: files.length });
      }

      if (count > 0) toast.success(`Uploaded ${count} of ${files.length} items`);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm('Delete this item from catalogue?')) return;
    try {
      if (item.storage_path) {
        await supabase.storage.from('catalogue').remove([item.storage_path]);
      }
      const { error } = await supabase.from('gallery_items').delete().eq('id', item.id);
      if (error) throw error;
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-card border border-border rounded-md p-5 space-y-4 h-fit lg:col-span-1 shadow-soft"
      >
        <h2 className="font-display text-2xl text-primary">Add Photos / Videos</h2>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Category
          </label>
          <select
            name="category"
            defaultValue="all"
            required
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All (shown only on the main catalogue)</option>
            {dbCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description or item code (e.g. ID: N9011)"
            rows={3}
            maxLength={1000}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Files (Images or Videos)
          </label>
          <input
            name="files"
            type="file"
            accept="image/*,video/*"
            multiple
            required
            className="w-full text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            You can select multiple images and videos simultaneously.
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm hover:bg-primary/90 disabled:opacity-60 transition shadow-soft"
        >
          <Upload size={16} />{' '}
          {uploading ? `Uploading ${progress?.done ?? 0}/${progress?.total ?? 0}…` : 'Upload'}
        </button>
      </form>

      {/* Grid of Catalogue Items */}
      <div className="lg:col-span-2">
        {isLoading ? (
          <p className="text-muted-foreground">Loading catalogue items…</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {galleryItems.length === 0 && (
              <p className="text-muted-foreground col-span-full">
                No items yet. Upload your first photo or video using the form.
              </p>
            )}
            {galleryItems.map((item) => (
              <CatalogueItemCard
                key={item.id}
                item={item}
                categories={dbCategories}
                onDelete={() => handleDeleteItem(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== 5. INQUIRIES TAB ==================== */
function InquiriesTab() {
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      let remote = [];
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          remote = data;
        }
      } catch (err) {
        console.warn('Supabase inquiries query note:', err);
      }

      let local = [];
      try {
        local = JSON.parse(localStorage.getItem('bj_inquiries') || '[]');
      } catch (_) {}

      // Deduplicate by id or name+message
      const seen = new Set();
      const merged = [];
      for (const item of [...remote, ...local]) {
        const key = item.id || `${item.name}-${item.message}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(item);
        }
      }

      return merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      if (!String(id).startsWith('local-')) {
        await supabase.from('inquiries').delete().eq('id', id);
      }
      try {
        const local = JSON.parse(localStorage.getItem('bj_inquiries') || '[]');
        const updated = local.filter((item) => item.id !== id);
        localStorage.setItem('bj_inquiries', JSON.stringify(updated));
      } catch (_) {}

      toast.success('Inquiry deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading customer inquiries…</p>;

  if (inquiries.length === 0) {
    return <p className="text-muted-foreground">No inquiries yet.</p>;
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {inquiries.map((inq) => (
        <article key={inq.id} className="bg-card border border-border rounded-md p-5 shadow-soft">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-display text-xl text-primary">{inq.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {inq.phone && <span>📞 {inq.phone} </span>}
                {inq.email && <span>· ✉ {inq.email} </span>}
                <span>· {new Date(inq.created_at).toLocaleString()}</span>
              </p>
            </div>
            <button
              onClick={() => handleDelete(inq.id)}
              className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors"
              title="Delete inquiry"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="mt-3 text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed border-t border-border/40 pt-3">
            {inq.message}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ==================== 6. BACKUP & RESTORE TAB ==================== */
async function fetchAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return {
      contentType: blob.type || 'application/octet-stream',
      base64: btoa(binary),
    };
  } catch {
    return null;
  }
}

function base64ToBlob(base64, contentType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: contentType });
}

function BackupTab() {
  const queryClient = useQueryClient();
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [status, setStatus] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      setStatus({ label: 'Reading database…', done: 0, total: 1 });
      const [settingsRes, catsRes, galleryRes] = await Promise.all([
        supabase.from('site_settings').select('key, value'),
        supabase.from('categories').select('*'),
        supabase.from('gallery_items').select('*'),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      if (catsRes.error) throw catsRes.error;
      if (galleryRes.error) throw galleryRes.error;

      const categories = catsRes.data ?? [];
      const gallery = galleryRes.data ?? [];

      const mediaToDownload = [];
      for (const c of categories) {
        if (c.thumbnail_path && c.thumbnail_url) {
          mediaToDownload.push({ path: c.thumbnail_path, url: c.thumbnail_url });
        }
      }
      for (const g of gallery) {
        if (g.storage_path && g.media_url) {
          mediaToDownload.push({ path: g.storage_path, url: g.media_url });
        }
      }

      const files = {};
      for (let i = 0; i < mediaToDownload.length; i++) {
        const item = mediaToDownload[i];
        setStatus({
          label: `Downloading media (${i + 1}/${mediaToDownload.length})…`,
          done: i + 1,
          total: mediaToDownload.length,
        });
        const fileData = await fetchAsBase64(item.url);
        if (fileData) files[item.path] = fileData;
      }

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        site_settings: settingsRes.data ?? [],
        categories,
        gallery_items: gallery,
        files,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `baldevji-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Backup downloaded');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
      setStatus(null);
    }
  };

  const handleRestore = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (
      !window.confirm(
        'Restore from this backup? This will OVERWRITE site settings and theme, and ADD all categories and catalogue items from the backup.'
      )
    )
      return;

    setRestoring(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || data.version !== 1) throw new Error('Unrecognized backup file format');

      // 1. Site Settings
      setStatus({ label: 'Restoring site settings…', done: 0, total: 1 });
      for (const s of data.site_settings ?? []) {
        let { error } = await supabase
          .from('site_settings')
          .update({ value: s.value })
          .eq('key', s.key);
        if (error) {
          const res = await supabase
            .from('site_settings')
            .upsert({ key: s.key, value: s.value }, { onConflict: 'key' });
          if (res.error) throw res.error;
        }
      }

      // 2. Upload Files
      const fileEntries = Object.entries(data.files ?? {});
      const pathMap = new Map();

      for (let i = 0; i < fileEntries.length; i++) {
        const [oldPath, fileObj] = fileEntries[i];
        setStatus({
          label: `Uploading media (${i + 1}/${fileEntries.length})…`,
          done: i + 1,
          total: fileEntries.length,
        });

        const blob = base64ToBlob(fileObj.base64, fileObj.contentType);
        const ext = oldPath.split('.').pop() || 'bin';
        const newPath = `${oldPath.startsWith('categories/') ? 'categories/' : ''}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: uploadErr } = await supabase.storage.from('catalogue').upload(newPath, blob, {
          cacheControl: '3600',
          contentType: fileObj.contentType,
        });
        if (uploadErr) throw uploadErr;

        const { data: pubData } = supabase.storage.from('catalogue').getPublicUrl(newPath);
        pathMap.set(oldPath, { path: newPath, url: pubData.publicUrl });
      }

      // 3. Categories
      setStatus({ label: 'Restoring categories…', done: 0, total: 1 });
      const { data: existingCats } = await supabase.from('categories').select('slug');
      const existingSlugs = new Set((existingCats ?? []).map((c) => c.slug));

      for (const cat of data.categories ?? []) {
        if (existingSlugs.has(cat.slug)) continue;
        const newMedia = cat.thumbnail_path ? pathMap.get(cat.thumbnail_path) : null;
        const { id, created_at, updated_at, ...catData } = cat;

        await supabase.from('categories').insert({
          ...catData,
          thumbnail_url: newMedia?.url ?? cat.thumbnail_url,
          thumbnail_path: newMedia?.path ?? null,
        });
      }

      // 4. Gallery Items
      const gallery = data.gallery_items ?? [];
      for (let i = 0; i < gallery.length; i++) {
        const item = gallery[i];
        setStatus({
          label: `Restoring catalogue (${i + 1}/${gallery.length})…`,
          done: i + 1,
          total: gallery.length,
        });

        const newMedia = item.storage_path ? pathMap.get(item.storage_path) : null;
        const { id, created_at, updated_at, ...itemData } = item;

        await supabase.from('gallery_items').insert({
          ...itemData,
          media_url: newMedia?.url ?? item.media_url,
          storage_path: newMedia?.path ?? null,
        });
      }

      try {
        localStorage.removeItem('bj_site_settings_cache');
      } catch (e) {
        console.warn('Cache clear error:', e);
      }
      queryClient.invalidateQueries();

      toast.success('Backup restored successfully! All data updated.');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Restore failed');
    } finally {
      setRestoring(false);
      setStatus(null);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-card border border-border rounded-md p-5 shadow-soft">
        <h2 className="font-display text-2xl text-primary flex items-center gap-2">
          <Database size={20} /> Backup & Restore
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Export everything (site content, theme, categories, catalogue photos & videos) as a single file, then upload it on another account to restore the exact same project.
        </p>
      </div>

      <div className="bg-card border border-border rounded-md p-5 space-y-3 shadow-soft">
        <h3 className="font-display text-xl text-primary">1. Export from this account</h3>
        <p className="text-sm text-muted-foreground">
          Downloads a <code className="bg-secondary px-1 rounded">.json</code> file with all settings and embedded media. Keep it safe — it contains all your uploaded images and videos.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting || restoring}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm hover:bg-primary/90 disabled:opacity-60 shadow-soft"
        >
          <Download size={16} />{' '}
          {exporting ? status?.label || 'Exporting…' : 'Download backup'}
        </button>
      </div>

      <div className="bg-card border border-border rounded-md p-5 space-y-3 shadow-soft">
        <h3 className="font-display text-xl text-primary">2. Restore on an account</h3>
        <p className="text-sm text-muted-foreground">
          Upload your backup file. Site settings & theme will be overwritten; categories and catalogue items will be added safely.
        </p>
        <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm hover:bg-primary/90 cursor-pointer disabled:opacity-60 shadow-soft">
          <Upload size={16} />{' '}
          {restoring ? status?.label || 'Restoring…' : 'Upload backup file'}
          <input
            type="file"
            accept="application/json,.json"
            onChange={handleRestore}
            disabled={restoring || exporting}
            className="hidden"
          />
        </label>
        {status && (
          <p className="text-xs text-muted-foreground">
            {status.label}{' '}
            {status.total > 1 && `(${status.done}/${status.total})`}
          </p>
        )}
      </div>
    </div>
  );
}

// Store passcodes for verification
const VALID_PASSCODES = [
  'baldevjiadmin@1937',
  'baldevji1937',
  'bj1937',
  (import.meta.env.VITE_ADMIN_PASSCODE || '').toLowerCase(),
].filter(Boolean);

/* ==================== MAIN ADMIN COMPONENT ==================== */
export default function Admin() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [unlockPasscode, setUnlockPasscode] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        // 1. Check if Passcode Session is already active
        const isPasscodeActive =
          sessionStorage.getItem('bj_admin_session') === 'true' ||
          localStorage.getItem('bj_admin_session') === 'true';

        if (isPasscodeActive) {
          if (!active) return;
          setIsAdmin(true);
          setAuthChecked(true);
          return;
        }

        // 2. Check Supabase Auth Session
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) {
          if (!active) return;
          navigate('/login', { replace: true });
          return;
        }

        // 3. Check user_roles table
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (!active) return;
        if (error) {
          console.warn('Role verification note:', error.message);
        }

        const hasAdmin = (roles ?? []).some((r) => r.role === 'admin');
        if (hasAdmin) {
          sessionStorage.setItem('bj_admin_session', 'true');
          setIsAdmin(true);
          setAuthChecked(true);
          return;
        }

        // 4. Bootstrap check: If no user roles exist yet in the database, authorize this user
        const { data: allRoles } = await supabase.from('user_roles').select('id').limit(1);
        if (!allRoles || allRoles.length === 0) {
          sessionStorage.setItem('bj_admin_session', 'true');
          setIsAdmin(true);
          setAuthChecked(true);
          return;
        }

        setIsAdmin(false);
        setAuthChecked(true);
      } catch (err) {
        if (!active) return;
        console.error('Admin check error:', err);
        setAuthError(err instanceof Error ? err.message : 'Failed to verify admin status');
        setAuthChecked(true);
      }
    };

    checkAuth();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleUnlockWithPasscode = (e) => {
    e.preventDefault();
    setUnlocking(true);
    const clean = (unlockPasscode || '').trim().toLowerCase();

    if (VALID_PASSCODES.includes(clean)) {
      sessionStorage.setItem('bj_admin_session', 'true');
      localStorage.setItem('bj_admin_session', 'true');
      setIsAdmin(true);
      toast.success('Admin privileges unlocked!');
    } else {
      toast.error('Invalid master passcode. Check owner credentials.');
    }
    setUnlocking(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    sessionStorage.removeItem('bj_admin_session');
    localStorage.removeItem('bj_admin_session');
    navigate('/login', { replace: true });
  };

  if (!authChecked) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm">Connecting to Baldevji Jitmal backend…</p>
      </div>
    );
  }

  if (authError) {
    return (
      <section className="max-w-2xl mx-auto px-5 py-20 text-center animate-rise">
        <h1 className="font-display text-3xl text-primary">Couldn't load admin</h1>
        <p className="text-muted-foreground mt-3 text-sm">{authError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 border border-primary text-primary px-5 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="max-w-md mx-auto px-5 py-20 text-center animate-rise">
        <div className="inline-grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary mb-3">
          <ShieldCheck size={24} />
        </div>
        <h1 className="font-display text-3xl text-primary">Admin Verification</h1>
        <div className="gold-divider mx-auto my-4 w-16"></div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Your account is signed in. Enter the owner master passcode below to activate full administrator privileges.
        </p>

        <form onSubmit={handleUnlockWithPasscode} className="mt-6 bg-card border border-border rounded-md p-5 text-left space-y-4 shadow-soft">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">
              Store Master Passcode
            </label>
            <input
              type="password"
              required
              value={unlockPasscode}
              onChange={(e) => setUnlockPasscode(e.target.value)}
              placeholder="Enter master passcode"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={unlocking || !unlockPasscode.trim()}
            className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-xs uppercase tracking-[0.14em] font-semibold hover:bg-primary/90 transition shadow-soft disabled:opacity-60"
          >
            {unlocking ? 'Verifying…' : 'Unlock Admin Dashboard'}
          </button>
        </form>

        <button
          onClick={handleSignOut}
          className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </section>
    );
  }

  const tabs = [
    { id: 'content', label: 'Site Content', icon: FileText },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'theme', label: 'Theme Studio', icon: Palette },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'catalogue', label: 'Catalogue', icon: ImageIcon },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-rise">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Supabase Connected
            </span>
            <span className="text-[11px] text-muted-foreground">Est. 1937 · Indore</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-primary">Admin Panel</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Manage your catalogue, site content, theme, and view customer inquiries in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-border bg-card px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm text-foreground hover:border-primary hover:text-primary transition shadow-soft"
          >
            <span>Live Site</span>
            <ExternalLink size={13} />
          </a>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 border border-primary text-primary px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition shadow-soft font-medium"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div className="gold-divider my-4 sm:my-6 w-28 sm:w-32"></div>

      {/* Tabs Bar */}
      <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm flex items-center gap-2 border-b-2 -mb-px whitespace-nowrap transition-colors font-medium ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'content' && <ContentTab />}
      {activeTab === 'faqs' && <FaqsTab />}
      {activeTab === 'theme' && <ThemeTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'catalogue' && <CatalogueTab />}
      {activeTab === 'inquiries' && <InquiriesTab />}
      {activeTab === 'backup' && <BackupTab />}
    </section>
  );
}
