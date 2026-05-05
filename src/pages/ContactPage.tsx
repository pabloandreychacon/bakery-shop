import { Header } from '../components/Header'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'
import { SEO } from '../components/SEO'
import { useTranslation } from 'react-i18next'

export function ContactPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO 
        title={t('navigation.contact')} 
        description={t('contact.subtitle')} 
      />
      <Header />
      <Contact />
      <Footer />
      <ChatButton />
    </div>
  )
}
