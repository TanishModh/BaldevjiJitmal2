import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, MapPin, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const settings = useSiteSettings();
  const location = useLocation();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: settings.nav?.home || 'Home' },
    { to: '/about', label: settings.nav?.about || 'About Us' },
    { to: '/products', label: settings.nav?.products || 'Collections' },
    { to: '/gallery', label: settings.nav?.gallery || 'Catalogue' },
    { to: '/contact', label: settings.nav?.contact || 'Contact' },
  ];

  const phone = (settings.contact.phone2 || '78698 49449').replace(/\D/g, '');
  const waNumber = phone.length === 10 ? `91${phone}` : phone;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    settings.hero.whatsappMessage ||
      'Namaste Baldevji Jitmal, I would like to inquire about your traditional textile collection.'
  )}`;

  return (
    <>
      {settings.announcementBar?.enabled && (
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium select-none border-b border-accent/25">
          {settings.announcementBar.link ? (
            <a href={settings.announcementBar.link} className="hover:text-accent transition-colors">
              {settings.announcementBar.text}
            </a>
          ) : (
            <span>{settings.announcementBar.text}</span>
          )}
        </div>
      )}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/70 shadow-[0_1px_0_rgba(178,131,66,0.12)]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[72px] sm:h-20 md:h-24 flex items-center justify-between">
          {/* Brand Emblem & Text */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 leading-tight group">
            <img
              src={settings.brand.monogramUrl || '/logo-baldevji-mark-refined.png'}
              alt={settings.brand.name || 'Baldevji Jitmal'}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
              width={80}
              height={80}
            />
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-lg sm:text-xl md:text-2xl leading-tight text-primary font-medium tracking-tight">
              {settings.brand.name || 'Baldevji Jitmal'}
            </span>
            <span className="mt-0.5 text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-accent">
              {settings.brand.tagline || 'Textiles · Indore'}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative py-2 text-xs uppercase tracking-[0.16em] transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:transition-all after:bg-accent ${
                  isActive
                    ? 'text-primary after:w-full font-medium'
                    : 'text-foreground/70 hover:text-primary after:w-0 hover:after:w-full'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Hamburger Button with comfortable 44px tap target */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden grid h-11 w-11 place-items-center text-primary rounded-sm transition-colors active:bg-sand-200/80"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          style={{
            top: headerRef.current ? `${headerRef.current.getBoundingClientRect().bottom}px` : '72px',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-card border-b border-border shadow-2xl p-5 sm:p-6 max-h-[calc(100svh-4.5rem)] overflow-y-auto animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Primary Nav Links */}
            <nav className="divide-y divide-border/40">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-3.5 text-sm uppercase tracking-[0.14em] font-medium transition-colors ${
                      isActive ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} className="text-accent/60" />
                </NavLink>
              ))}
            </nav>

            {/* Mobile Quick Action Buttons */}
            <div className="mt-6 pt-5 border-t border-border/60 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#17523f] text-[#fcf9f2] py-3.5 rounded-sm text-xs uppercase tracking-[0.12em] font-semibold shadow-soft active:scale-[0.99] transition"
              >
                <MessageCircle size={16} className="text-[#34d399]" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${settings.contact.phone1?.replace(/\s+/g, '') || '07312459280'}`}
                className="w-full flex items-center justify-center gap-2 border border-border bg-background text-primary py-3 rounded-sm text-xs uppercase tracking-[0.12em] font-medium active:bg-sand-200"
              >
                <Phone size={15} className="text-accent" />
                <span>Call Store ({settings.contact.phone1 || '0731 245 9280'})</span>
              </a>
            </div>

            {/* Store Location Short Info */}
            <div className="mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-accent" />
                221, M.T. Cloth Market, Indore
              </span>
              <Link to="/login" className="text-accent underline text-[10px] uppercase tracking-wider">
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  </>
);
}
