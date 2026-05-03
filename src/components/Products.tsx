import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import mixImage from '../assets/mix.png';
import { supabase } from '../lib/supabase';
import { getSettings, getCurrencySymbol } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';

interface Product {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId: number;
  ImageUrl: string;
  Active: boolean;
  IsOffer: boolean;
}

interface Category {
  Id: number;
  Name: string;
  DisplayName: string;
  Active: boolean;
  IdBusiness: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export function Menu() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'es' | 'en';
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencyCode, setCurrencyCode] = useState('$');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      setCurrencyCode(settings?.currencyCode || 'CRC'); // Usar currencyCode de Settings con default CRC

      let query = supabase
        .from('Products')
        .select('*')
        .eq('IdBusiness', settings.id)
        .eq('Active', true)
        .order('Name');

      if (selectedCategory) {
        query = query.eq('CategoryId', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const settings = await getSettings();
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .eq('IdBusiness', settings.id)
        .eq('Active', true)
        .order('Name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Convert products to menu items format
  const menuItems: MenuItem[] = products.map(product => ({
    id: product.Id,
    name: parseBilingualText(product.Name, currentLanguage),
    description: parseBilingualText(product.Description, currentLanguage),
    price: `${getCurrencySymbol(currencyCode)}${product.Price.toFixed(2)}`,
    category: categories.find(cat => cat.Id === product.CategoryId)?.Name || 'uncategorized',
    image: product.ImageUrl
  }));

  // Create categories array for filter buttons
  const filterCategories = [
    { id: null, name: t('menu.categories.all') || 'All' },
    ...categories.map(cat => ({
      id: cat.Id,
      name: cat.DisplayName || cat.Name
    }))
  ];

  // Filter products based on selected category
  const filteredItems = selectedCategory === null
    ? menuItems
    : menuItems.filter(item => {
      const category = categories.find(cat => cat.Id === selectedCategory);
      return item.category === category?.Name;
    });


  return (
    <section id="menu" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${mixImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      width: '100vw',
      left: 0,
      right: 0
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.88) 100%)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '5rem 5%',
        maxWidth: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('menu.title')}</h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.6 }}>
            {t('menu.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {filterCategories.map((category, index) => (
              <button
                key={category.id !== null && category.id !== undefined ? `category-${category.id}` : `category-${index}`}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategory === category.id ? 'black' : '#e5e7eb',
                  color: selectedCategory === category.id ? 'white' : '#374151'
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category.id) e.currentTarget.style.backgroundColor = '#d1d5db';
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category.id) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}>
              {item.image && (
                <div style={{ height: '12rem', backgroundColor: '#e5e7eb', borderRadius: '0.5rem 0.5rem 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'none' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = item.category === 'breads'
                          ? 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #92400e 100%)'
                          : 'linear-gradient(135deg, #facc15 0%, #fb923c 50%, #facc15 100%)';
                        parent.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 2rem; font-weight: bold;">${item.name.charAt(0)}</div>`;
                      }
                    }}
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'block';
                    }}
                  />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', flex: 1 }}>{item.name}</h3>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginLeft: '1rem' }}>{item.price}</span>
                </div>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
