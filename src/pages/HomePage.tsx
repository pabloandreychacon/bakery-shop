import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Menu } from '../components/Products'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'
import { SEO, LocalBusinessSchema } from '../components/SEO'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO 
        title={t('navigation.home')} 
        description={t('about.subtitle')} 
      />
      <LocalBusinessSchema />
      <Header />
      <Hero />
      <Menu />
      <About />
      <Contact />
      <Footer />
      <ChatButton />
    </div>
  )
}
