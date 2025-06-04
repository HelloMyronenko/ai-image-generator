import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AITools from './components/AITools'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import ImageGenerator from './components/ImageGenerator'

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'image-generator'>('home')

  const handleToolClick = (toolId: string) => {
    if (toolId === 'image-generator') {
      setCurrentView('image-generator')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentView} />
      {currentView === 'home' ? (
        <>
          <Hero />
          <AITools onToolClick={handleToolClick} />
          <Features />
          <Pricing />
        </>
      ) : (
        <ImageGenerator />
      )}
      <Footer />
    </div>
  )
}

export default App
