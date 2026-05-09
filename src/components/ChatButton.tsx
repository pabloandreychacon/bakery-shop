import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSettings, type BusinessSettings } from '../utils/settings';

export function ChatButton() {
  const [businessInfo, setBusinessInfo] = useState<BusinessSettings | null>(null);
  const message = 'Hello! I would like to inquire about your bakery products.';

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const settings = await getSettings();
        setBusinessInfo(settings);
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };

    fetchBusinessInfo();
  }, []);

  const handleWhatsAppClick = () => {
    if (businessInfo?.phone) {
      const whatsappUrl = `https://wa.me/${businessInfo.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 border-none cursor-pointer"
    >
      <Phone className="w-6 h-6" />
    </button>
  );
}
