import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';

export default function OrderingFaq() {
  const [openIdx, setOpenIdx] = useState(0);
  const settings = useSiteSettings();
  const rawFaqs = settings.faqs;
  const faqs = Array.isArray(rawFaqs) && rawFaqs.length > 0 ? rawFaqs : defaultSettings.faqs;

  return (
    <section className="py-20 md:py-28 bg-paper border-t border-border/60">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium">
            {settings.faqSection?.eyebrow || 'Store & Ordering Guide'}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-primary mt-3">
            {settings.faqSection?.heading || 'Frequently Asked Questions'}
          </h2>
          <div className="gold-divider mx-auto my-5 w-24"></div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {settings.faqSection?.intro ||
              'Helpful details on visiting our M.T. Cloth Market store, catalogue selections, and delivery across India.'}
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q || idx}
                className="bg-card border border-border/80 rounded-sm overflow-hidden shadow-soft transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-display text-lg sm:text-xl text-primary hover:text-accent transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-accent transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-foreground/80 leading-relaxed border-t border-border/40 animate-rise">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
