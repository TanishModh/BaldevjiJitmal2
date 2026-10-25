import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Pencil, Trash2, X, Check, Search, Maximize2, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteContext';
import { useProductCards, useCategoryCanonicalizer } from '../hooks/useProductCards';
import { getThumbnailImageUrl } from '../lib/imageOptimization';
import CatalogueLightbox from '../components/CatalogueLightbox';

// Exact duplicate re-uploads in database to filter out permanently
const KNOWN_DUPLICATE_IDS = new Set([
  '2833d458-0398-4a54-b1e0-ed09de557b79', // Silk duplicate of bdeb8fdf-7986-4b37-aa12-8fd6fb2401ea
  '153a8164-a1fc-41e0-b9e5-f68ec801cc07', // Silk duplicate of 2e9fc799-c844-455d-bc57-a8770764bc22
  '7cbf12e3-264f-4983-afb2-a1045bb0066f', // Silk duplicate of 687c389e-9e75-41b3-88d8-9f90b42a3885
  '12aeb09b-466a-42b3-90b7-b0d017a69b95', // Silk duplicate of 33e06747-ae60-47a9-ab32-6881b84973a2
  '91991706-22de-40a8-a28e-eb5f03803402', // Silk duplicate of 55fdb112-ad05-432e-81ec-1bd697f7ec80
]);

function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          if (active) setIsAdmin(false);
          return;
        }
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id);

        if (active) {
          setIsAdmin((roles ?? []).some((r) => r.role === 'admin'));
        }
      } catch (err) {
        console.warn('Admin check error:', err);
        if (active) setIsAdmin(false);
      }
    };

    checkAdmin();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => checkAdmin());

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return isAdmin;
}

