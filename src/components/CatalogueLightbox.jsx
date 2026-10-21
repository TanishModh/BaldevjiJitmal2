import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, Share2, Loader2, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../context/SiteContext';

export default function CatalogueLightbox({
  item,
  items,
  onClose,
  onSelect,
}) {
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const mediaSrc =
    item?.media_url ||
    item?.imageUrl ||
    item?.thumbnail_url ||
    item?.image_url ||
    item?.url ||
    (typeof item?.media === 'string' ? item.media : '');

  const isVideo =
    item?.media_type === 'video' ||
    (typeof mediaSrc === 'string' && /\.(mp4|webm|mov|ogg)(\?|$)/i.test(mediaSrc));

  // Reset loading and error states whenever the active item changes
  useEffect(() => {
    setLoaded(false);
    setImgError(false);
  }, [item?.id, mediaSrc]);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, items]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const total = items.length;

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else {
      onSelect(items[items.length - 1]);
    }
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else {
      onSelect(items[0]);
    }
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Detect horizontal swipe if deltaX > 40px and dominant over vertical scroll
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext(); // swiped left -> next
      } else {
        handlePrev(); // swiped right -> prev
      }
    }
  };

  const settings = useSiteSettings();
  const rawPhone = settings?.contact?.phone2 || settings?.hero?.whatsappPhone || '917869849449';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const fullImageLink = mediaSrc
    ? mediaSrc.startsWith('http')
      ? mediaSrc
      : typeof window !== 'undefined'
      ? `${window.location.origin}${mediaSrc}`
      : mediaSrc
    : '';

  const inquiryMessage = encodeURIComponent(
    `Namaste Baldevji Jitmal, I would like to inquire about this piece from your catalogue:\n\n*Category:* ${item?.category || 'Traditional Textile'}\n*Details:* ${item?.description || item?.title || 'Catalogue piece'}${fullImageLink ? `\n*Image Link:* ${fullImageLink}` : ''}\n\nPlease share current price and availability.`
  );

  const whatsappInquiryUrl = `https://wa.me/${finalPhone}?text=${inquiryMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title || item.category || 'Baldevji Jitmal Textile Piece',
        text: item.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(mediaSrc || window.location.href);
      toast.success('Image link copied to clipboard');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 md:p-10 animate-fade-in select-none"
    >
      {/* Top Bar Controls */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 flex items-center gap-2 sm:gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors shadow-soft"
          title="Share item link"
          aria-label="Share"
        >
          <Share2 size={17} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors shadow-soft"
          title="Close (Esc)"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      {/* Prev / Next Buttons (Desktop / Tablets) */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/60 hover:bg-primary text-accent-foreground border border-gold/40 items-center justify-center transition-all hover:scale-110 shadow-lift"
            title="Previous piece (Left arrow)"
          >
            <ChevronLeft size={24} className="text-sand-100" />
          </button>
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/60 hover:bg-primary text-accent-foreground border border-gold/40 items-center justify-center transition-all hover:scale-110 shadow-lift"
            title="Next piece (Right arrow)"
          >
            <ChevronRight size={24} className="text-sand-100" />
          </button>
        </>
      )}

      {/* Modal Dialog Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative max-w-5xl w-full bg-card rounded-md overflow-hidden shadow-2xl border border-accent/40 flex flex-col md:flex-row max-h-[92svh] md:h-[82vh] md:max-h-[720px]"
      >
        {/* Media Container: Guaranteed full height on desktop, comfortable height on mobile */}
        <div className="flex-1 min-w-0 bg-[#0c0908] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden h-[46svh] sm:h-[52svh] md:h-full shrink-0 md:shrink">
          {/* Subtle loading spinner while high-res image buffers */}
          {!loaded && !imgError && mediaSrc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gold/70">
              <Loader2 size={26} className="animate-spin text-accent" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Loading piece…</span>
            </div>
          )}

          {/* Fallback if image failed to load or no url */}
          {imgError || !mediaSrc ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground gap-3">
              <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                <ImageOff size={22} />
              </div>
              <div>
                <p className="text-sm font-display text-white/90">Image Preview</p>
                <p className="text-xs text-white/50 mt-1 max-w-xs">
                  {item.title || item.category || 'Traditional Textile Piece'}
                </p>
              </div>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 text-xs text-accent underline underline-offset-4 hover:text-white transition"
              >
                Inquire on WhatsApp to see photo
              </a>
            </div>
          ) : isVideo ? (
            <video
              src={mediaSrc}
              controls
              autoPlay
              playsInline
              className="max-h-full max-w-full w-auto h-auto object-contain select-none"
              onLoadedData={() => setLoaded(true)}
              onError={() => setImgError(true)}
            />
          ) : (
            <img
              key={mediaSrc}
              src={mediaSrc}
              alt={item.title || item.description || item.category || 'Baldevji Jitmal Textile Piece'}
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              onError={() => setImgError(true)}
              className={`max-h-full max-w-full w-auto h-auto object-contain select-none transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Mobile Swipe Hint Pill */}
          <div className="sm:hidden absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <span className="text-[9px] uppercase tracking-wider text-white/75 bg-black/60 px-3 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
              Swipe ‹ › to browse
            </span>
          </div>
        </div>

        {/* Sidebar Info & Inquire: Fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-[360px] lg:w-[390px] md:shrink-0 p-5 sm:p-6 flex flex-col justify-between bg-card border-t md:border-t-0 md:border-l border-border/80 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold px-2.5 py-0.5 bg-accent/10 border border-accent/30 rounded-sm">
                {item.category || 'Catalogue Piece'}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {currentIndex >= 0 ? currentIndex + 1 : 1} / {total || 1}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl text-primary mt-3 sm:mt-4 leading-tight">
              {item.title || item.category || 'Traditional Handloom Piece'}
            </h3>
            <div className="gold-divider my-2.5 sm:my-3 w-14"></div>

            {item.description ? (
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Authentic traditional weave available at our M.T. Cloth Market store.
              </p>
            )}

            <div className="mt-5 pt-3.5 border-t border-border/60 text-[11px] sm:text-xs text-muted-foreground space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>Authentic weaver & mill craftsmanship</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>Ready dispatch across India</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>221, M.T. Cloth Market, Indore (Est. 1937)</span>
              </p>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 pt-3.5 border-t border-border/60">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 sm:py-3.5 rounded-md text-xs uppercase tracking-wider font-semibold shadow-soft hover:bg-[#20ba59] active:scale-[0.98] transition-all"
            >
              <MessageCircle size={16} className="fill-current" />
              <span>Inquire on WhatsApp</span>
            </a>
            <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground mt-2">
              Instant reply with photos, rates & availability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
