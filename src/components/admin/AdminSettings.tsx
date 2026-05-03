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
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
          {t('admin.businessName')}
        </label>
        <input
          type="text"
          value={settings.businessName}
          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
          {t('admin.email')}
        </label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
          {t('admin.phone')}
        </label>
        <input
          type="tel"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
          {t('admin.address')}
        </label>
        <input
          type="text"
          value={settings.address}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
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
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          {t('admin.changePassword')}
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            {t('admin.newPassword')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                paddingRight: '2.5rem'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            {t('admin.confirmPassword')}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {message && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
          color: message.includes('success') ? '#065f46' : '#991b1b'
        }}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'white',
          backgroundColor: saving ? '#9ca3af' : '#2563eb',
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        <Save style={{ width: '1rem', height: '1rem' }} />
        {saving ? t('admin.saving') : t('admin.save')}
      </button>
    </form>
  );
}
