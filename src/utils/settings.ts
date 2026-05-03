import { supabase } from '../lib/supabase';

// Function to get currency symbol from currency code
export function getCurrencySymbol(currencyCode?: string): string {
  const currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'CRC': '₡',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'BRL': 'R$',
    'MXN': '$',
    'CAD': '$',
    'AUD': '$',
    'CHF': 'CHF',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'RUB': '₽',
    'KRW': '₩',
    'SGD': '$',
    'HKD': '$',
    'NZD': '$',
    'ZAR': 'R',
    'TRY': '₺'
  };

  return currencySymbols[currencyCode || ''] || currencyCode || '$';
}

export interface BusinessSettings {
  id: number;
  address: string;
  phone: string;
  email: string;
  hours: string;
  latitude: number;
  longitude: number;
  businessName?: string;
  onlinePassword: string;
  currencyCode?: string;
}

export const defaultSettings = {
  id: 10,
  address: '123 Bakery Lane, Sweet City, SC 12345',
  phone: '(555) 123-4567',
  email: 'hello@bakeryshop.com',
  hours: 'Monday - Saturday: 8:00 AM - 8:00 PM, Sunday: 9:00 AM - 6:00 PM',
  latitude: 40.7128,
  longitude: -74.0060,
  businessName: 'PANADERÍA ÁVILA',
  onlinePassword: '$2b$10$A5ebESkKmtGBAqhO5IWQQuDEz3vMS1Txc18jK44RBzYX36XJU.6R6' // Hash for "d"
};

export async function getSettings(): Promise<BusinessSettings | null> {
  try {
    const { data } = await supabase
      .from('Settings')
      .select('Address, Phone, Email, MapLocation, BusinessName, OnlinePassword, CurrencyCode')
      .eq('Id', defaultSettings.id)
      .single();

    if (!data) {
      console.log('No settings data found');
      return null;
    }

    console.log('Raw data from Supabase:', data);
    console.log('MapLocation field:', data.MapLocation);

    // Parse coordinates from MapLocation field
    let latitude = 40.7128;
    let longitude = -74.0060;

    if (data.MapLocation) {
      // MapLocation format: "10.01565866280609, -84.10092306022774"
      // Try pattern 1: lat, lng format (comma separated)
      const regex1 = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
      const match1 = data.MapLocation.match(regex1);

      if (match1) {
        latitude = parseFloat(match1[1]);
        longitude = parseFloat(match1[2]);
      } else {
        // Try pattern 2: Google Maps embed URL with !2d and !3d
        const regex2 = /!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/;
        const match2 = data.MapLocation.match(regex2);

        if (match2) {
          longitude = parseFloat(match2[1]);
          latitude = parseFloat(match2[2]);
        } else {
          // Try pattern 3: Google Maps URL with @lat,lng
          const regex3 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
          const match3 = data.MapLocation.match(regex3);

          if (match3) {
            latitude = parseFloat(match3[1]);
            longitude = parseFloat(match3[2]);
          }
        }
      }
    }

    const result = {
      id: 10,
      address: data.Address || defaultSettings.address,
      phone: data.Phone || defaultSettings.phone,
      email: data.Email || defaultSettings.email,
      hours: defaultSettings.hours,
      latitude,
      longitude,
      businessName: data.BusinessName || defaultSettings.businessName,
      onlinePassword: (data.OnlinePassword as string) || defaultSettings.onlinePassword
    };

    return result;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}
