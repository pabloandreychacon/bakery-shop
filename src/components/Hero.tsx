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
        .eq('IdBusiness', settings?.id)
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
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-100 w-screen left-0 right-0 mt-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=1080&fit=crop&crop=entropy&q=80)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-[5%]">
          <h1 className="font-black mb-4 leading-none text-white" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}>
            {loading ? 'Loading...' : t('hero.bread.title')}
          </h1>
          <p className="font-normal mb-8 leading-relaxed" style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {loading ? 'Loading special offers...' : t('hero.bread.subtitle')}
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={scrollDown}
            className="bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300"
          >
            <ChevronDown className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-100 w-screen left-0 right-0 mt-0">
      {bakeryProducts.map((product, index) => {
        const isCurrent = index === currentIndex;

        return (
          <div
            key={product.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${product.image})` }}
              role="img"
              aria-label={product.title}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
            </div>
          </div>
        );
      })}

      <div className="relative z-10 text-left text-white px-[5%] w-full">
        <div className="max-w-[800px]">
          <h1 className="font-black mb-4 leading-none text-white" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}>
            {currentProduct.title}
          </h1>
          <p className="font-normal mb-4 leading-relaxed" style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {currentProduct.subtitle}
          </p>
          <div className="font-bold text-yellow-400 mb-8" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {currentProduct.price}
          </div>
        </div>
      </div>

      {bakeryProducts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-3/4 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 rounded-full w-12 h-12 flex items-center justify-center z-20 transition-all duration-300 text-black"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-3/4 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 rounded-full w-12 h-12 flex items-center justify-center z-20 transition-all duration-300 text-black"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {bakeryProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}

      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-black z-20 animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
