import { Header } from '../components/Header'
import { About } from '../components/About'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'
import { SEO, LocalBusinessSchema } from '../components/SEO'
import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO 
        title={t('navigation.about')} 
        description={t('about.subtitle')} 
      />
      <LocalBusinessSchema />
      <Header />
      <About />
      <Footer />
      <ChatButton />
    </div>
  )
}
