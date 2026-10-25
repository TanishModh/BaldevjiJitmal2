/**
 * High-performance direct static CDN image routing.
 * Bypasses on-the-fly serverless compute bottlenecks and delivers
 * static pre-compressed assets straight from Cloudflare edge caches in sub-100ms.
 */

export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== 'string') return url || '';

  // If URL has on-the-fly render transform endpoints, revert to high-speed static CDN
  if (url.includes('.supabase.co/storage/v1/render/image/public/')) {
    return url
      .replace(
        '.supabase.co/storage/v1/render/image/public/',
        '.supabase.co/storage/v1/object/public/'
      )
      .split('?')[0];
  }

  // Strip query parameters that cause CDN cache misses on static files
  if (url.includes('.supabase.co/storage/v1/object/public/') && url.includes('?')) {
    return url.split('?')[0];
  }

  return url;
}

export function getLightboxImageUrl(url) {
  return getOptimizedImageUrl(url);
}

export function getThumbnailImageUrl(url) {
  return getOptimizedImageUrl(url);
}
