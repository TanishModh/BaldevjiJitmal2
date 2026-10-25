import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteContext';

const normalize = (str) => (str ?? '').trim().toLowerCase();

const OVERSIZED_CATEGORY_OVERRIDES = {
  '1785152462084-1m5era.png': '/assets/categories/cat-aasan.jpg',
  '1785158017108-gmbl9y.png': '/assets/categories/cat-towels.jpg',
  '1785749475034-sosqwz.png': '/assets/categories/cat-bedsheets.jpg',
};

function getCategoryThumbnail(url) {
  if (!url || typeof url !== 'string') return url;
  for (const [rawName, localOpt] of Object.entries(OVERSIZED_CATEGORY_OVERRIDES)) {
    if (url.includes(rawName)) return localOpt;
  }
  return url;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, thumbnail_url, sort_order')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.warn('Error fetching categories:', error.message);
        return [];
      }
      return data ?? [];
    },
  });
}

export function useProductCards() {
  const { data: dbCategories = [], isLoading } = useCategories();
  const settings = useSiteSettings();

  const existingKeys = new Set(
    dbCategories.flatMap((c) => [normalize(c.name), normalize(c.slug)]).filter(Boolean)
  );

  const dbCards = dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    imageUrl: getCategoryThumbnail(c.thumbnail_url),
    categoryParam: c.name,
    source: 'category',
  }));

  const highlightCards = (settings.highlights ?? [])
    .map((h, idx) => ({
      id: `hl-${idx}`,
      name: h.title,
      description: h.desc ?? null,
      imageUrl: h.imageUrl || null,
      categoryParam: (h.categorySlug?.trim() || h.title || '').trim(),
      source: 'highlight',
    }))
    .filter(
      (h) =>
        h.name &&
        !existingKeys.has(normalize(h.name)) &&
        !existingKeys.has(normalize(h.categoryParam))
    );

  return {
    cards: [...dbCards, ...highlightCards],
    dbCats: dbCategories,
    isLoading,
  };
}

export function useCategoryCanonicalizer() {
  const { data: dbCategories = [] } = useCategories();
  const map = new Map();

  for (const c of dbCategories) {
    map.set(normalize(c.name), c.name);
    map.set(normalize(c.slug), c.name);
  }

  return (val) => {
    const trimmed = (val ?? '').trim();
    return map.get(normalize(trimmed)) ?? trimmed;
  };
}
