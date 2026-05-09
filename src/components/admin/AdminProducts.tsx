import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { defaultSettings, getSettings, getCurrencySymbol } from '../../utils/settings';
import { joinBilingualText, splitBilingualText } from '../../utils/bilingual';

interface AdminProductsProps {
  t: any;
}

interface Product {
  Id?: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId?: number;
  ImageUrl: string;
  IsService: boolean;
  IsOffer?: boolean;
  Active: boolean;
  IdBusiness: number;
  BusinessEmail?: string;
}

interface Category {
  Id: number;
  Name: string;
  DisplayName: string;
  Active: boolean;
  IdBusiness: number;
}

export function AdminProducts({ t }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    NameEs: '',
    NameEn: '',
    DescriptionEs: '',
    DescriptionEn: '',
    Price: '',
    CategoryId: '',
    ImageUrl: '',
    IsService: false,
    IsOffer: false,
    Active: true,
    IdBusiness: 0,
    BusinessEmail: ''
  });
  const [currencyCode, setCurrencyCode] = useState('CRC');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
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
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Load settings to get currency code
      const settings = await getSettings();
      setCurrencyCode(settings?.currencyCode || 'CRC');

      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .order('Name')
        .eq('IdBusiness', defaultSettings.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        Name: joinBilingualText(formData.NameEs, formData.NameEn),
        Description: joinBilingualText(formData.DescriptionEs, formData.DescriptionEn),
        Price: parseFloat(formData.Price),
        CategoryId: formData.CategoryId ? parseInt(formData.CategoryId) : 1,
        ImageUrl: formData.ImageUrl,
        Active: formData.Active,
        IdBusiness: defaultSettings.id,
        IsOffer: formData.IsOffer
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('Products')
          .update(productData)
          .eq('Id', editingProduct.Id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Products')
          .insert(productData);

        if (error) throw error;
      }

      resetForm();
      await loadProducts();

      // Scroll to top after successful save
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Function to delete image from Supabase bucket
  const deleteImageFromBucket = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return;

    try {
      // Extract filePath from imageUrl
      // URL format: https://xxx.supabase.co/storage/v1/object/public/postore/settings.id/productId/fileName
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'postore');

      if (bucketIndex === -1 || bucketIndex + 3 >= urlParts.length) {
        console.warn('Invalid image URL format, cannot extract filePath');
        return;
      }

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      console.log('Deleting image from bucket:', filePath);

      const { error } = await supabase.storage
        .from('postore')
        .remove([filePath]);

      if (error) {
        console.warn('Error deleting image from bucket:', error);
      } else {
        console.log('Image deleted successfully from bucket');
      }
    } catch (error) {
      console.warn('Error deleting image from bucket:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.ImageUrl);
    const nameParts = splitBilingualText(product.Name || '');
    const descParts = splitBilingualText(product.Description || '');

    setFormData({
      NameEs: nameParts.es,
      NameEn: nameParts.en,
      DescriptionEs: descParts.es,
      DescriptionEn: descParts.en,
      Price: product.Price.toString(),
      CategoryId: product.CategoryId?.toString() || '',
      ImageUrl: product.ImageUrl,
      IsService: product.IsService,
      IsOffer: product.IsOffer || false,
      Active: product.Active,
      IdBusiness: product.IdBusiness || 0,
      BusinessEmail: product.BusinessEmail || ''
    });

    // Scroll to top after clicking edit
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.product.deleteConfirm'))) return;

    try {
      // Find the product to get its image URL before deleting
      const product = products.find(p => p.Id === id);

      // Delete image from bucket if it exists
      if (product?.ImageUrl) {
        await deleteImageFromBucket(product.ImageUrl);
      }

      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('Id', id);

      if (error) throw error;
      await loadProducts();

      // Scroll to top after successful delete
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (1MB limit)
    if (file.size > 1024 * 1024) {
      alert(t('admin.product.imageSizeError'));
      e.target.value = '';
      return;
    }

    // Check file type - accept specific image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert(t('admin.product.imageTypeError'));
      e.target.value = '';
      return;
    }

    setUploadingImage(true);

    try {
      // Delete old image if it exists and we're editing
      if (editingProduct && formData.ImageUrl) {
        await deleteImageFromBucket(formData.ImageUrl);
      }

      // Create a unique filename like react-bike-shop
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const settings = await getSettings();
      const productId = editingProduct?.Id || Date.now();
      const filePath = `${settings?.id}/${productId}/${fileName}`;

      // Upload to Supabase Storage using postore bucket
      const { error: uploadError } = await supabase.storage
        .from('postore')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL from postore bucket
      const { data: publicUrlData } = supabase.storage
        .from('postore')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update form data and preview (single image)
      console.log('Public URL generated:', publicUrl); // Debug
      setFormData({ ...formData, ImageUrl: publicUrl });
      setImagePreview(publicUrl);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(t('admin.product.imageUploadError'));
      e.target.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = async () => {
    // Delete image from bucket if it exists
    if (formData.ImageUrl) {
      await deleteImageFromBucket(formData.ImageUrl);
    }

    setFormData({ ...formData, ImageUrl: '' });
    setImagePreview('');
  };

  const resetForm = () => {
    setEditingProduct(null);
    setImagePreview('');
    setFormData({
      NameEs: '',
      NameEn: '',
      DescriptionEs: '',
      DescriptionEn: '',
      Price: '',
      CategoryId: categories[0]?.Id?.toString() || '',
      ImageUrl: '',
      IsService: false,
      IsOffer: false,
      Active: true,
      IdBusiness: 0,
      BusinessEmail: ''
    });
  };

  if (loading) {
    return <div>{t('admin.product.loadingProducts')}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          {editingProduct ? t('admin.product.editProduct') : t('admin.product.addNew')}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.nameSpanish')}
              </label>
              <input
                type="text"
                required
                value={formData.NameEs}
                onChange={(e) => setFormData({ ...formData, NameEs: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.nameEnglish')}
              </label>
              <input
                type="text"
                value={formData.NameEn}
                onChange={(e) => setFormData({ ...formData, NameEn: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.price')}
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.Price}
                onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.category')}
              </label>
              <select
                value={formData.CategoryId}
                onChange={(e) => setFormData({ ...formData, CategoryId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.length === 0 ? (
                  <option key="no-categories" value="">{t('admin.category.noCategoriesAvailable')}</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.Id || category.Name || `category-${Math.random()}`} value={(category.Id || '').toString()}>
                      {category.DisplayName || category.Name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.descriptionSpanish')}
              </label>
              <textarea
                required
                value={formData.DescriptionEs}
                onChange={(e) => setFormData({ ...formData, DescriptionEs: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.descriptionEnglish')}
              </label>
              <textarea
                value={formData.DescriptionEn}
                onChange={(e) => setFormData({ ...formData, DescriptionEn: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image (Max 1MB)
            </label>

            {imagePreview || formData.ImageUrl ? (
              <div className="mb-4">
                {/* Debug info */}
                <div className="text-xs text-gray-500 mb-2">
                  Debug: imagePreview={imagePreview ? 'set' : 'empty'}, formData.ImageUrl={formData.ImageUrl ? 'set' : 'empty'}
                </div>
                <img
                  src={imagePreview || formData.ImageUrl}
                  alt="Product preview"
                  className="w-48 h-48 object-cover rounded-md border border-gray-300"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    console.error('Failed to load image URL:', imagePreview || formData.ImageUrl);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', imagePreview || formData.ImageUrl);
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-xs">
                  PNG, JPG, GIF, WebP up to 1MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className={`absolute inset-0 w-full h-full opacity-0 ${uploadingImage ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>
            )}

            {uploadingImage && (
              <div className="mt-2 text-blue-600 text-sm font-medium">
                Uploading image...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="Active"
              checked={formData.Active}
              onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="Active" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="IsOffer"
              checked={formData.IsOffer}
              onChange={(e) => setFormData({ ...formData, IsOffer: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="IsOffer" className="text-sm text-gray-700">
              Is Offer
            </label>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Products ({products.length})
        </h3>

        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.Id} className="flex justify-between items-start p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1">
                {product.ImageUrl && (
                  <img
                    src={product.ImageUrl}
                    alt={product.Name}
                    className="w-16 h-16 object-cover rounded-md mb-3 border border-gray-100"
                  />
                )}
                <h4 className="text-base font-semibold m-0 mb-1 text-gray-900">
                  {splitBilingualText(product.Name).es || product.Name}
                  {splitBilingualText(product.Name).en && (
                    <span className="block text-xs font-normal text-gray-500 mt-0.5">
                      {splitBilingualText(product.Name).en}
                    </span>
                  )}
                </h4>
                <p className="m-0 mb-2 text-sm text-gray-600">
                  {splitBilingualText(product.Description).es || product.Description}
                  {splitBilingualText(product.Description).en && (
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {splitBilingualText(product.Description).en}
                    </span>
                  )}
                </p>
                <p className="m-0 text-sm font-bold text-gray-900">
                  {getCurrencySymbol(currencyCode)}{product.Price.toFixed(2)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.IsOffer && (
                    <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      Offer
                    </span>
                  )}
                  {!product.Active && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Edit Product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => product.Id && handleDelete(product.Id)}
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
