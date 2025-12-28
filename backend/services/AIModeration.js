import axios from 'axios';

class AIModeration {
  constructor() {
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.openRouterKey = process.env.OPENROUTER_API_KEY;
  }

  async analyzeMessage(message, username) {
    try {
      // Use Claude via Anthropic API for toxicity analysis
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `Analyze this chat message for toxicity, hate speech, harassment, or inappropriate content. Respond ONLY with a number between 0.0 and 1.0, where 0.0 is completely safe and 1.0 is extremely toxic.\n\nUsername: ${username}\nMessage: ${message}\n\nToxicity score:`
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

      const scoreText = response.data.content[0].text.trim();
      const toxicityScore = parseFloat(scoreText);

      // Validate score is between 0 and 1
      const validScore = !isNaN(toxicityScore) && toxicityScore >= 0 && toxicityScore <= 1
        ? toxicityScore
        : 0.0;

      return {
        toxicity_score: validScore,
        action: validScore > 0.7 ? 'ban' : validScore > 0.5 ? 'warning' : 'none',
        message,
        username
      };
    } catch (error) {
      console.error('AI Moderation error:', error.response?.data || error.message);
      // Return safe default on error
      return {
        toxicity_score: 0.0,
        action: 'none',
        message,
        username,
        error: 'Analysis failed'
      };
    }
  }

  async analyzeMessageOpenRouter(message, username) {
    try {
      // Alternative using OpenRouter
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'anthropic/claude-3-haiku',
          messages: [{
            role: 'user',
            content: `Analyze toxicity (0.0-1.0): "${message}"`
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openRouterKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const scoreText = response.data.choices[0].message.content.trim();
      const toxicityScore = parseFloat(scoreText);
      const validScore = !isNaN(toxicityScore) ? Math.max(0, Math.min(1, toxicityScore)) : 0.0;

      return {
        toxicity_score: validScore,
        action: validScore > 0.7 ? 'ban' : validScore > 0.5 ? 'warning' : 'none',
        message,
        username
      };
    } catch (error) {
      console.error('OpenRouter moderation error:', error.response?.data || error.message);
      return {
        toxicity_score: 0.0,
        action: 'none',
        message,
        username,
        error: 'Analysis failed'
      };
    }
  }
}

export default new AIModeration();
