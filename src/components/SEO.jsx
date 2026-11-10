import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal SEO & Meta Tags Manager for Baldevji Jitmal
 * Dynamically updates document head, OpenGraph, Twitter Cards, Canonical links,
 * and JSON-LD Breadcrumbs for optimal search engine crawling and rich snippets.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://www.baldevjijitmal.in/logo-baldevji-jitmal-refined.png',
  ogType = 'website',
  noindex = false,
  breadcrumbs = [],
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const baseTitle = 'Baldevji Jitmal — Wholesale Traditional Textiles, Indore';
    const finalTitle = title ? (title.includes('Baldevji Jitmal') ? title : `${title} | Baldevji Jitmal`) : baseTitle;
    document.title = finalTitle;

    // Helper to set or create meta tag
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta description & keywords
    const defaultDesc =
      'Baldevji Jitmal: trusted wholesale supplier of dhotis, dupattas, shawls, bedsheets, towels and Bhagalpuri silk sets from M.T. Cloth Market, Indore.';
    setMeta('name', 'description', description || defaultDesc);

    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    // 3. Robots (noindex/nofollow for admin/login)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 4. Canonical link
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.baldevjijitmal.in';
    const finalCanonical = canonical || `${currentOrigin}${location.pathname}${location.search ? location.search : ''}`;
    let canonEl = document.querySelector('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement('link');
      canonEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonEl);
    }
    canonEl.setAttribute('href', finalCanonical);

    // 5. OpenGraph Tags
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', description || defaultDesc);
    setMeta('property', 'og:url', finalCanonical);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', 'Baldevji Jitmal');
    setMeta('property', 'og:locale', 'en_IN');

    // 6. Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', description || defaultDesc);
    setMeta('name', 'twitter:image', ogImage);

    // 7. Dynamic JSON-LD Breadcrumbs
    let breadcrumbScript = document.getElementById('seo-dynamic-breadcrumbs');
    if (breadcrumbs && breadcrumbs.length > 0) {
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'seo-dynamic-breadcrumbs';
        breadcrumbScript.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScript);
      }
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${currentOrigin}${crumb.url}`,
        })),
      };
      breadcrumbScript.textContent = JSON.stringify(schemaData);
    } else if (breadcrumbScript) {
      breadcrumbScript.remove();
    }
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, breadcrumbs, location]);

  return null;
}
