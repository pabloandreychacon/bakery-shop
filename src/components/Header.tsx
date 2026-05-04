import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X } from 'lucide-react';
import { getSettings } from '../utils/settings';

export function Header() {
  const { i18n, t } = useTranslation();
  const [businessName, setBusinessName] = useState('PANADERÍA ÁVILA');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const settings = await getSettings();
        if (settings?.businessName) {
          setBusinessName(settings.businessName);
        }
      } catch (error) {
        console.error('Error fetching business name:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessName();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black text-white p-0 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between w-full px-8">
        <Link to="/" className="flex items-center gap-3 no-underline text-white py-2">
          <img src="/favicon.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div className="text-2xl font-bold">
            {loading ? 'Loading...' : businessName}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex gap-8 items-center`}>
          <Link
            to="/"
            className="no-underline text-white font-medium text-base transition-colors duration-300 hover:text-amber-500"
          >
            {t('navigation.home')}
          </Link>
          <Link
            to="/products"
            className="no-underline text-white font-medium text-base transition-colors duration-300 hover:text-amber-500"
          >
            {t('navigation.menu')}
          </Link>
          <Link
            to="/about"
            className="no-underline text-white font-medium text-base transition-colors duration-300 hover:text-amber-500"
          >
            {t('navigation.about')}
          </Link>
          <Link
            to="/contact"
            className="no-underline text-white font-medium text-base transition-colors duration-300 hover:text-amber-500"
          >
            {t('navigation.contact')}
          </Link>
          <Link
            to="/admin"
            className="no-underline text-white font-medium text-base transition-colors duration-300 hover:text-amber-500"
          >
            {t('navigation.admin')}
          </Link>

          <button
            onClick={toggleLanguage}
            className="bg-amber-500 text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-sm font-bold transition-all duration-300 hover:bg-amber-600 hover:scale-110"
          >
            <Globe className="w-4 h-4" />
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden bg-transparent border-none text-white cursor-pointer p-2 ${isMobile ? 'block' : 'hidden'}`}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${isMobile && isMobileMenuOpen ? 'flex' : 'hidden'} absolute top-full left-0 right-0 bg-black flex-col p-4 gap-4 shadow-lg z-40 md:hidden`}
      >
        <Link
          to="/"
          className="no-underline text-white font-medium text-base py-2 border-b border-gray-800"
        >
          {t('navigation.home')}
        </Link>
        <Link
          to="/products"
          className="no-underline text-white font-medium text-base py-2 border-b border-gray-800"
        >
          {t('navigation.menu')}
        </Link>
        <Link
          to="/about"
          className="no-underline text-white font-medium text-base py-2 border-b border-gray-800"
        >
          {t('navigation.about')}
        </Link>
        <Link
          to="/contact"
          className="no-underline text-white font-medium text-base py-2 border-b border-gray-800"
        >
          {t('navigation.contact')}
        </Link>
        <Link
          to="/admin"
          className="no-underline text-white font-medium text-base py-2 border-b border-gray-800"
        >
          {t('navigation.admin')}
        </Link>

      </div>
    </header>
  );
}
