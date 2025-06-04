interface DeepAIResponse {
  id: string
  output_url: string
}

export class DeepAIService {
  private apiKey: string

  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPAI_API_KEY || ''
  }

  async generateImage(prompt: string, style: string = 'text2img'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepAI API key is not configured')
    }

    try {
      // Prepare FormData for DeepAI
      const formData = new FormData()
      formData.append('text', prompt)

      // Use the proxy endpoint we'll configure in Vite
      const response = await fetch('https://studio.pixelixe.com/api/compress/v1?imageUrl=https://yoururl.com/image.png', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey
        },
        body: formData
      })

      console.log('DeepAI response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('DeepAI Error Response:', errorText)
        throw new Error(`DeepAI request failed: ${response.status} ${response.statusText}`)
      }

      const data: DeepAIResponse = await response.json()
      console.log('DeepAI response:', data)
      
      if (!data.output_url) {
        console.error('No output_url in response:', data)
        throw new Error('No image URL returned from DeepAI')
      }

      return data.output_url
    } catch (error) {
      console.error('DeepAI API Error:', error)
      
      // Return a placeholder image if API fails
      return this.getPlaceholderImage(prompt, style)
    }
  }

  private getPlaceholderImage(prompt: string, style: string): string {
    // Return a relevant placeholder based on style
    const placeholders: Record<string, string> = {
      'realistic': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
      'artistic': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
      'anime': 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=800&fit=crop',
      '3d': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop'
    }
    
    // Use a default placeholder
    return placeholders[style] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop'
  }
}

export const deepAIService = new DeepAIService()
