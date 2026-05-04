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
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '3.5rem',
        height: '3.5rem',
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        zIndex: 40,
        border: 'none',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#128C7E'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
    >
      <Phone style={{ width: '1.5rem', height: '1.5rem' }} />
    </button>
  );
}
