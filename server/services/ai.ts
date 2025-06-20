import Replicate from 'replicate';

interface ClaudeResponse {
  content: string;
  confidence: number;
}

class AIService {
  private replicate: Replicate | null = null;

  constructor() {
    if (process.env.REPLICATE_API_TOKEN) {
      this.replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
    }
  }

  async analyzeSocialContent(content: string): Promise<{
    isSpam: boolean;
    qualityScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    reasoning: string;
  }> {
    if (!this.replicate) {
      throw new Error('Replicate API not configured');
    }

    try {
      const prompt = `Analyze this social media content for the Gemlaunch platform. Rate quality (1-10), detect spam, assess sentiment, and provide reasoning.

Content: "${content}"

Respond in JSON format:
{
  "isSpam": boolean,
  "qualityScore": number (1-10),
  "sentiment": "positive|negative|neutral",
  "reasoning": "brief explanation"
}`;

      const output = await this.replicate.run(
        "anthropic/claude-3.5-sonnet:latest",
        {
          input: {
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.1
          }
        }
      ) as string[];

      const response = JSON.parse(output.join(''));
      
      return {
        isSpam: response.isSpam || false,
        qualityScore: Math.max(1, Math.min(10, response.qualityScore || 5)),
        sentiment: response.sentiment || 'neutral',
        reasoning: response.reasoning || 'Analysis completed'
      };

    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to basic analysis
      return {
        isSpam: content.length < 10 || /^.{1,3}$/.test(content.trim()),
        qualityScore: Math.min(10, Math.max(1, content.length / 20)),
        sentiment: 'neutral',
        reasoning: 'Basic analysis due to AI service unavailable'
      };
    }
  }

  async validateReferralQuality(userAddress: string, refereeAddress: string): Promise<{
    isValid: boolean;
    riskScore: number;
    reasoning: string;
  }> {
    // Basic validation without AI if service unavailable
    if (!this.replicate) {
      return {
        isValid: userAddress.toLowerCase() !== refereeAddress.toLowerCase(),
        riskScore: 0.1,
        reasoning: 'Basic validation - addresses are different'
      };
    }

    try {
      const prompt = `Analyze these wallet addresses for potential sybil attack patterns:

Referrer: ${userAddress}
Referee: ${refereeAddress}

Check for:
- Similar address patterns
- Sequential creation indicators
- Risk assessment (0-1 scale)

Respond in JSON:
{
  "isValid": boolean,
  "riskScore": number (0-1),
  "reasoning": "analysis explanation"
}`;

      const output = await this.replicate.run(
        "anthropic/claude-3.5-sonnet:latest",
        {
          input: {
            prompt: prompt,
            max_tokens: 300,
            temperature: 0.1
          }
        }
      ) as string[];

      const response = JSON.parse(output.join(''));
      
      return {
        isValid: response.isValid !== false,
        riskScore: Math.max(0, Math.min(1, response.riskScore || 0.1)),
        reasoning: response.reasoning || 'Address validation completed'
      };

    } catch (error) {
      console.error('Referral validation error:', error);
      return {
        isValid: userAddress.toLowerCase() !== refereeAddress.toLowerCase(),
        riskScore: 0.1,
        reasoning: 'Basic validation due to AI service error'
      };
    }
  }

  isConfigured(): boolean {
    return this.replicate !== null;
  }
}

export const aiService = new AIService();