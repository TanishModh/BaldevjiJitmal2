import React from 'react';
import { Star, MapPin, ExternalLink, MessageSquareHeart } from 'lucide-react';

export default function GoogleRatingBadge({ className = '', variant = 'card' }) {
  const mapsUrl =
    'https://maps.google.com/?q=Baldevji+Jitmal+Jitmal+%26+Sons+221+M.T.+Cloth+Market+Indore';
  const reviewUrl =
    'https://www.google.com/maps/search/?api=1&query=Baldevji+Jitmal+Jitmal+%26+Sons+221+M.T.+Cloth+Market+Indore';

  if (variant === 'compact') {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2.5 bg-card/90 hover:bg-card border border-accent/30 hover:border-accent/60 px-3 py-1.5 rounded-full text-xs transition-all shadow-soft group ${className}`}
        title="View Baldevji Jitmal on Google Maps"
      >
        {/* Google G Icon */}
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <div className="flex items-center gap-1 text-[#f59e0b]">
          <span className="font-semibold text-foreground text-[11px]">4.9</span>
          <div className="flex text-accent">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-[#b28342] text-[#b28342]" />
            ))}
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider hidden sm:inline">
          Google Maps · M.T. Cloth Market
        </span>
      </a>
    );
  }

  return (
    <div
      className={`bg-card/95 backdrop-blur-sm border border-accent/35 rounded-sm p-4 sm:p-5 shadow-soft hover:shadow-lift transition-all relative overflow-hidden group ${className}`}
    >
      {/* Decorative Warm Accent Gradient Edge */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        {/* Left: Google Icon, Rating and Heritage Info */}
        <div className="flex items-center gap-3.5">
          {/* Official Google 'G' Mark Container */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white shadow-soft flex items-center justify-center shrink-0 border border-border/60">
            <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg sm:text-xl font-bold text-primary leading-none">
                4.9
              </span>
              <div className="flex text-accent" aria-label="Rated 4.9 out of 5 stars on Google">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#b28342] text-[#b28342]" />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent/90 bg-accent/10 px-1.5 py-0.5 rounded-sm">
                Google Rating
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              Trusted by textile merchants & families since 1937 · 221, M.T. Cloth Market, Indore
            </p>
          </div>
        </div>

        {/* Right: Direct Map Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-2 rounded-sm transition-all hover:scale-[1.02] active:scale-95"
            title="Open in Google Maps for walking or driving directions"
          >
            <MapPin size={13} className="text-accent" />
            <span>Directions</span>
            <ExternalLink size={11} className="opacity-60" />
          </a>
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-2 rounded-sm transition-all hover:scale-[1.02] active:scale-95 shadow-soft"
            title="Write a Google Review for Baldevji Jitmal"
          >
            <MessageSquareHeart size={13} />
            <span>Review Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
