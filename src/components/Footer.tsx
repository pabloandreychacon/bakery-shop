import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSettings, type BusinessSettings } from '../utils/settings';

export function Footer() {
  const { t } = useTranslation();
  const [businessInfo, setBusinessInfo] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const settings = await getSettings();
        setBusinessInfo(settings);
      } catch (error) {
        console.error('Error fetching business info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, []);

  const handleFooterNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white py-12 w-screen">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
              <h3 className="text-xl font-semibold m-0">
                {loading ? 'Loading...' : businessInfo?.businessName || 'PANADERÍA ÁVILA'}
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors duration-300">f</button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors duration-300">t</button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors duration-300">i</button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors duration-300">y</button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.quickLinks.title')}</h3>
            <ul className="list-none p-0 flex flex-col gap-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300" onClick={(e) => handleFooterNavClick(e, 'home')}>{t('navigation.home')}</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300" onClick={(e) => handleFooterNavClick(e, 'menu')}>{t('navigation.menu')}</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300" onClick={(e) => handleFooterNavClick(e, 'about')}>{t('navigation.about')}</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300" onClick={(e) => handleFooterNavClick(e, 'contact')}>{t('navigation.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.contactInfo.title')}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{loading ? 'Loading...' : businessInfo?.address || '123 Bakery Lane, Sweet City, SC 12345'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{loading ? 'Loading...' : businessInfo?.phone || '(555) 123-4567'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{loading ? 'Loading...' : businessInfo?.email || 'hello@bakeryshop.com'}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.hours.title', 'Hours')}</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="text-gray-300 whitespace-pre-line">
                  {t('contact.info.hours', 'Monday - Saturday: 7:00 AM - 7:00 PM\nSunday: 8:00 AM - 5:00 PM\nHoliday hours may vary')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col gap-4 items-center md:flex-row md:justify-between">
            <div className="text-gray-400 text-sm md:mb-0">
              © {new Date().getFullYear()} {loading ? 'Loading...' : (businessInfo?.businessName || 'PANADERÍA ÁVILA')}. {t('footer.copyright', 'All rights reserved.')}.
            </div>
          </div>
        </div>

        {/* qr code */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex justify-center">
            <img src="https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=https%3A%2F%2Favilapanaderia.netlify.app%2F&qzone=1&margin=0&size=400x400&ecc=L" alt="QR Code" className="w-32 h-32 object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}
