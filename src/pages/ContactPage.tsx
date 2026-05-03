import { Header } from '../components/Header'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'

export function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Contact />
      <Footer />
      <ChatButton />
    </div>
  )
}
