import React, { useState } from 'react'
import { Sparkles, Download, Share2, Heart, RefreshCw, Wand2, Palette, Camera, Zap, AlertCircle, Info } from 'lucide-react'
import { openAIService } from '../services/openai'

interface GeneratedImage {
  id: string
  prompt: string
  url: string
  timestamp: Date
  style: string
}

const stylePresets = [
  { id: 'realistic', name: 'Realistic', icon: Camera },
  { id: 'artistic', name: 'Artistic', icon: Palette },
  { id: 'anime', name: 'Anime', icon: Sparkles },
  { id: '3d', name: '3D Render', icon: Wand2 },
]

const aspectRatios = [
  { id: '1:1', name: 'Square', value: '1:1' },
  { id: '16:9', name: 'Landscape', value: '16:9' },
  { id: '9:16', name: 'Portrait', value: '9:16' },
  { id: '4:3', name: 'Classic', value: '4:3' },
]

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [selectedRatio, setSelectedRatio] = useState('1:1')
  const [error, setError] = useState<string | null>(null)
  const [showApiInfo, setShowApiInfo] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: 'A futuristic city with flying cars at sunset',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=800&fit=crop',
      timestamp: new Date(),
      style: 'realistic'
    },
    {
      id: '2',
      prompt: 'A magical forest with glowing mushrooms',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=800&fit=crop',
      timestamp: new Date(),
      style: 'artistic'
    },
    {
      id: '3',
      prompt: 'An astronaut playing guitar on Mars',
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=800&fit=crop',
      timestamp: new Date(),
      style: 'realistic'
    },
    {
      id: '4',
      prompt: 'A steampunk mechanical dragon',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
      timestamp: new Date(),
      style: '3d'
    }
  ])
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    
    try {
      // Check if API key is configured
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('Please configure your OpenAI API key in the .env file')
      }

      console.log('Starting image generation with prompt:', prompt)
      
      // Call OpenAI API
      const imageUrl = await openAIService.generateImage(prompt, selectedStyle)
      
      console.log('Received image URL:', imageUrl)
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt,
        url: imageUrl,
        timestamp: new Date(),
        style: selectedStyle
      }
      
      setGeneratedImages([newImage, ...generatedImages])
      setSelectedImage(newImage)
      setPrompt('')
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-generated-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Image Generator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your ideas into stunning visuals with OpenAI's DALL-E 3 advanced image generation technology
          </p>
        </div>

        {/* API Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-blue-800">
                <strong>Note:</strong> This demo uses OpenAI's DALL-E 3 API for high-quality image generation.
              </p>
              <button
                onClick={() => setShowApiInfo(!showApiInfo)}
                className="text-sm text-blue-600 underline mt-1"
              >
                {showApiInfo ? 'Hide' : 'Show'} API configuration details
              </button>
              {showApiInfo && (
                <div className="mt-2 text-sm text-blue-700 bg-white rounded p-3">
                  <p>Current configuration:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>OpenAI API Key: {import.meta.env.VITE_OPENAI_API_KEY ? '✓ Configured' : '✗ Not configured'}</li>
                    <li>Proxy Token: {import.meta.env.VITE_PROXY_SERVER_ACCESS_TOKEN ? '✓ Configured' : '✗ Not configured'}</li>
                    <li>Model: DALL-E 3 (Latest)</li>
                    <li>Image Size: 1024x1024</li>
                    <li>Using proxy server to handle CORS</li>
                  </ul>
                  <p className="mt-2 text-orange-700 font-medium">
                    ⚠️ Each generation costs approximately $0.04. Monitor your OpenAI usage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800">{error}</p>
              {error.includes('API key') && (
                <p className="text-sm text-red-600 mt-1">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
                </p>
              )}
              {error.includes('quota') && (
                <p className="text-sm text-red-600 mt-1">
                  Check your usage and billing at <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Usage</a>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene mountain landscape with a crystal clear lake reflecting the sunset..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stylePresets.map((style) => {
                  const Icon = style.icon
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedStyle === style.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs">{style.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                      selectedRatio === ratio.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {ratio.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: DALL-E 3 generates square images by default. Aspect ratio selection is for UI reference only.
              </p>
            </div>

            {/* Advanced Options */}
            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Advanced Options
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Quality</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Standard (Faster)</option>
                    <option>HD (Higher Quality)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Additional Instructions</label>
                  <input
                    type="text"
                    placeholder="Add more details to your prompt..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </details>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`w-full py-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                isGenerating
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Generating... (This may take 10-20 seconds)
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Generate Image
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Powered by OpenAI DALL-E 3 • ~$0.04 per generation
            </p>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDownload(selectedImage)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Download className="h-5 w-5 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                      <Share2 className="h-5 w-5 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                      <Heart className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium mb-1">Prompt:</p>
                  <p className="text-sm text-gray-600">{selectedImage.prompt}</p>
                  <p className="text-xs text-gray-500 mt-2">Style: {selectedImage.style}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Your generated image will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Generations */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Generations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="cursor-pointer group relative overflow-hidden rounded-lg"
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm truncate">{image.prompt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pro Tips for Better Results with DALL-E 3</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Be Descriptive</h4>
              <p className="text-sm text-gray-600">
                DALL-E 3 understands complex descriptions. Include details about composition, lighting, and mood.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Specify Art Style</h4>
              <p className="text-sm text-gray-600">
                Mention specific art styles like "oil painting", "watercolor", "digital art", or artist names for inspiration.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Use Clear Language</h4>
              <p className="text-sm text-gray-600">
                DALL-E 3 works best with clear, grammatically correct prompts. Avoid ambiguous descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImageGenerator
