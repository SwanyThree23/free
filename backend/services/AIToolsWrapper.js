import axios from 'axios';

class AIToolsWrapper {
  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
  }

  async chatCompletion(messages, model = 'anthropic/claude-3-sonnet') {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://swanythree.app',
            'X-Title': 'SwanyThree AI Tools'
          }
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('OpenRouter chat error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Chat completion failed'
      };
    }
  }

  async compressText(text, compressionRate = 0.5) {
    try {
      // LLMLingua-style compression using Claude
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: Math.floor(text.length * compressionRate),
          messages: [{
            role: 'user',
            content: `Compress the following text to approximately ${Math.floor(compressionRate * 100)}% of its original length while preserving key information:\n\n${text}`
          }]
        },
        {
          headers: {
            'x-api-key': this.anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      const compressed = response.data.content[0].text;

      return {
        success: true,
        original_length: text.length,
        compressed_length: compressed.length,
        compression_ratio: (compressed.length / text.length).toFixed(2),
        compressed_text: compressed
      };
    } catch (error) {
      console.error('Text compression error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Compression failed'
      };
    }
  }

  async generatePodcast(topic, duration = 'medium') {
    try {
      // NotebookLM-style podcast generation
      const durationMap = {
        short: 500,
        medium: 1000,
        long: 2000
      };

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: durationMap[duration] || 1000,
          messages: [{
            role: 'user',
            content: `Create a podcast-style dialogue between two hosts discussing: ${topic}. Format as:\nHost A: [dialogue]\nHost B: [dialogue]\n\nMake it engaging, informative, and conversational.`
          }]
        },
        {
          headers: {
            'x-api-key': this.anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        topic,
        duration,
        script: response.data.content[0].text,
        word_count: response.data.content[0].text.split(' ').length
      };
    } catch (error) {
      console.error('Podcast generation error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Podcast generation failed'
      };
    }
  }

  async getAvailableModels() {
    try {
      const response = await axios.get(
        'https://openrouter.ai/api/v1/models',
        {
          headers: {
            'Authorization': `Bearer ${this.openRouterKey}`
          }
        }
      );

      return {
        success: true,
        models: response.data.data.map(m => ({
          id: m.id,
          name: m.name,
          context_length: m.context_length,
          pricing: m.pricing
        }))
      };
    } catch (error) {
      console.error('Get models error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Failed to fetch models'
      };
    }
  }
}

export default new AIToolsWrapper();
