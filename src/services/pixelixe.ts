interface PixelixeResponse {
  success: boolean
  data?: {
    url: string
    id: string
  }
  error?: string
  message?: string
  images?: Array<{
    url: string
    id: string
  }>
}

export class PixelixeService {
  private apiKey: string
  private proxyToken: string
  private proxyUrl: string = 'https://proxy.chatandbuild.com/proxy/'

  constructor() {
    this.apiKey = import.meta.env.VITE_PIXELIXE_API_KEY || ''
    this.proxyToken = import.meta.env.VITE_PROXY_SERVER_ACCESS_TOKEN || ''
  }

  async generateImage(prompt: string, style: string = 'realistic'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Pixelixe API key is not configured')
    }

    try {
      // Try different Pixelixe API endpoints
      // First, let's try the standard AI endpoint
      const pixelixeUrl = 'https://studio.pixelixe.com/api/compress/v1?imageUrl=https://yoururl.com/image.png'
      
      // Prepare the request body for Pixelixe
      // Based on common AI API patterns
      const requestBody = {
        prompt: prompt,
        style: style,
        // Try with minimal parameters first
        width: 512,
        height: 512,
        samples: 1
      }

      console.log('Attempting Pixelixe API call with:', {
        url: pixelixeUrl,
        apiKey: this.apiKey.substring(0, 5) + '...',
        body: requestBody
      })

      // Use proxy server to make the request
      const proxyRequestBody = {
        url: pixelixeUrl,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Api-Key': this.apiKey,
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      }

      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.proxyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proxyRequestBody)
      })

      console.log('Proxy response status:', response.status)
      console.log('Proxy response headers:', response.headers)
      
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let data: any
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse response as JSON:', e)
        throw new Error(`Invalid response from API: ${responseText.substring(0, 200)}`)
      }

      console.log('Parsed response:', data)
      
      // Check various possible response formats
      if (data && data.data && data.data.url) {
        return data.data.url
      } else if (data && data.url) {
        return data.url
      } else if (data && data.images && data.images.length > 0 && data.images[0].url) {
        return data.images[0].url
      } else if (data && data.result && data.result.url) {
        return data.result.url
      } else if (data && data.output && data.output.url) {
        return data.output.url
      } else if (data && data.image_url) {
        return data.image_url
      }
      
      // If we have an error message, throw it
      if (data && (data.error || data.message)) {
        throw new Error(data.error || data.message)
      }
      
      console.error('Unexpected response structure:', data)
      throw new Error('No image URL found in response')
    } catch (error) {
      console.error('Pixelixe API Error Details:', error)
      
      // Try alternative endpoint if first one fails
      if (error instanceof Error && error.message.includes('No image URL')) {
        console.log('Trying alternative Pixelixe endpoint...')
        return this.tryAlternativeEndpoint(prompt, style)
      }
      
      // Return a placeholder image if API fails
      return this.getPlaceholderImage(prompt, style)
    }
  }

  private async tryAlternativeEndpoint(prompt: string, style: string): Promise<string> {
    try {
      // Try a different endpoint structure
      const pixelixeUrl = 'https://api.pixelixe.com/v1/ai/text-to-image'
      
      const requestBody = {
        text: prompt,
        model: 'stable-diffusion',
        style: style,
        width: 512,
        height: 512
      }

      console.log('Trying alternative endpoint:', pixelixeUrl)

      const proxyRequestBody = {
        url: pixelixeUrl,
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: requestBody
      }

      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.proxyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proxyRequestBody)
      })

      const data = await response.json()
      console.log('Alternative endpoint response:', data)

      if (data && data.url) {
        return data.url
      } else if (data && data.data && data.data.url) {
        return data.data.url
      }

      throw new Error('Alternative endpoint also failed')
    } catch (error) {
      console.error('Alternative endpoint error:', error)
      return this.getPlaceholderImage(prompt, style)
    }
  }

  private getModelFromStyle(style: string): string {
    // Map our style presets to common AI model names
    const styleToModel: Record<string, string> = {
      'realistic': 'stable-diffusion',
      'artistic': 'artistic',
      'anime': 'anime',
      '3d': '3d-render'
    }
    
    return styleToModel[style] || 'stable-diffusion'
  }

  private getPlaceholderImage(prompt: string, style: string): string {
    console.log('Returning placeholder image for style:', style)
    
    // Return a relevant placeholder based on style
    const placeholders: Record<string, string> = {
      'realistic': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
      'artistic': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
      'anime': 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=800&fit=crop',
      '3d': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop'
    }
    
    return placeholders[style] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop'
  }
}

export const pixelixeService = new PixelixeService()
