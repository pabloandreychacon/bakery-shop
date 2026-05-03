import { useState } from 'react';
import { Lock, Settings, Tag, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import bcrypt from 'bcryptjs';
import { getSettings } from '../utils/settings';
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '28rem', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ margin: '0 auto', height: '3rem', width: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#dbeafe' }}>
              <Lock style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }} />
            </div>
            <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: '800', color: '#111827' }}>
              {t('admin.title')}
            </h2>
          </div>
          <form onSubmit={handleLogin} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <input
                type="password"
                required
                style={{
                  appearance: 'none',
                  borderRadius: '0.375rem',
                  position: 'relative',
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  color: '#111827',
                  fontSize: '0.875rem'
                }}
                placeholder={t('admin.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center', marginTop: '0.5rem' }}>{error}</div>
            )}
            <div style={{ marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  color: 'white',
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ padding: '2rem 0' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '2rem' }}>{t('admin.dashboard')}</h1>

          <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb' }}>
              <nav style={{ display: 'flex', marginBottom: 0 }}>
                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderBottom: `2px solid ${activeTab === 'settings' ? '#2563eb' : 'transparent'}`,
                    color: activeTab === 'settings' ? '#2563eb' : '#6b7280',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Settings style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  {t('admin.settings')}
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderBottom: `2px solid ${activeTab === 'categories' ? '#2563eb' : 'transparent'}`,
                    color: activeTab === 'categories' ? '#2563eb' : '#6b7280',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Tag style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Categories
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderBottom: `2px solid ${activeTab === 'products' ? '#2563eb' : 'transparent'}`,
                    color: activeTab === 'products' ? '#2563eb' : '#6b7280',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Package style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  {t('admin.products')}
                </button>
              </nav>
            </div>

            <div style={{ padding: '1.5rem' }}>
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
