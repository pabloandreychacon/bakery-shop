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
    <footer style={{ backgroundColor: 'black', color: 'white', padding: '3rem 0', width: '100vw', left: 0, right: 0 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* About Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/favicon.png" alt="Logo" style={{ width: '2rem', height: '2rem', objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                {loading ? 'Loading...' : businessInfo?.businessName || 'PANADERÍA ÁVILA'}
              </h3>
            </div>
            <p style={{ color: '#d1d5db', marginBottom: '1rem', lineHeight: 1.6 }}>
              {t('footer.description')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#374151', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}>f</button>
              <button style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#374151', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}>t</button>
              <button style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#374151', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}>i</button>
              <button style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#374151', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}>y</button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>{t('footer.quickLinks.title')}</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                onClick={(e) => handleFooterNavClick(e, 'home')}>{t('navigation.home')}</Link></li>
              <li><Link to="/" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                onClick={(e) => handleFooterNavClick(e, 'menu')}>{t('navigation.menu')}</Link></li>
              <li><Link to="/" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                onClick={(e) => handleFooterNavClick(e, 'about')}>{t('navigation.about')}</Link></li>
              <li><Link to="/" style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                onClick={(e) => handleFooterNavClick(e, 'contact')}>{t('navigation.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>{t('footer.contactInfo.title')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                <span style={{ color: '#d1d5db' }}>{loading ? 'Loading...' : businessInfo?.address || '123 Bakery Lane, Sweet City, SC 12345'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                <span style={{ color: '#d1d5db' }}>{loading ? 'Loading...' : businessInfo?.phone || '(555) 123-4567'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                <span style={{ color: '#d1d5db' }}>{loading ? 'Loading...' : businessInfo?.email || 'hello@bakeryshop.com'}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>{t('footer.hours.title', 'Hours')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                <div style={{ color: '#d1d5db', whiteSpace: 'pre-line' }}>
                  {t('contact.info.hours', 'Monday - Saturday: 7:00 AM - 7:00 PM\nSunday: 8:00 AM - 5:00 PM\nHoliday hours may vary')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #374151', marginTop: '3rem', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }} className="md:flex-row md:justify-between">
            <div style={{ color: '#9ca3af', fontSize: '0.875rem' }} className="md:mb-0">
              © {new Date().getFullYear()} {loading ? 'Loading...' : (businessInfo?.businessName || 'PANADERÍA ÁVILA')}. {t('footer.copyright', 'All rights reserved.')}.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
