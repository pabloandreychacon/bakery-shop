import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { defaultSettings } from '../../utils/settings';

interface AdminCategoriesProps {
  t: any;
}

interface Category {
  id: number;
  Name: string;
  DisplayName: string;
  Active: boolean;
  IdBusiness: number;
}

export function AdminCategories({ t }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    Name: '',
    DisplayName: '',
    Active: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .order('Name')
        .eq('IdBusiness', defaultSettings.id);

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('Categories')
          .update({
            Name: formData.Name,
            DisplayName: formData.DisplayName,
            Active: formData.Active
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('Categories')
          .insert({
            Name: formData.Name,
            DisplayName: formData.DisplayName,
            Active: formData.Active,
            IdBusiness: defaultSettings.id
          });

        if (error) throw error;
      }

      // Reset form and reload categories
      setFormData({ Name: '', DisplayName: '', Active: true });
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      Name: category.Name,
      DisplayName: category.DisplayName,
      Active: category.Active
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('Categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData({ Name: '', DisplayName: '', Active: true });
  };

  if (loading && categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading categories...</div>
      </div>
    );
  }

  return (
    <div key="admin-categories-container">
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
          {editingCategory ? t('admin.category.editCategory') : t('admin.category.addNew')}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '32rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              {t('admin.category.name')} *
            </label>
            <input
              type="text"
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
              placeholder="Enter category name"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              {t('admin.category.displayName')}
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
              placeholder="Enter display name (optional)"
              value={formData.DisplayName}
              onChange={(e) => setFormData({ ...formData, DisplayName: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
              <input
                type="checkbox"
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
              />
              {t('admin.category.active')}
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Plus style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              {loading ? t('admin.category.savingCategory') : (editingCategory ? t('admin.category.editCategory') : t('admin.category.addNew'))}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                {t('admin.category.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
          {t('admin.category.title')} ({categories.length})
        </h3>

        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <Tag style={{ width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{t('admin.category.noCategoriesFound')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {category.DisplayName || category.Name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    {category.Name} {!category.Active && '(Inactive)'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(category)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    <Edit2 style={{ width: '1rem', height: '1rem' }} />
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      color: '#dc2626'
                    }}
                  >
                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
