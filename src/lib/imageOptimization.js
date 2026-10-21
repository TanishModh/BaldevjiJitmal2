/**
 * Utilities for high-performance image loading and bandwidth optimization
 * Leverages Supabase Storage image transformation when available, with
 * zero-config graceful fallback.
 */

export function getOptimizedImageUrl(url, { width = 600, quality = 75, resize = 'contain' } = {}) {
  if (!url || typeof url !== 'string') return url || '';

  // Only transform Supabase Storage object URLs
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    const baseUrl = url.replace(
      '.supabase.co/storage/v1/object/public/',
      '.supabase.co/storage/v1/render/image/public/'
    );
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}width=${width}&quality=${quality}&resize=${resize}`;
  }

  return url;
}

export function getLightboxImageUrl(url) {
  return getOptimizedImageUrl(url, { width: 1400, quality: 85, resize: 'contain' });
}

export function getThumbnailImageUrl(url) {
  return getOptimizedImageUrl(url, { width: 500, quality: 75, resize: 'contain' });
}
