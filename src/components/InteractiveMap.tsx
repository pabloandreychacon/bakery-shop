import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBusinessInfo } from '../hooks/useBusinessName';

// Fix for default Leaflet icon
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function InteractiveMap() {
  const { businessInfo, loading } = useBusinessInfo();
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.0060]); // Default: NYC
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!businessInfo.Address || loading) return;

      try {
        // Using Nominatim API for geocoding (free)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(businessInfo.Address)}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
        // Keep default position if geocoding fails
      } finally {
        setMapReady(true);
      }
    };

    geocodeAddress();
  }, [businessInfo.Address, loading]);

  if (!mapReady) {
    return (
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl h-64 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <div className="w-8 h-8 bg-amber-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-800 font-semibold">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="h-64">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">{businessInfo.BusinessName}</h3>
                <p className="text-sm text-gray-600 mb-1">{businessInfo.Address}</p>
                <p className="text-sm text-gray-600 mb-1">{businessInfo.Phone}</p>
                <p className="text-sm text-gray-600">{businessInfo.Email}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{businessInfo.BusinessName}</h4>
            <p className="text-sm text-gray-600">{businessInfo.Address}</p>
          </div>
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo.Address)}`;
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
