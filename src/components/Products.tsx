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
  const [currencyCode, setCurrencyCode] = useState('$');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      const settings = await getSettings();
      setCurrencyCode(settings?.currencyCode || 'CRC'); // Usar currencyCode de Settings con default CRC

      let query = supabase
        .from('Products')
        .select('*')
        .eq('IdBusiness', settings?.id)
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
    }
  };

  const loadCategories = async () => {
    try {
      const settings = await getSettings();
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .eq('IdBusiness', settings?.id)
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
    <section id="menu" className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed w-screen left-0 right-0" style={{ backgroundImage: `url(${mixImage})` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/92 to-white/88 z-10"></div>
      <div className="relative z-20 p-20 max-w-none flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-4 text-gray-800">{t('menu.title')}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('menu.subtitle')}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {filterCategories.map((category, index) => (
              <button
                key={category.id !== null && category.id !== undefined ? `category-${category.id}` : `category-${index}`}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full border-none cursor-pointer transition-all duration-300 text-sm font-medium ${selectedCategory === category.id
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:-translate-y-0.5'
                  } shadow-md`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
              {item.image && (
                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center hidden"
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
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex-1">{item.name}</h3>
                  <span className="text-2xl font-bold text-black ml-4">{item.price}</span>
                </div>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
