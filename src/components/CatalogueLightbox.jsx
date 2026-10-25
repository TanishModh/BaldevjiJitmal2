import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
  ImageOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../context/SiteContext';
import { getLightboxImageUrl } from '../lib/imageOptimization';

export default function CatalogueLightbox({
  item,
  items,
  onClose,
  onSelect,
}) {
  const settings = useSiteSettings();

  // Navigation & Swipe touch refs
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const lastTouchPosRef = useRef({ x: 0, y: 0 });
  const lastTapTimeRef = useRef(0);

  // Zoom & Loupe refs & state
  const imageContainerRef = useRef(null);
  const imageElRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const didDragRef = useRef(false);
  const pinchStartDistRef = useRef(0);
  const pinchStartScaleRef = useRef(1);

  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const mediaSrc =
    item?.media_url ||
    item?.imageUrl ||
    item?.thumbnail_url ||
    item?.image_url ||
    item?.url ||
    (typeof item?.media === 'string' ? item.media : '');

  const [activeImgSrc, setActiveImgSrc] = useState(mediaSrc);

  const isVideo =
    item?.media_type === 'video' ||
    (typeof mediaSrc === 'string' && /\.(mp4|webm|mov|ogg)(\?|$)/i.test(mediaSrc));

  const safeItems = useMemo(
    () => (Array.isArray(items) && items.length > 0 ? items : item ? [item] : []),
    [items, item]
  );
  const currentIndex = item ? safeItems.findIndex((i) => i && String(i.id) === String(item.id)) : -1;
  const total = safeItems.length;

  // Reset zoom state helper
  const resetZoom = () => {
    setZoomScale(1);
    setZoomOrigin({ x: 50, y: 50 });
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
    didDragRef.current = false;
    pinchStartDistRef.current = 0;
  };

  // Reset loading, source, error, and zoom whenever active item changes
  useEffect(() => {
    setActiveImgSrc(mediaSrc);
    setLoaded(false);
    setImgError(false);
    resetZoom();
  }, [item?.id, mediaSrc]);

  const handleImageError = () => {
    if (activeImgSrc !== mediaSrc && mediaSrc) {
      setActiveImgSrc(mediaSrc); // Fallback to raw original URL
    } else {
      setImgError(true);
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (total <= 1) return;
    resetZoom();
    if (currentIndex > 0) {
      onSelect(safeItems[currentIndex - 1]);
    } else {
      onSelect(safeItems[total - 1]);
    }
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (total <= 1) return;
    resetZoom();
    if (currentIndex >= 0 && currentIndex < total - 1) {
      onSelect(safeItems[currentIndex + 1]);
    } else {
      onSelect(safeItems[0]);
    }
  };

  // Zoom controls
  const handleZoomIn = (e) => {
    e?.stopPropagation();
    setZoomScale((prev) => Math.min(3.2, Number((prev + 0.5).toFixed(1))));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    setZoomScale((prev) => {
      const next = Number((prev - 0.5).toFixed(1));
      if (next <= 1.05) {
        resetZoom();
        return 1;
      }
      return next;
    });
  };

  const handleToggleZoom = (e) => {
    e?.stopPropagation();
    if (zoomScale > 1.05) {
      resetZoom();
    } else {
      setZoomScale(2.3);
      setZoomOrigin({ x: 50, y: 50 });
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Desktop Click on Image: Zoom in to clicked point or reset
  const handleImageClick = (e) => {
    if (isVideo) return;
    e.stopPropagation();

    // If user just finished dragging, don't trigger click toggle
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (zoomScale > 1.05) {
      resetZoom();
    } else {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setZoomOrigin({ x, y });
      }
      setZoomScale(2.3);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Desktop Mouse Drag / Pan when zoomed
  const handleMouseDown = (e) => {
    if (zoomScale <= 1.05 || isVideo) return;
    e.preventDefault();
    setIsDragging(true);
    didDragRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomScale <= 1.05) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 4) {
      didDragRef.current = true;
    }
    setPanOffset({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Mobile Touch Handlers: Pinch-to-zoom + 1-finger pan + swipe carousel
  const handleTouchStart = (e) => {
    if (isVideo) return;

    if (e.touches.length === 2) {
      // Two fingers: Pinch start
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = zoomScale;

      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        setZoomOrigin({
          x: Math.max(0, Math.min(100, ((midX - rect.left) / rect.width) * 100)),
          y: Math.max(0, Math.min(100, ((midY - rect.top) / rect.height) * 100)),
        });
      }
    } else if (e.touches.length === 1) {
      // Single finger
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (isVideo) return;

    if (e.touches.length === 2 && pinchStartDistRef.current > 0) {
      // Pinching
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = dist / pinchStartDistRef.current;
      const targetScale = Math.min(3.2, Math.max(1, pinchStartScaleRef.current * factor));
      setZoomScale(targetScale);
    } else if (e.touches.length === 1 && zoomScale > 1.05) {
      // 1-finger pan on zoomed fabric
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      setPanOffset({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (isVideo) return;

    if (pinchStartDistRef.current > 0) {
      pinchStartDistRef.current = 0;
      if (zoomScale < 1.1) {
        resetZoom();
      }
      return;
    }

    if (e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;
    const moveDist = Math.hypot(deltaX, deltaY);

    // Double-tap detection
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;

    if (moveDist < 12 && timeSinceLastTap < 300) {
      // Double tap triggered!
      lastTapTimeRef.current = 0;
      if (zoomScale > 1.05) {
        resetZoom();
      } else {
        if (imageContainerRef.current) {
          const rect = imageContainerRef.current.getBoundingClientRect();
          const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
          setZoomOrigin({ x, y });
        }
        setZoomScale(2.3);
        setPanOffset({ x: 0, y: 0 });
      }
      return;
    }

    lastTapTimeRef.current = now;

    // Carousel swipe navigation (only when at 1x view)
    if (zoomScale <= 1.05 && Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomScale > 1.05) {
          resetZoom();
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
      if (e.key === '0') resetZoom();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, currentIndex, total, safeItems, zoomScale, onClose]);

  // Background prefetch for adjacent images
  useEffect(() => {
    if (!item || !safeItems || safeItems.length <= 1) return;
    const preload = (target) => {
      if (!target) return;
      const src =
        target.media_url ||
        target.imageUrl ||
        target.thumbnail_url ||
        target.image_url ||
        target.url ||
        (typeof target.media === 'string' ? target.media : '');
      if (src && target.media_type !== 'video' && typeof src === 'string') {
        const img = new Image();
        img.src = getLightboxImageUrl(src);
      }
    };

    const nextIdx = (currentIndex + 1) % total;
    const prevIdx = (currentIndex - 1 + total) % total;
    preload(safeItems[nextIdx]);
    preload(safeItems[prevIdx]);
  }, [currentIndex, total, safeItems, item]);

  // Early return ONLY after all hooks have been unconditionally registered
  if (!item) return null;

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
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator
        .share({
          title: item.title || item.category || 'Baldevji Jitmal Textile Piece',
          text: item.description || 'Authentic traditional Indian textile from Baldevji Jitmal, Indore.',
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Catalogue piece link copied to clipboard');
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
        className="relative max-w-5xl w-full bg-card rounded-md overflow-hidden shadow-2xl border border-accent/40 flex flex-col md:flex-row max-h-[92svh] md:h-[82vh] md:max-h-[720px]"
      >
        {/* Media Container: Guaranteed full height on desktop, comfortable height on mobile */}
        <div
          ref={imageContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 min-w-0 bg-gradient-to-b from-[#140e0d] to-[#0a0706] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden h-[46svh] sm:h-[52svh] md:h-full shrink-0 md:shrink select-none"
        >
          {/* Subtle discreet buffer indicator if loading */}
          {!loaded && !imgError && mediaSrc && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
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
              key={activeImgSrc}
              ref={imageElRef}
              src={activeImgSrc}
              alt={item.title || item.description || item.category || 'Baldevji Jitmal Textile Piece'}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              onError={handleImageError}
              onClick={handleImageClick}
              style={{
                transform:
                  zoomScale > 1.05
                    ? `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`
                    : 'scale(1)',
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                transition:
                  isDragging || pinchStartDistRef.current > 0
                    ? 'none'
                    : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: isVideo
                  ? 'default'
                  : zoomScale > 1.05
                  ? isDragging
                    ? 'grabbing'
                    : 'grab'
                  : 'zoom-in',
                userSelect: 'none',
                touchAction: zoomScale > 1.05 ? 'none' : 'pan-y',
              }}
              className="max-h-full max-w-full w-auto h-auto object-contain select-none will-change-transform"
            />
          )}
        </div>

        {/* Sidebar Info & Inquire: Fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-[360px] lg:w-[390px] md:shrink-0 p-5 sm:p-6 flex flex-col justify-between bg-card border-t md:border-t-0 md:border-l border-border/80 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold px-2.5 py-0.5 bg-accent/10 border border-accent/30 rounded-sm">
                {item.category || 'Catalogue Piece'}
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
