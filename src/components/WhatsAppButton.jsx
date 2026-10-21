import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';

export default function WhatsAppButton() {
  const settings = useSiteSettings();

  if (settings.whatsappFloating?.enabled === false) {
    return null;
  }

  const phone = (settings.contact?.phone2 || '78698 49449').replace(/\D/g, '');
  const waNumber = phone.length === 10 ? `91${phone}` : phone;

  const defaultMessage = encodeURIComponent(
    settings.whatsappFloating?.message ||
      settings.hero?.whatsappMessage ||
      'Namaste Baldevji Jitmal, I would like to inquire about your traditional textile collection. Please share designs and details.'
  );

  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 sm:left-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-center gap-2.5 bg-[#17523f] text-[#fbf5e9] h-12 w-12 sm:h-auto sm:w-auto p-0 sm:px-4 sm:py-3 rounded-full shadow-lift border border-[#b28342]/40 transition-all duration-300 hover:bg-[#124233] hover:border-[#b28342] active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={20} className="text-[#34d399] shrink-0" />
        <span className="font-sans text-xs uppercase tracking-wider font-medium hidden sm:inline-block">
          {settings.whatsappFloating?.label || 'Inquire on WhatsApp'}
        </span>
      </a>
    </div>
  );
}
