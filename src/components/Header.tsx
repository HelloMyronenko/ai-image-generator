import React, { useState } from 'react'
import { Menu, X, Cpu, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onNavigate?: (view: 'home' | 'image-generator') => void
}

const Header = ({ onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const handleProductClick = (product: string) => {
    if (product === 'image-generator' && onNavigate) {
      onNavigate('image-generator')
    }
    setIsProductsOpen(false)
  }

  const handleLogoClick = () => {
    if (onNavigate) {
      onNavigate('home')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <Cpu className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">DeepAI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault()
                      handleProductClick('image-generator')
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Image Generator
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Text Analysis</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Chat AI</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Code Assistant</a>
                </div>
              )}
            </div>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">API</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Documentation</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">Sign In</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-600">Products</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">API</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Documentation</a>
              <button className="text-gray-700 hover:text-blue-600 text-left">Sign In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
