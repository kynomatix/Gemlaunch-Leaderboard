import Replicate from 'replicate';

class SocialMediaAnalyzer {
  private replicate: Replicate | null = null;

  constructor() {
    if (process.env.REPLICATE_API_TOKEN) {
      this.replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
    }
  }

  async analyzeMentionAuthenticity(mentionText: string, username: string): Promise<{
    authenticityScore: number;
    isSpam: boolean;
    qualityScore: number;
    reasoning: string;
  }> {
    if (!this.replicate) {
      throw new Error('Replicate API not configured');
    }

    try {
      const prompt = `Analyze this social media mention of Gemlaunch for authenticity and quality. Consider tone, context, and whether it seems genuine or promotional.

Username: ${username}
Content: "${mentionText}"

Rate on these criteria:
- Authenticity (0-100): Does this seem like a genuine user experience vs promotional content?
- Quality (1-10): How thoughtful and valuable is this content?
- Spam detection: Does this look like bot/farm content?

Respond in JSON format:
{
  "authenticityScore": number (0-100),
  "isSpam": boolean,
  "qualityScore": number (1-10),
  "reasoning": "brief explanation of assessment"
}`;

      const output = await this.replicate.run(
        "mistralai/mixtral-8x7b-instruct-v0.1",
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
        authenticityScore: Math.max(0, Math.min(100, response.authenticityScore || 50)),
        isSpam: response.isSpam || false,
        qualityScore: Math.max(1, Math.min(10, response.qualityScore || 5)),
        reasoning: response.reasoning || 'Analysis completed'
      };

    } catch (error) {
      console.error('Social media analysis error:', error);
      // Basic fallback analysis
      const hasSpamPatterns = /🚀{2,}|moon|pump|gem|100x/gi.test(mentionText);
      const isVeryShort = mentionText.length < 20;
      
      return {
        authenticityScore: hasSpamPatterns ? 20 : (isVeryShort ? 40 : 70),
        isSpam: hasSpamPatterns || isVeryShort,
        qualityScore: Math.min(8, Math.max(2, mentionText.length / 20)),
        reasoning: 'Basic pattern analysis due to AI service unavailable'
      };
    }
  }

  isConfigured(): boolean {
    return this.replicate !== null;
  }
}

export const socialMediaAnalyzer = new SocialMediaAnalyzer();