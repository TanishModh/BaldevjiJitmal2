import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';

export default function Footer() {
  const settings = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Top Gold Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>

      {/* Background Watermark */}
      <div
        className="pointer-events-none absolute -right-20 top-8 font-display text-[15rem] leading-none text-primary-foreground/[0.025] select-none"
        aria-hidden="true"
      >
        {settings.footer?.watermark || settings.brand?.initials || 'BJ'}
      </div>

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
              <p className="mt-1 text-[9px] uppercase tracking-wider text-accent">
                {settings.brand.tagline || 'Textiles · Indore'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
            {settings.footer.blurb ||
              'A trusted name in traditional Indian textiles since 1937 — authentic dhotis, dupattas, shawls, bedsheets, and ceremonial fabrics from the heart of Indore.'}
          </p>
        </div>

        {/* Visit Us */}
        <div className="text-sm space-y-2">
          <h4 className="font-display text-2xl text-accent mb-4">Visit Us</h4>
          <p className="flex items-start gap-2 text-primary-foreground/70">
            <MapPin size={16} className="mt-0.5 text-accent shrink-0" />
            <span>{settings.contact.address || '221, M.T. Cloth Market, Indore, MP'}</span>
          </p>
          <div className="flex items-start gap-2 text-primary-foreground/70">
            <Phone size={16} className="mt-1 text-accent shrink-0" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <a href="tel:07312459280" className="hover:text-accent transition-colors font-mono">
                  0731-2459280
                </a>
              </p>
              <p className="flex items-center gap-2 flex-wrap font-mono">
                <a href="tel:+917828072394" className="hover:text-accent transition-colors">
                  +91 78280 72394
                </a>
                <span className="text-primary-foreground/35">·</span>
                <a href="tel:+919827213393" className="hover:text-accent transition-colors">
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
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors"
            >
              <Instagram size={16} className="text-accent shrink-0" />
              <span>{settings.contact.instagramHandle || '@baldevji.jitmal'}</span>
            </a>
          )}
        </div>

        {/* Explore Links */}
        <div className="text-sm">
          <h4 className="font-display text-2xl text-accent mb-4">Explore</h4>
          <ul className="space-y-2 text-primary-foreground/70">
            <li>
              <Link to="/about" className="transition-colors hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition-colors hover:text-accent">
                Products
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="transition-colors hover:text-accent">
                Catalogue
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-xs opacity-60 transition-colors hover:text-accent hover:opacity-100"
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
          <MapPin size={18} className="text-accent" /> Find us on the map
        </h4>
        <div className="overflow-hidden border border-accent/30 shadow-lift rounded-sm">
          <iframe
            title="Baldevji Jitmal — 221, M.T. Cloth Market, Indore"
            src={
              settings.contact.mapEmbedUrl ||
              'https://www.google.com/maps?q=Baldevji+Jitmal+Jitmal+%26+Sons+221+M.T.+Cloth+Market+Indore&output=embed'
            }
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
        <a
          href={settings.contact.mapDirectionsUrl || 'https://maps.app.goo.gl/Rv2U7Fw3jMkcTBAx5'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm text-accent border-b border-accent/50 pb-1 hover:gap-3 transition-all"
        >
          Get directions <MapPin size={14} />
        </a>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-primary-foreground/10 py-5 text-center text-[10px] uppercase tracking-[0.18em] text-primary-foreground/50">
        © {currentYear} {settings.footer.copyrightNotice || 'Baldevji Jitmal. All rights reserved.'}
      </div>
    </footer>
  );
}
