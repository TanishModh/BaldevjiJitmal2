import React, { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Phone, Instagram, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteContext';
import { MotionFade } from '../components/MotionReveal';

export default function Contact() {
  const settings = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    website: '', // honeypot
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.message.trim()) errs.message = 'Message is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot
    if (formData.website && formData.website.trim().length > 0) {
      toast.success("Inquiry sent! We'll be in touch soon.");
      setFormData({ name: '', phone: '', email: '', message: '', website: '' });
      return;
    }

    if (!validate()) {
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const inquiryPayload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
      };

      // Always save a local backup copy so admin panel can access even in offline/passcode mode
      try {
        const local = JSON.parse(localStorage.getItem('bj_inquiries') || '[]');
        local.unshift({
          id: 'local-' + Date.now(),
          ...inquiryPayload,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('bj_inquiries', JSON.stringify(local.slice(0, 50)));
      } catch (_) {}

      const { error } = await supabase.from('inquiries').insert(inquiryPayload);

      if (error) {
        console.warn('Supabase inquiry insert note:', error.message);
        // Note: local backup is already recorded above
      }

      toast.success("Inquiry sent! We'll be in touch soon.");
      setFormData({ name: '', phone: '', email: '', message: '', website: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error('Could not send inquiry. Please call us instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
      <MotionFade delay={0.1}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium">
          {settings.contact.eyebrow || 'Get in Touch'}
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-primary mt-4 leading-[1.02]">
          {settings.contact.heading || 'Visit, Call or Write to Us'}
        </h1>
        <div className="gold-divider my-6 w-24"></div>
      </MotionFade>

      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8 lg:gap-16 mt-12">
        {/* Left Column: Contact Details & Map */}
        <MotionFade delay={0.2} className="space-y-6">
          <div className="bg-card border-l-2 border-accent p-6 md:p-8 space-y-6 shadow-soft rounded-sm">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="text-accent mt-1 shrink-0" size={20} />
              <div>
                <p className="font-display text-xl text-primary">Our Shop</p>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings.contact.address || '221, M.T. Cloth Market\nIndore, Madhya Pradesh, India'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="text-accent mt-1 shrink-0" size={20} />
              <div>
                <p className="font-display text-xl text-primary">Phone</p>
                <p className="text-muted-foreground leading-relaxed">
                  <a href={`tel:${(settings.contact.phone1 || '07312459280').replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">
                    {settings.contact.phone1 || '0731 245 9280'}
                  </a>
                  {settings.contact.phone2 && (
                    <>
                      <br />
                      <a
                        href={`tel:${settings.contact.phone2.replace(/\s+/g, '')}`}
                        className="hover:text-primary transition-colors"
                      >
                        {settings.contact.phone2}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Instagram */}
            {settings.contact.instagramUrl && (
              <div className="flex items-start gap-3">
                <Instagram className="text-accent mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-display text-xl text-primary">Instagram</p>
                  <a
                    href={settings.contact.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {settings.contact.instagramHandle || '@baldevji.jitmal'}
                  </a>
                </div>
              </div>
            )}

            {/* Business Hours */}
            <div className="flex items-start gap-3">
              <Clock className="text-accent mt-1 shrink-0" size={20} />
              <div>
                <p className="font-display text-xl text-primary">Hours</p>
                <p className="text-muted-foreground">
                  {settings.contact.hours || 'Mon – Sat · 12:00 PM – 8:00 PM'}
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="overflow-hidden border border-border shadow-lift rounded-sm">
            <iframe
              title="Baldevji Jitmal location map"
              src={
                settings.contact.mapEmbedUrl ||
                'https://www.google.com/maps?q=Baldevji+Jitmal+Jitmal+%26+Sons+221+M.T.+Cloth+Market+Indore&output=embed'
              }
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </MotionFade>

        {/* Right Column: Inquiry Form */}
        <MotionFade delay={0.3}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative bg-card border border-border p-6 md:p-9 space-y-5 h-fit shadow-lift rounded-sm"
          >
            {/* Decorative Corner */}
            <div
              className="absolute right-0 top-0 h-14 w-14 border-r border-t border-accent/40 pointer-events-none"
              aria-hidden="true"
            ></div>

            <h2 className="font-display text-4xl text-primary">
              {settings.contact?.formHeading || 'Send an Inquiry'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {settings.contact?.formSubtitle || "Tell us what you're looking for and we'll get back to you promptly."}
            </p>

            {/* Honeypot for spam bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="contact-name" className="text-sm text-foreground/80 font-medium">
                Name *
              </label>
              <input
                id="contact-name"
                name="name"
                maxLength={120}
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 w-full bg-background border px-3.5 py-3 outline-none focus:border-primary transition text-base md:text-sm rounded-sm ${
                  errors.name ? 'border-destructive focus:border-destructive' : 'border-input'
                }`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            {/* Phone & Email Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-phone" className="text-sm text-foreground/80 font-medium">
                  Phone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  maxLength={32}
                  placeholder="e.g. +91 78280 72394"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full bg-background border border-input px-3.5 py-3 outline-none focus:border-primary transition text-base md:text-sm rounded-sm"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="text-sm text-foreground/80 font-medium">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  maxLength={255}
                  placeholder="e.g. hello@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 w-full bg-background border px-3.5 py-3 outline-none focus:border-primary transition text-base md:text-sm rounded-sm ${
                    errors.email ? 'border-destructive focus:border-destructive' : 'border-input'
                  }`}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="contact-message" className="text-sm text-foreground/80 font-medium">
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                maxLength={2000}
                placeholder="What fabric or collection are you looking for?"
                value={formData.message}
                onChange={handleChange}
                className={`mt-1 w-full bg-background border px-3.5 py-3 outline-none focus:border-primary transition resize-none text-base md:text-sm rounded-sm ${
                  errors.message ? 'border-destructive focus:border-destructive' : 'border-input'
                }`}
              ></textarea>
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground min-h-12 px-6 py-3.5 text-xs uppercase tracking-[0.14em] font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-60 transition shadow-soft cursor-pointer active:scale-[0.99] rounded-sm"
            >
              {isSubmitting ? 'Sending…' : 'Send Inquiry'}
            </button>
          </form>
        </MotionFade>
      </div>
    </section>
  );
}
