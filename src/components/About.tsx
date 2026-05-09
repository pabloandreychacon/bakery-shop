import { useTranslation } from 'react-i18next';
import mixImage from '../assets/mix.png';

export function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed w-screen left-0 right-0" style={{ backgroundImage: `url(${mixImage})` }}>
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.88) 100%)' }}></div>
      <div className="relative z-20 px-[5%] pt-[5.5rem] pb-48 max-w-7xl mx-auto flex flex-col justify-center">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">{t('about.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-56">
          <div>
            <div className="space-y-16">
              <div className="bg-white p-10 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold mb-16 text-gray-900">{t('about.values.family.title')}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.values.family.description')}
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold mb-16 text-gray-900">{t('about.values.philosophy.title')}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.values.philosophy.description')}
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold mb-16 text-gray-900">{t('about.values.community.title')}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.values.community.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-16 text-center text-white shadow-xl">
              <div className="text-4xl font-black mb-12">13+</div>
              <div className="text-amber-100">{t('about.stats.years')}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-12 text-center text-white shadow-xl">
              <div className="text-4xl font-black mb-4">50+</div>
              <div className="text-orange-100">{t('about.stats.products')}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-12 text-center text-white shadow-xl">
              <div className="text-4xl font-black mb-4">10K+</div>
              <div className="text-yellow-100">{t('about.stats.customers')}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl p-12 text-center text-white shadow-xl">
              <div className="text-4xl font-black mb-4">100%</div>
              <div className="text-amber-100">{t('about.stats.fresh')}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
