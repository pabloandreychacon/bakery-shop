import { Header } from '../components/Header'
import { Menu } from '../components/Products'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'
import { SEO } from '../components/SEO'
import { useTranslation } from 'react-i18next'

export function ProductsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO 
        title={t('navigation.menu')} 
        description={t('menu.subtitle')} 
      />
      <Header />
      <Menu />
      <Footer />
      <ChatButton />
    </div>
  )
}
