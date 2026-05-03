import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { getSettings, getCurrencySymbol } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';

interface BakeryProduct {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  price: string;
}

export function Hero() {
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.language || 'es') as 'es' | 'en';
  const [bakeryProducts, setBakeryProducts] = useState<BakeryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfferProducts();
  }, [currentLanguage]);

  const loadOfferProducts = async () => {
    try {
      const settings = await getSettings();

      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('IdBusiness', settings.id)
        .eq('IsOffer', true)
        .eq('Active', true)
        .order('Name');

      if (error) throw error;

      // Debug currency code
      console.log('CurrencyCode from settings:', settings?.currencyCode);
      console.log('Currency symbol:', getCurrencySymbol(settings?.currencyCode || 'CRC'));

      // Convert products to BakeryProduct format
      const products: BakeryProduct[] = (data || []).map(product => ({
        id: product.Id,
        title: parseBilingualText(product.Name || '', currentLanguage),
        subtitle: parseBilingualText(product.Description || '', currentLanguage),
        image: product.ImageUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=1080&fit=crop&crop=entropy&q=80",
        price: `${getCurrencySymbol(settings?.currencyCode || 'CRC')}${product.Price.toFixed(2)}`
      }));

      setBakeryProducts(products);
    } catch (err) {
      console.error('Error loading offer products:', err);
      // Fallback to default products if loading fails
      setBakeryProducts([
        {
          id: 1,
          title: t('hero.bread.title'),
          subtitle: t('hero.bread.subtitle'),
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=1080&fit=crop&crop=entropy&q=80",
          price: `${getCurrencySymbol('CRC')}1,250.00`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollDown = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (bakeryProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current === bakeryProducts.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [bakeryProducts.length]);

  const nextSlide = () => {
    setCurrentIndex((current) => (current === bakeryProducts.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((current) => (current === 0 ? bakeryProducts.length - 1 : current - 1));
  };

  const currentProduct = bakeryProducts[currentIndex];

  // Show loading state or fallback if no products
  if (loading || bakeryProducts.length === 0 || !currentProduct) {
    return (
      <section id="home" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f5f5f5', width: '100vw', left: 0, right: 0, marginTop: '0' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=1080&fit=crop&crop=entropy&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.5))' }}></div>
        </div>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', padding: '0 5%' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1, color: 'white', textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}>
            {loading ? 'Loading...' : t('hero.bread.title')}
          </h1>
          <p style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 400, marginBottom: '2rem', lineHeight: 1.4, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {loading ? 'Loading special offers...' : t('hero.bread.subtitle')}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <button
            onClick={scrollDown}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'white'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
          >
            <ChevronDown style={{ width: '1.5rem', height: '1.5rem', color: '#374151' }} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="home" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f5f5f5', width: '100vw', left: 0, right: 0, marginTop: '0' }}>
      {bakeryProducts.map((product, index) => {
        const isCurrent = index === currentIndex;

        return (
          <div
            key={product.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: isCurrent ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: isCurrent ? 1 : 0
            }}
          >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                role="img"
                aria-label={product.title}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.5))' }}></div>
              </div>
          </div>
        );
      })}

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'left', color: 'white', paddingLeft: '5%', paddingRight: '5%', width: '100%' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1, color: 'white', textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}>
            {currentProduct.title}
          </h1>
          <p style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 400, marginBottom: '1rem', lineHeight: 1.4, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {currentProduct.subtitle}
          </p>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fbbf24', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', marginBottom: '2rem' }}>
            {currentProduct.price}
          </div>
        </div>
      </div>

      {bakeryProducts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '75%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.3s ease',
              color: 'black'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>

          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '75%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.3s ease',
              color: 'black'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>

          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
            {bakeryProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                  }
                }}
                onMouseOut={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                  }
                }}
              />
            ))}
          </div>
        </>
      )}

      <button
        onClick={scrollDown}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'black',
          zIndex: 20,
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          animation: 'bounce 2s infinite'
        }}
      >
        <ChevronDown style={{ width: '2rem', height: '2rem' }} />
      </button>
    </section>
  );
}
