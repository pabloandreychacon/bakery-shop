import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Menu } from './components/Products'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ChatButton } from './components/ChatButton'
import { Admin } from './components/Admin'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={
          <div className="min-h-screen">
            <Header />
            <Admin />
            <Footer />
          </div>
        } />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