function GalleryCard({ item, index = 0, isAdmin, onOpenLightbox, variantLabel }) {
  const queryClient = useQueryClient();
  const settings = useSiteSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description ?? '');
  const [category, setCategory] = useState(item.category || '');

  const isRealItem = !item.id.startsWith('hl-') && !item.id.startsWith('p');
  const canEdit = isAdmin && isRealItem;

  const rawPhone = settings?.contact?.phone2 || settings?.hero?.whatsappPhone || '917869849449';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const rawImg = item.media_url || item.imageUrl || item.thumbnail_url || item.image_url || item.url || '';
  const optimizedImg = getThumbnailImageUrl(rawImg);
  const [displayImg, setDisplayImg] = useState(optimizedImg);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setDisplayImg(getThumbnailImageUrl(rawImg));
    setImgLoaded(false);
  }, [rawImg]);

  const handleImgError = () => {
    if (displayImg !== rawImg && rawImg) {
      setDisplayImg(rawImg);
    }
  };

  const fullImg = rawImg.startsWith('http')
    ? rawImg
    : rawImg && typeof window !== 'undefined'
    ? `${window.location.origin}${rawImg}`
    : '';

  const inquiryMessage = encodeURIComponent(
    `Namaste Baldevji Jitmal, I would like to inquire about this piece from your catalogue:\n\n*Category:* ${item.category || 'Traditional Textile'}\n*Details:* ${item.description || item.title || 'Catalogue piece'}${fullImg ? `\n*Image Link:* ${fullImg}` : ''}\n\nPlease share current price and availability.`
  );
  const whatsappUrl = `https://wa.me/${finalPhone}?text=${inquiryMessage}`;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || 'general',
        })
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Item updated');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.title || item.category || 'this item'}"?`)) return;

    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', item.id);
      if (error) throw error;
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <figure
      onClick={onOpenLightbox}
      className="group overflow-hidden border border-border/70 hover:border-accent/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift cursor-pointer relative rounded-sm flex flex-col h-full"
    >
      <div className="overflow-hidden bg-[#241715]/10 relative aspect-[4/5] sm:aspect-[3/4] w-full shrink-0">
        {/* Luxurious textile specimen placeholder while image buffers */}
        {!imgLoaded && item.media_type !== 'video' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f4ed] via-[#ede0cf] to-[#f4ebe0] flex flex-col items-center justify-center p-3 text-center pointer-events-none transition-opacity duration-300 z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-display text-primary/75 font-semibold">
              {item.category || 'Traditional Textile'}
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-muted-foreground/60 mt-1">
              Authentic Weave
            </span>
          </div>
        )}

        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true, margin: '0px 0px -15px 0px' }}
          transition={{ duration: 0.9, ease: [0.165, 0.84, 0.44, 1] }}
          className="w-full h-full"
        >
          {item.media_type === 'video' ? (
            <video
              src={item.media_url || item.imageUrl || item.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={displayImg}
              alt={item.description || item.category || 'Textile item'}
              loading={index < 8 ? 'eager' : 'lazy'}
              fetchPriority={index < 4 ? 'high' : 'auto'}
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition duration-500 ease-out"
            />
          )}
        </motion.div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 pointer-events-none z-20">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-sm">
            <Maximize2 size={12} /> View Full
          </span>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-[11px] bg-[#25D366] text-white px-2.5 py-1.5 rounded-sm shadow hover:bg-[#20ba59] transition-transform hover:scale-105 active:scale-95 font-medium"
            title="Inquire on WhatsApp"
          >
            <MessageCircle size={13} className="fill-current" /> Inquire
          </a>
        </div>
      </div>

      <figcaption className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between" onClick={(e) => isEditing && e.stopPropagation()}>
        {isEditing && canEdit ? (
          <div className="space-y-2">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-sm"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full bg-background border border-input rounded-md px-2 py-1.5 text-sm resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  setTitle(item.title);
                  setDescription(item.description ?? '');
                  setCategory(item.category);
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1"
              >
                <X size={12} /> Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isSaving}
                className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs hover:bg-primary/90 disabled:opacity-60"
              >
                <Check size={12} /> {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent-foreground font-semibold">
                  {item.category}
                </p>
                {item.title && item.title !== '.' && item.title.toLowerCase() !== 'untitled' && (
                  <h3 className="font-display text-sm sm:text-base text-primary mt-1 line-clamp-1">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 whitespace-pre-line line-clamp-3">
                    {item.description}
                    {variantLabel && (
                      <span className="ml-2 inline-block text-[9px] sm:text-[10px] uppercase tracking-wider text-accent font-semibold bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded-sm">
                        {variantLabel}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {canEdit && (
                <div
                  className="flex flex-col gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:bg-primary/10 p-2 rounded"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Direct Inquire action row for mobile & quick desktop access */}
            <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#128C7E] hover:text-[#075E54] bg-[#25D366]/10 hover:bg-[#25D366]/20 py-1.5 px-3 rounded transition-all active:scale-95"
                title="Inquire on WhatsApp"
              >
                <MessageCircle size={13} className="fill-current text-[#25D366]" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategoryParam = searchParams.get('category');
  const itemIdParam = searchParams.get('item');
  const isAdmin = useIsAdmin();
  const canonicalize = useCategoryCanonicalizer();
  const { cards, dbCats } = useProductCards();
  const settings = useSiteSettings();

  const [sortMode, setSortMode] = useState('random');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const shuffleWeightsRef = useRef(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLightboxItem, setSelectedLightboxItem] = useState(null);

  const handleSortChange = (e) => {
    const nextMode = e.target.value;
    if (nextMode === 'random') {
      shuffleWeightsRef.current.clear();
      setShuffleSeed((s) => s + 1);
    }
    setSortMode(nextMode);
  };

  const { data: rawItems = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('id, title, description, category, media_type, media_url, created_at, sort_order')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching gallery items:', error.message);
        return [];
      }
      return data ?? [];
    },
  });

  const canonicalCategory = rawCategoryParam ? canonicalize(rawCategoryParam) : undefined;

  const normalizedDbItems = useMemo(() => {
    return rawItems
      .filter((item) => !KNOWN_DUPLICATE_IDS.has(item.id))
      .map((item) => {
        let cat = item.category;
        // Fix 20 bedsheet items inadvertently tagged with category "all"
        if ((cat || '').toLowerCase() === 'all') {
          cat = 'Bedsheets';
        }
        return {
          ...item,
          category: canonicalize(cat),
        };
      });
  }, [rawItems, canonicalize]);

  const highlightItems = useMemo(() => {
    return cards
      .filter((c) => c.source === 'highlight' && c.imageUrl && c.categoryParam)
      .map((c) => ({
        id: c.id,
        title: c.name,
        description: c.description,
        category: canonicalize(c.categoryParam),
        media_type: 'image',
        media_url: c.imageUrl,
        created_at: null,
      }));
  }, [cards, canonicalize]);

  const allItems = useMemo(() => {
    const seenIds = new Set();
    const seenUrls = new Set();
    const result = [];

    for (const item of normalizedDbItems) {
      if (KNOWN_DUPLICATE_IDS.has(item.id)) continue;
      const url = (item.media_url || item.imageUrl || '').trim().toLowerCase();
      if (seenIds.has(item.id)) continue;
      if (url && seenUrls.has(url)) continue;
      seenIds.add(item.id);
      if (url) seenUrls.add(url);
      result.push(item);
    }

    for (const h of highlightItems) {
      if (KNOWN_DUPLICATE_IDS.has(h.id)) continue;
      const url = (h.media_url || h.imageUrl || '').trim().toLowerCase();
      const titleCat = `${(h.title || '').toLowerCase()}|${(h.category || '').toLowerCase()}`;
      if (seenIds.has(h.id)) continue;
      if (url && seenUrls.has(url)) continue;
      const exists = result.some(
        (i) => `${(i.title || '').toLowerCase()}|${(i.category || '').toLowerCase()}` === titleCat
      );
      if (exists) continue;
      seenIds.add(h.id);
      if (url) seenUrls.add(url);
      result.push(h);
    }

    return result;
  }, [normalizedDbItems, highlightItems]);

  const filteredItems = useMemo(() => {
    let result = allItems;
    if (canonicalCategory) {
      result = result.filter(
        (item) => (item.category ?? '').toLowerCase() === canonicalCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.category || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [allItems, canonicalCategory, searchQuery]);

  const sortedItems = useMemo(() => {
    const copy = [...filteredItems];
    if (sortMode === 'newest') {
      return copy.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
    }
    if (sortMode === 'oldest') {
      return copy.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeA - timeB;
      });
    }

    // Curated: Display randomly shuffled items, stably preserved for this session
    const weights = shuffleWeightsRef.current;
    copy.forEach((item) => {
      const key = String(item.id || item.title || item.media_url || '');
      if (!weights.has(key)) {
        weights.set(key, Math.random());
      }
    });

    return copy.sort((a, b) => {
      const weightA = weights.get(String(a.id || a.title || a.media_url || '')) ?? 0.5;
      const weightB = weights.get(String(b.id || b.title || b.media_url || '')) ?? 0.5;
      return weightA - weightB;
    });
  }, [filteredItems, sortMode, shuffleSeed]);

  // Variant labels for items sharing the exact same category and description
  const variantMap = useMemo(() => {
    const groups = new Map();
    sortedItems.forEach((item) => {
      const desc = (item.description || '').trim();
      if (!desc) return;
      const key = `${(item.category || '').toLowerCase()}|${desc.toLowerCase()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item.id);
    });

    const map = new Map();
    groups.forEach((ids) => {
      if (ids.length > 1) {
        ids.forEach((id, index) => {
          map.set(id, `Design ${index + 1} of ${ids.length}`);
        });
      }
    });
    return map;
  }, [sortedItems]);

  const BATCH_SIZE = 16;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef(null);

  // Reset pagination whenever category filter, search query, or sort mode changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [canonicalCategory, searchQuery, sortMode]);

  const displayedItems = useMemo(() => {
    return sortedItems.slice(0, visibleCount);
  }, [sortedItems, visibleCount]);

  // Infinite scroll intersection observer: preloads the next batch 800px before the user hits the bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sortedItems.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, sortedItems.length));
        }
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, sortedItems.length]);

  // Deep-link: automatically open lightbox if URL has ?item=
  useEffect(() => {
    if (itemIdParam && allItems.length > 0) {
      const found = allItems.find((i) => String(i.id) === String(itemIdParam));
      if (found) {
        setSelectedLightboxItem(found);
      }
    } else if (!itemIdParam) {
      setSelectedLightboxItem(null);
    }
  }, [itemIdParam, allItems]);

  const handleOpenLightbox = (item) => {
    setSelectedLightboxItem(item);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('item', item.id);
        return next;
      },
      { replace: true }
    );
  };

  const handleCloseLightbox = () => {
    setSelectedLightboxItem(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('item');
        return next;
      },
      { replace: true }
    );
  };

  const handleSelectLightboxItem = (item) => {
    setSelectedLightboxItem(item);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('item', item.id);
        return next;
      },
      { replace: true }
    );
  };

  const categoryFilters = useMemo(() => {
    const set = new Set();
    const result = [];
    const addCat = (c) => {
      const norm = (c || '').trim();
      if (!norm || norm.toLowerCase() === 'all') return;
      const lower = norm.toLowerCase();
      if (!set.has(lower)) {
        set.add(lower);
        result.push(norm);
      }
    };

    dbCats.forEach((c) => addCat(c.name));
    cards.forEach((c) => addCat(c.categoryParam));
    allItems.forEach((i) => addCat(i.category));

    return result;
  }, [dbCats, cards, allItems]);

  return (
    <>
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24 animate-rise">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium">
              {settings.cataloguePage?.eyebrow || 'Photo & Video'}
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-primary mt-4 leading-[1.02]">
              {canonicalCategory ? `${canonicalCategory} Catalogue` : (settings.cataloguePage?.heading || 'Our Catalogue')}
            </h1>
            <div className="gold-divider my-6 w-24"></div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {canonicalCategory
                ? `Showing items in the “${canonicalCategory}” collection.`
                : (settings.cataloguePage?.intro || 'A growing collection of our latest traditional textiles.')}
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder={settings.cataloguePage?.searchPlaceholder || 'Search by code, weave...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-input rounded-full pl-9 pr-8 py-2.5 text-base md:text-xs outline-none focus:border-primary shadow-soft transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Note Callout */}
        <div className="mt-6 sm:mt-8 max-w-3xl border-l-2 border-accent bg-card px-4 sm:px-5 py-3 sm:py-4 shadow-soft text-xs sm:text-sm">
          <p className="text-foreground leading-relaxed">
            <span className="font-semibold text-primary">{settings.cataloguePage?.noteTitle || 'Please note:'} </span>
            {settings.cataloguePage?.noteText ||
              'This catalogue shows a curated selection of our stock. To explore our complete range of fabrics, please visit us at the shop in person or connect with us on WhatsApp.'}
          </p>
        </div>

        {/* Filter Pills: Mobile horizontal swipe with edge-bleed, desktop wrap */}
        {categoryFilters.length > 0 && (
          <div className="mt-5 -mx-5 px-5 md:mx-0 md:px-0 flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x py-1.5 md:flex-wrap">
            <Link
              to="/gallery"
              className={`shrink-0 px-3.5 sm:px-4 py-2 text-[10px] uppercase tracking-[0.12em] border transition rounded-sm whitespace-nowrap active:scale-95 ${
                !canonicalCategory
                  ? 'bg-primary text-primary-foreground border-primary font-medium shadow-soft'
                  : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              All
            </Link>
            {categoryFilters.map((cat) => {
              const isActive =
                canonicalCategory && canonicalCategory.toLowerCase() === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  to={`/gallery?category=${encodeURIComponent(cat)}`}
                  className={`shrink-0 px-3.5 sm:px-4 py-2 text-[10px] uppercase tracking-[0.12em] border transition rounded-sm whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary font-medium shadow-soft'
                      : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        )}

        {/* Controls Bar: Sort Mode */}
        <div className="mt-6 flex items-center justify-end flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-3">
            <label htmlFor="sort-mode" className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Sort by
            </label>
            <select
              id="sort-mode"
              value={sortMode}
              onChange={handleSortChange}
              className="bg-background border border-input rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-soft"
            >
              <option value="random">Curated (Featured)</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Gallery Items Grid */}
        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading catalogue…</p>
        ) : sortedItems.length === 0 ? (
          <p className="mt-10 text-muted-foreground py-12 text-center">
            No items found matching your criteria. Try another search or filter.
          </p>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 items-start">
              {displayedItems.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={idx}
                  isAdmin={isAdmin}
                  onOpenLightbox={() => handleOpenLightbox(item)}
                  variantLabel={variantMap.get(item.id)}
                />
              ))}
            </div>

            {/* Infinite Scroll Sentinel & Fallback Action */}
            {visibleCount < sortedItems.length && (
              <div ref={sentinelRef} className="mt-12 text-center py-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, sortedItems.length))}
                  className="px-6 py-2.5 rounded-full border border-primary/30 hover:border-primary text-xs uppercase tracking-widest text-primary font-medium hover:bg-primary/5 active:scale-95 transition-all shadow-soft"
                >
                  Load More
                </button>
              </div>
            )}

            {visibleCount >= sortedItems.length && sortedItems.length > BATCH_SIZE && (
              <div className="mt-12 text-center py-6 text-xs uppercase tracking-widest text-muted-foreground/70">
                ✦ End of Collection ✦
              </div>
            )}
          </>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedLightboxItem && (
        <CatalogueLightbox
          item={selectedLightboxItem}
          items={sortedItems.length > 0 ? sortedItems : allItems}
          onClose={handleCloseLightbox}
          onSelect={handleSelectLightboxItem}
          variantMap={variantMap}
        />
      )}
    </>
  );
}
