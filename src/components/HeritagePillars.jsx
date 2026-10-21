import React from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, Truck, HeartHandshake } from 'lucide-react';
import { useSiteSettings, defaultSettings } from '../context/SiteContext';
import { MotionStagger, MotionItem } from './MotionReveal';

const DEFAULT_ICONS = [Award, Sparkles, Truck, HeartHandshake];

export default function HeritagePillars() {
  const settings = useSiteSettings();
  const rawPillars = settings.pillars;
  const pillars = Array.isArray(rawPillars) && rawPillars.length > 0 ? rawPillars : defaultSettings.pillars;

  return (
    <section className="bg-sand-200/50 border-y border-border/60 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionStagger
          stagger={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {pillars.map((item, idx) => {
            const Icon = DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
            return (
              <MotionItem key={item.title || idx}>
                <div className="relative overflow-hidden bg-card border border-border/80 p-5 sm:p-6 rounded-sm shadow-soft transition-all duration-300 hover:border-accent/60 hover:-translate-y-1 hover:shadow-lift group h-full flex flex-col justify-between">
                  {/* Hanson Wu style self-expanding top accent hairline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.1,
                      delay: 0.15 + idx * 0.1,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-accent/50 to-transparent origin-left"
                  />

                  <div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={19} />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl text-primary leading-snug">
                      {item.title}
                    </h3>
                    <div className="gold-divider my-3 w-8 transition-all duration-300 group-hover:w-12"></div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}
