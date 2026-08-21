import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const whatsappNumber = '919876543210';
  const message = encodeURIComponent('Hello! I would like to inquire about computer training courses and admission at Shri Ramkrishna National Youth Computer Centre.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 no-print">
      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group transform hover:-translate-y-0.5"
        title="Chat with Admissions Team on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">
          WhatsApp Us
        </span>
      </a>

      {/* Floating Call Now Button (Mobile friendly) */}
      <a
        href="tel:+919876543210"
        id="floating-call-btn"
        className="flex sm:hidden items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-3 rounded-full shadow-lg transition-all"
        title="Call Helpline"
      >
        <Phone className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-bold">Call Now</span>
      </a>
    </div>
  );
};
