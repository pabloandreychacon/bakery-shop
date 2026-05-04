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
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          {editingProduct ? t('admin.product.editProduct') : t('admin.product.addNew')}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                {t('admin.product.nameSpanish')}
              </label>
              <input
                type="text"
                required
                value={formData.NameEs}
                onChange={(e) => setFormData({ ...formData, NameEs: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                {t('admin.product.nameEnglish')}
              </label>
              <input
                type="text"
                value={formData.NameEn}
                onChange={(e) => setFormData({ ...formData, NameEn: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                {t('admin.product.price')}
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.Price}
                onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>


            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                {t('admin.product.category')}
              </label>
              <select
                value={formData.CategoryId}
                onChange={(e) => setFormData({ ...formData, CategoryId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                {t('admin.product.descriptionSpanish')}
              </label>
              <textarea
                required
                value={formData.DescriptionEs}
                onChange={(e) => setFormData({ ...formData, DescriptionEs: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                {t('admin.product.descriptionEnglish')}
              </label>
              <textarea
                value={formData.DescriptionEn}
                onChange={(e) => setFormData({ ...formData, DescriptionEn: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
              Product Image (Max 1MB)
            </label>

            {imagePreview || formData.ImageUrl ? (
              <div style={{ marginBottom: '1rem' }}>
                {/* Debug info */}
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  Debug: imagePreview={imagePreview ? 'set' : 'empty'}, formData.ImageUrl={formData.ImageUrl ? 'set' : 'empty'}
                </div>
                <img
                  src={imagePreview || formData.ImageUrl}
                  alt="Product preview"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
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
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <X style={{ width: '1rem', height: '1rem' }} />
                  Remove Image
                </button>
              </div>
            ) : (
              <div
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  position: 'relative'
                }}
              >
                <Upload style={{ width: '2rem', height: '2rem', color: '#9ca3af', margin: '0 auto 0.5rem' }} />
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  PNG, JPG, GIF, WebP up to 1MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer'
                  }}
                />
              </div>
            )}

            {uploadingImage && (
              <div style={{ marginTop: '0.5rem', color: '#2563eb', fontSize: '0.875rem' }}>
                Uploading image...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="Active"
              checked={formData.Active}
              onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
              style={{ width: '1rem', height: '1rem' }}
            />
            <label htmlFor="Active" style={{ fontSize: '0.875rem', color: '#374151' }}>
              Active
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="IsOffer"
              checked={formData.IsOffer}
              onChange={(e) => setFormData({ ...formData, IsOffer: e.target.checked })}
              style={{ width: '1rem', height: '1rem' }}
            />
            <label htmlFor="IsOffer" style={{ fontSize: '0.875rem', color: '#374151' }}>
              Is Offer
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                cursor: 'pointer'
              }}
            >
              {editingProduct ? <Edit2 style={{ width: '1rem', height: '1rem' }} /> : <Plus style={{ width: '1rem', height: '1rem' }} />}
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
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
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Products ({products.length})
        </h3>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map((product) => (
            <div key={product.Id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: 'white'
            }}>
              <div style={{ flex: 1 }}>
                {product.ImageUrl && (
                  <img
                    src={product.ImageUrl}
                    alt={product.Name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '0.375rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                )}
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                  {splitBilingualText(product.Name).es || product.Name}
                  {splitBilingualText(product.Name).en && (
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '400', color: '#6b7280' }}>
                      {splitBilingualText(product.Name).en}
                    </span>
                  )}
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                  {splitBilingualText(product.Description).es || product.Description}
                  {splitBilingualText(product.Description).en && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>
                      {splitBilingualText(product.Description).en}
                    </span>
                  )}
                </p>
                <p style={{ margin: '0', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{getCurrencySymbol(currencyCode)}{product.Price.toFixed(2)}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {product.IsOffer && (
                    <span style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      fontSize: '0.75rem',
                      borderRadius: '0.25rem',
                      marginRight: '0.5rem'
                    }}>
                      Offer
                    </span>
                  )}
                  {!product.Active && (
                    <span style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      fontSize: '0.75rem',
                      borderRadius: '0.25rem'
                    }}>
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 style={{ width: '1rem', height: '1rem' }} />
                </button>
                <button
                  onClick={() => product.Id && handleDelete(product.Id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
