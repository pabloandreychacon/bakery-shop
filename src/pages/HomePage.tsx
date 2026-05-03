import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Menu } from '../components/Products'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'

export function HomePage() {
  return (
    <div className="min-h-screen">
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
