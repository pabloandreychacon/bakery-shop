import { useState } from 'react';
import { Lock, Settings, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdminSettings } from './admin/AdminSettings';
import { AdminCategories } from './admin/AdminCategories';
import { AdminProducts } from './admin/AdminProducts';

export function Admin() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'categories' | 'products'>('settings');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple password check - use "admin" or "12345" or "admin123"
      if (password === 'admin' || password === '12345' || password === 'admin123') {
        setIsAuthenticated(true);
      } else {
        setError(t('admin.invalidPassword'));
      }
    } catch (err) {
      setError(t('admin.authFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('admin.title')}
            </h2>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder={t('admin.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center mt-2">{error}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {loading ? t('admin.authenticating') : t('admin.signIn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('admin.dashboard')}</h1>

          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="flex flex-col sm:flex-row -mb-px">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 sm:border-b-2 border-l-4 sm:border-l-0 cursor-pointer transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'border-blue-600 sm:border-b-blue-600 sm:border-l-transparent text-blue-600 bg-blue-50 sm:bg-transparent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('admin.settings')}
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 sm:border-b-2 border-l-4 sm:border-l-0 cursor-pointer transition-all duration-200 ${
                    activeTab === 'categories'
                      ? 'border-blue-600 sm:border-b-blue-600 sm:border-l-transparent text-blue-600 bg-blue-50 sm:bg-transparent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center`}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Categories
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 sm:border-b-2 border-l-4 sm:border-l-0 cursor-pointer transition-all duration-200 ${
                    activeTab === 'products'
                      ? 'border-blue-600 sm:border-b-blue-600 sm:border-l-transparent text-blue-600 bg-blue-50 sm:bg-transparent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center`}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {t('admin.products')}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'settings' && <AdminSettings t={t} />}
              {activeTab === 'categories' && <AdminCategories t={t} />}
              {activeTab === 'products' && <AdminProducts t={t} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
