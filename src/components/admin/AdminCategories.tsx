import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { defaultSettings } from '../../utils/settings';

interface AdminCategoriesProps {
  t: any;
}

interface Category {
  Id: number;
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
          .eq('Id', editingCategory.Id);

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
        .eq('Id', id);

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
      <div className="text-center p-8">
        <div>Loading categories...</div>
      </div>
    );
  }

  return (
    <div key="admin-categories-container">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingCategory ? t('admin.category.editCategory') : t('admin.category.addNew')}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.category.name')} *
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.category.displayName')}
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter display name (optional)"
              value={formData.DisplayName}
              onChange={(e) => setFormData({ ...formData, DisplayName: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {t('admin.category.active')}
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white flex items-center justify-center ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? t('admin.category.savingCategory') : (editingCategory ? t('admin.category.editCategory') : t('admin.category.addNew'))}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                {t('admin.category.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('admin.category.title')} ({categories.length})
        </h3>

        {categories.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">{t('admin.category.noCategoriesFound')}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {categories.map((category) => (
              <div
                key={category.Id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {category.DisplayName || category.Name}
                  </h4>
                  <p className="text-xs text-gray-500 m-0">
                    {category.Name} {!category.Active && '(Inactive)'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(category.Id)}
                    className="px-2 py-1 border border-gray-300 rounded bg-white text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
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
