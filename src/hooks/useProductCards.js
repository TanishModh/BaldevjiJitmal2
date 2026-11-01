import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteContext';
import { getThumbnailImageUrl } from '../lib/imageOptimization';

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
  return getThumbnailImageUrl(url);
}

export const DEFAULT_CATEGORIES = [
  {
    id: '8718fbfe-ef0e-469c-a9a2-1a6608d59ec9',
    name: '3 Piece Set',
    slug: '3-piece-set',
    description: 'Complete set consisting of Dhoti+Dupatta+Kurta cloth.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/categories/1781601985221-hjf3g2.jpg'),
    sort_order: 0,
  },
  {
    id: '53561dda-3850-41d5-89e4-342796af7426',
    name: 'Lungi',
    slug: 'lungi',
    description: '2m/2.25m/2.5m silk and cotton lungis.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/categories/1782908103025-wanuib.jpg'),
    sort_order: 0,
  },
  {
    id: '18fa404a-114a-426c-bc74-6684f3f06d75',
    name: 'Aasan',
    slug: 'aasan',
    description: 'Wide range of woollen, cotton, polyester, velvet pooja aasan in a broad range of colors, prints and styles.',
    thumbnail_url: '/assets/categories/cat-aasan.jpg',
    sort_order: 0,
  },
  {
    id: '3de2ca11-5d2d-4aea-b05c-610c055915cd',
    name: 'Silk',
    slug: 'silk',
    description: 'Premium Artificial silk dhotis and sets — heritage weaves.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/site/highlights/1780566969749-qh7lic.png'),
    sort_order: 0,
  },
  {
    id: 'b4c6609a-1c79-42ba-9ead-02ae30048ba5',
    name: 'Bhagalpuri',
    slug: 'bhagalpuri',
    description: 'Bhagalpuri Dhoti Dupatta sets and chaddars- your all-weather companion.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/site/highlights/1780306620914-jwt94p.png'),
    sort_order: 0,
  },
  {
    id: '99e574c3-0868-41f2-800c-fb306048040b',
    name: 'Kurta Cloth',
    slug: 'kurta-cloth',
    description: 'Full Kurta Cloth- Mix, Cotton, Linen',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/site/highlights/1782903995648-rnvssg.jpg'),
    sort_order: 0,
  },
  {
    id: '94027f9f-d8ca-40b5-8464-64bf0f058b44',
    name: 'Towels/Napkins',
    slug: 'home',
    description: 'Towels and napkins for homes and bulk buyers.',
    thumbnail_url: '/assets/categories/cat-towels.jpg',
    sort_order: 0,
  },
  {
    id: '91110663-1f8b-4e00-8e07-421a36019718',
    name: 'Bedsheets',
    slug: 'bedsheets',
    description: 'Pure Cotton Single and Double-bed bedsheets for daily luxury and comfort.',
    thumbnail_url: '/assets/categories/cat-bedsheets.jpg',
    sort_order: 0,
  },
  {
    id: '6c40939d-6f60-475a-a761-4c400c36a0e6',
    name: 'Dhoti Dupatta Sets',
    slug: 'dhotis',
    description: 'Cotton Dhoti and Dupatta sets, Single Dhotis and Dupattas.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/site/highlights/1782903874479-tp9raw.jpg'),
    sort_order: 0,
  },
  {
    id: '44f9f0df-a3e8-4073-ab88-9eb3c7039b65',
    name: 'Ladies Shawl',
    slug: 'ladies-shawl',
    description: 'Soft pashmina and wool shawls in classic paisley and modern weaves.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/categories/1792937023211-0pbvfg.png'),
    sort_order: 0,
  },
  {
    id: 'f2163a41-aec5-49bd-86bf-c3d1199f5975',
    name: 'Gents Shawl',
    slug: 'gents-shawl',
    description: 'Soft, pashmina and wool shawls in classic paisley and modern weaves.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/categories/1792937367756-qcasx3.png'),
    sort_order: 0,
  },
  {
    id: '9fe5b8bb-7859-4cca-90c0-6e85d4f5ca20',
    name: 'Readymade Dhoti',
    slug: 'readymade-dhoti',
    description: 'Readymade Free Size Dhotis made of entire Dhoti cloth with no compromises. Fits anyone, everyone.',
    thumbnail_url: getThumbnailImageUrl('https://brlkrualghugxskjzydi.supabase.co/storage/v1/object/public/catalogue/categories/1792937455957-3m7n5j.png'),
    sort_order: 0,
  },
];

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    initialData: DEFAULT_CATEGORIES,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, thumbnail_url, sort_order')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.warn('Error fetching categories:', error.message);
        return DEFAULT_CATEGORIES;
      }
      return data ?? DEFAULT_CATEGORIES;
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
