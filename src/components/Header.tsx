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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header style={{ backgroundColor: 'black', color: 'white', padding: '0', position: 'fixed', width: '100%', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white', padding: '0.5rem 0' }}>
          <img src="/favicon.png" alt="Logo" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {loading ? 'Loading...' : businessName}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: isMobile ? 'none' : 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link
            to="/"
            style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', transition: 'color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f59e0b'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            {t('navigation.home')}
          </Link>
          <Link
            to="/products"
            style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', transition: 'color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f59e0b'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            {t('navigation.menu')}
          </Link>
          <Link
            to="/about"
            style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', transition: 'color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f59e0b'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            {t('navigation.about')}
          </Link>
          <Link
            to="/contact"
            style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', transition: 'color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f59e0b'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            {t('navigation.contact')}
          </Link>
          <Link
            to="/admin"
            style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', transition: 'color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f59e0b'}
            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          >
            {t('navigation.admin')}
          </Link>

          <button
            onClick={toggleLanguage}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Globe style={{ width: '1rem', height: '1rem' }} />
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: isMobile ? 'block' : 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          {isMobileMenuOpen ? (
            <X style={{ width: '1.5rem', height: '1.5rem' }} />
          ) : (
            <Menu style={{ width: '1.5rem', height: '1.5rem' }} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        style={{
          display: isMobile && isMobileMenuOpen ? 'flex' : 'none',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'black',
          flexDirection: 'column',
          padding: '1rem 2rem',
          gap: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 40
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          {t('navigation.home')}
        </Link>
        <Link
          to="/products"
          style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          {t('navigation.menu')}
        </Link>
        <Link
          to="/about"
          style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          {t('navigation.about')}
        </Link>
        <Link
          to="/contact"
          style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          {t('navigation.contact')}
        </Link>
        <Link
          to="/admin"
          style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          {t('navigation.admin')}
        </Link>

        <button
          onClick={toggleLanguage}
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            marginTop: '0.5rem'
          }}
        >
          <Globe style={{ width: '1rem', height: '1rem' }} />
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </button>
      </div>
    </header >
  );
}
