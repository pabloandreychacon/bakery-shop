import { Header } from '../components/Header'
import { Menu } from '../components/Products'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'

export function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Menu />
      <Footer />
      <ChatButton />
    </div>
  )
}
