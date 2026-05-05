import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import breadImage from '../assets/bread.png';
import emailjs from '@emailjs/browser';
import { defaultSettings } from '../utils/settings';

interface ContactSettings {
  MapLocation?: string;
  BusinessName?: string;
  Address?: string;
  Phone?: string;
  Email?: string;
  latitude?: number;
  longitude?: number;
}

export function Contact() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('Settings')
        .select('MapLocation, BusinessName, Address, Phone, Email')
        .eq('Id', defaultSettings.id)
        .single();

      if (data?.MapLocation) {
        const [lat, lng] = data.MapLocation.split(',').map(Number);
        setSettings({ ...data, latitude: lat, longitude: lng });
      } else {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      emailjs.init("L7o6hZUmFJQ_Jbqu0");

      await emailjs.send("service_s481rtv", "template_771ecr6", {
        to_email: settings?.Email || 'panaderiaavila@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: `New Contact Form Submission from ${formData.name}`,
        message: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`,
      });

      alert(t('Thank you! We will contact you soon.', '¡Gracias! Nos pondremos en contacto pronto.'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert(t('Error sending message. Please try again.', 'Error al enviar mensaje. Inténtelo de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${breadImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      width: '100vw',
      left: 0,
      right: 0
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.88) 100%)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '5rem 5%',
        maxWidth: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">{t('contact.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-900">{t('contact.info.title')}</h3>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-relaxed">
                    {loading ? 'Loading...' : settings?.Address}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-relaxed">{loading ? 'Loading...' : settings?.Phone}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-yellow-700" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-relaxed">{loading ? 'Loading...' : settings?.Email}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">{t('footer.hours.title', 'Hours')}</h4>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {t('contact.info.hours', 'Monday - Saturday: 7:00 AM - 7:00 PM\nSunday: 8:00 AM - 5:00 PM\nHoliday hours may vary')}
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Map */}
            <div className="mt-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="h-full w-full bg-gray-200 rounded-lg">
                  <iframe
                    src={settings && settings.latitude && settings.longitude ? `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&output=embed&z=16` : "https://www.google.com/maps?q=10.01565866280609,-84.10092306022774&output=embed&z=16"}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="mt-4">
                    <a
                      href={settings && settings.latitude && settings.longitude ? `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}` : "https://www.google.com/maps?q=10.01565866280609,-84.10092306022774"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-900">{t('contact.form.title')}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">{t('contact.form.name')} *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">{t('contact.form.email')} *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">{t('contact.form.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">{t('contact.form.subject')} *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">{t('contact.form.message')} *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-lg transition-all font-semibold text-lg shadow-lg mt-6"
                >
                  {isSubmitting ? (
                    t('contact.form.sending', 'Sending...')
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.submit', 'Send Message')}
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
