interface OpenAIImageResponse {
  created: number
  data: Array<{
    url: string
    revised_prompt?: string
  }>
}

export class OpenAIService {
  private apiKey: string
  private proxyToken: string
  private proxyUrl: string = 'https://proxy.chatandbuild.com/proxy'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
    this.proxyToken = import.meta.env.VITE_PROXY_SERVER_ACCESS_TOKEN || ''
  }

  async generateImage(prompt: string, style: string = 'realistic'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    try {
      // Enhance prompt based on style
      const enhancedPrompt = this.enhancePromptWithStyle(prompt, style)
      
      // OpenAI DALL-E 3 endpoint
      const openAIUrl = 'https://api.openai.com/v1/images/generations'
      
      // Prepare the request body for OpenAI
      const requestBody = {
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }

      console.log('Attempting OpenAI API call with:', {
        url: openAIUrl,
        prompt: enhancedPrompt,
        model: 'dall-e-3'
      })

      // Use proxy server to make the request
      const proxyRequestBody = {
        url: openAIUrl,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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

      console.log('Proxy response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI Error Response:', errorText)
        
        // Try to parse error for better messaging
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error && errorData.error.message) {
            throw new Error(`OpenAI API Error: ${errorData.error.message}`)
          }
        } catch (e) {
          // If parsing fails, use generic error
        }
        
        throw new Error(`OpenAI request failed: ${response.status} ${response.statusText}`)
      }

      const data: OpenAIImageResponse = await response.json()
      console.log('OpenAI response:', data)
      
      if (!data.data || data.data.length === 0 || !data.data[0].url) {
        console.error('No image URL in response:', data)
        throw new Error('No image URL returned from OpenAI')
      }

      // Log the revised prompt if available
      if (data.data[0].revised_prompt) {
        console.log('Revised prompt:', data.data[0].revised_prompt)
      }

      return data.data[0].url
    } catch (error) {
      console.error('OpenAI API Error:', error)
      
      // If it's a rate limit or quota error, provide helpful message
      if (error instanceof Error) {
        if (error.message.includes('rate_limit')) {
          throw new Error('Rate limit exceeded. Please try again in a few moments.')
        } else if (error.message.includes('insufficient_quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your billing.')
        }
      }
      
      // Return a placeholder image if API fails
      return this.getPlaceholderImage(prompt, style)
    }
  }

  private enhancePromptWithStyle(prompt: string, style: string): string {
    // Enhance the prompt based on the selected style
    const styleEnhancements: Record<string, string> = {
      'realistic': `${prompt}, photorealistic, high detail, professional photography, 8k resolution`,
      'artistic': `${prompt}, artistic painting, oil on canvas, masterpiece, vibrant colors, artistic style`,
      'anime': `${prompt}, anime style, manga art, Japanese animation, colorful, detailed anime artwork`,
      '3d': `${prompt}, 3D render, CGI, octane render, volumetric lighting, high quality 3D graphics`
    }
    
    return styleEnhancements[style] || prompt
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

export const openAIService = new OpenAIService()
