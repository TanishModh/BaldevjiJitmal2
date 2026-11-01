import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import LazyMap from './LazyMap';

export default function Footer() {
  const settings = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Top Gold Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>

      {/* Background Watermark */}
      <svg
        className="pointer-events-none absolute -right-20 top-8 select-none overflow-visible w-80 h-80"
        viewBox="0 0 200 120"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display fill-primary-foreground/[0.025] text-8xl font-normal"
        >
          {settings.footer?.watermark || settings.brand?.initials || 'BJ'}
        </text>
      </svg>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20 grid gap-12 md:grid-cols-3">
        {/* Brand Information */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={settings.brand.monogramUrl || '/logo-baldevji-mark-refined.png'}
              alt={settings.brand.name || 'Baldevji Jitmal'}
              className="size-16 shrink-0 object-contain"
              width={80}
              height={80}
            />
            <div className="min-w-0">
              <p className="font-display text-2xl leading-tight text-primary-foreground">
                {settings.brand.name || 'Baldevji Jitmal'}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-[#dfb76c] font-medium">
                {settings.brand.tagline || 'Textiles · Indore'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 max-w-xs">
            {settings.footer.blurb ||
              'A trusted name in traditional Indian textiles since 1937 — authentic dhotis, dupattas, shawls, bedsheets, and ceremonial fabrics from the heart of Indore.'}
          </p>
        </div>

        {/* Visit Us */}
        <div className="text-sm space-y-2">
          <h4 className="font-display text-2xl text-[#dfb76c] mb-4">Visit Us</h4>
          <p className="flex items-start gap-2 text-primary-foreground/80">
            <MapPin size={16} className="mt-0.5 text-[#dfb76c] shrink-0" />
            <span>{settings.contact.address || '221, M.T. Cloth Market, Indore, MP'}</span>
          </p>
          <div className="flex items-start gap-2 text-primary-foreground/80">
            <Phone size={16} className="mt-1 text-[#dfb76c] shrink-0" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <a href="tel:07312459280" className="hover:text-[#dfb76c] transition-colors font-mono">
                  0731-2459280
                </a>
              </p>
              <p className="flex items-center gap-2 flex-wrap font-mono">
                <a href="tel:+917828072394" className="hover:text-[#dfb76c] transition-colors">
                  +91 78280 72394
                </a>
                <span className="text-primary-foreground/45">·</span>
                <a href="tel:+919827213393" className="hover:text-[#dfb76c] transition-colors">
                  +91 98272 13393
                </a>
              </p>
            </div>
          </div>
          {settings.contact.instagramUrl && (
            <a
              href={settings.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-[#dfb76c] transition-colors"
            >
              <Instagram size={16} className="text-[#dfb76c] shrink-0" />
              <span>{settings.contact.instagramHandle || '@baldevji.jitmal'}</span>
            </a>
          )}
        </div>

        {/* Explore Links */}
        <div className="text-sm">
          <h4 className="font-display text-2xl text-[#dfb76c] mb-4">Explore</h4>
          <ul className="space-y-2 text-primary-foreground/80">
            <li>
              <Link to="/about" className="transition-colors hover:text-[#dfb76c]">
                About
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition-colors hover:text-[#dfb76c]">
                Products
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="transition-colors hover:text-[#dfb76c]">
                Catalogue
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-[#dfb76c]">
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-xs text-primary-foreground/75 transition-colors hover:text-[#dfb76c]"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pb-12">
        <h4 className="font-display text-2xl text-primary-foreground mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-[#dfb76c]" /> Find us on the map
        </h4>
        <div className="overflow-hidden border border-[#dfb76c]/30 shadow-lift rounded-sm">
          <LazyMap
            src={
              settings.contact.mapEmbedUrl ||
              'https://www.google.com/maps?q=Baldevji+Jitmal+Jitmal+%26+Sons+221+M.T.+Cloth+Market+Indore&output=embed'
            }
            directionsUrl={settings.contact.mapDirectionsUrl || 'https://maps.app.goo.gl/Rv2U7Fw3jMkcTBAx5'}
          />
        </div>
        <a
          href={settings.contact.mapDirectionsUrl || 'https://maps.app.goo.gl/Rv2U7Fw3jMkcTBAx5'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm text-[#dfb76c] border-b border-[#dfb76c]/50 pb-1 hover:gap-3 transition-all"
        >
          Get directions <MapPin size={14} />
        </a>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-primary-foreground/15 py-5 text-center text-[10px] uppercase tracking-[0.18em] text-primary-foreground/75">
        © {currentYear} {settings.footer.copyrightNotice || 'Baldevji Jitmal. All rights reserved.'}
      </div>
    </footer>
  );
}
