import { useEffect, useState } from 'react';
import { getSettings } from '../utils/settings';

interface BusinessSettings {
  latitude?: number;
  longitude?: number;
  businessName?: string;
  address?: string;
}

export function InteractiveMap() {
  const [businessInfo, setBusinessInfo] = useState<BusinessSettings | null>(null);
  const [latitude, setLatitude] = useState(10.01565866280609);
  const [longitude, setLongitude] = useState(-84.10092306022774);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        setBusinessInfo(settings);
        if (settings?.latitude && settings?.longitude) {
          setLatitude(settings.latitude);
          setLongitude(settings.longitude);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="h-64">
        <iframe
          src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed&z=16`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          title={businessInfo?.businessName || 'Panadería Ávila Location'}
        />
      </div>
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{businessInfo?.businessName || 'Panadería Ávila'}</h4>
            <p className="text-sm text-gray-600">{businessInfo?.address || '123 Bakery Lane, Sweet City, SC 12345'}</p>
          </div>
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo?.address || '123 Bakery Lane, Sweet City, SC 12345')}`;
              window.open(url, '_blank');
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
          >
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}
