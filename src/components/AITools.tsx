import React from 'react'
import { Image, MessageSquare, Code, FileText, Palette, Music, Video, Brain } from 'lucide-react'

interface AIToolsProps {
  onToolClick?: (tool: string) => void
}

const tools = [
  {
    id: 'image-generator',
    icon: Image,
    title: 'Image Generator',
    description: 'Create stunning images from text descriptions using state-of-the-art AI',
    color: 'bg-purple-100 text-purple-600',
    popular: true
  },
  {
    id: 'chat-ai',
    icon: MessageSquare,
    title: 'Chat AI',
    description: 'Engage with intelligent conversational AI for any topic',
    color: 'bg-blue-100 text-blue-600',
    popular: true
  },
  {
    id: 'code-assistant',
    icon: Code,
    title: 'Code Assistant',
    description: 'Generate, debug, and optimize code in multiple languages',
    color: 'bg-green-100 text-green-600',
    popular: false
  },
  {
    id: 'text-analysis',
    icon: FileText,
    title: 'Text Analysis',
    description: 'Extract insights and sentiment from any text',
    color: 'bg-yellow-100 text-yellow-600',
    popular: false
  },
  {
    id: 'style-transfer',
    icon: Palette,
    title: 'Style Transfer',
    description: 'Transform images with artistic styles and filters',
    color: 'bg-pink-100 text-pink-600',
    popular: false
  },
  {
    id: 'audio-generation',
    icon: Music,
    title: 'Audio Generation',
    description: 'Create music and sound effects with AI',
    color: 'bg-indigo-100 text-indigo-600',
    popular: false
  },
  {
    id: 'video-enhancement',
    icon: Video,
    title: 'Video Enhancement',
    description: 'Upscale and enhance video quality automatically',
    color: 'bg-red-100 text-red-600',
    popular: false
  },
  {
    id: 'neural-networks',
    icon: Brain,
    title: 'Neural Networks',
    description: 'Build and train custom AI models',
    color: 'bg-gray-100 text-gray-600',
    popular: false
  }
]

const AITools = ({ onToolClick }: AIToolsProps) => {
  const handleToolClick = (toolId: string) => {
    if (onToolClick) {
      onToolClick(toolId)
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful AI Tools at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive suite of AI-powered tools designed to enhance your creativity and productivity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <div
                key={index}
                onClick={() => handleToolClick(tool.id)}
                className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                {tool.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
                
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                  Try it now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default AITools
