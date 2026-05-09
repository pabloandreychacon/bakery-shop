import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSettings, type BusinessSettings, defaultSettings } from '../../utils/settings';
import bcrypt from 'bcryptjs';

interface AdminSettingsProps {
  t: any;
}

export function AdminSettings({ t }: AdminSettingsProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await getSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      let updateData: any = {
        Email: settings.email,
        Phone: settings.phone,
        Address: settings.address,
        BusinessName: settings.businessName,
        MapLocation: `${settings.latitude},${settings.longitude}`
      };

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage('Passwords do not match');
          setSaving(false);
          return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.OnlinePassword = hashedPassword;
      }

      const { error } = await supabase
        .from('Settings')
        .update(updateData)
        .eq('Id', defaultSettings.id);

      if (error) {
        setMessage(t('admin.error'));
      } else {
        setMessage(t('admin.saved'));
        setNewPassword('');
        setConfirmPassword('');
        await loadSettings();
      }
    } catch (err) {
      setMessage(t('admin.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!settings) {
    return <div>Error loading settings</div>;
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('admin.businessName')}
        </label>
        <input
          type="text"
          value={settings.businessName}
          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('admin.email')}
        </label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('admin.phone')}
        </label>
        <input
          type="tel"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('admin.address')}
        </label>
        <input
          type="text"
          value={settings.address}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('admin.mapLocation')}
        </label>
        <input
          type="text"
          value={`${settings.latitude},${settings.longitude}`}
          onChange={(e) => {
            const [lat, lng] = e.target.value.split(',').map(coord => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              setSettings({ ...settings, latitude: lat, longitude: lng });
            }
          }}
          placeholder="latitude,longitude"
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-base font-semibold mb-4 text-gray-900">
          {t('admin.changePassword')}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            {t('admin.newPassword')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            {t('admin.confirmPassword')}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('success') || message.includes('Guardado') || message.includes('Saved')
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className={`flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white transition-colors duration-200 ${
          saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }`}
      >
        <Save className="w-4 h-4" />
        {saving ? t('admin.saving') : t('admin.save')}
      </button>
    </form>
  );
}
