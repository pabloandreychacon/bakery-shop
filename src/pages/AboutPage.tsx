import { Header } from '../components/Header'
import { About } from '../components/About'
import { Footer } from '../components/Footer'
import { ChatButton } from '../components/ChatButton'

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <About />
      <Footer />
      <ChatButton />
    </div>
  )
}
