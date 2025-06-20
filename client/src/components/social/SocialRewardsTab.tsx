import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Check, X, MessageCircle, Twitter, Send, Star, Shield, BarChart3, AlertCircle, Zap } from "lucide-react";
import { web3Service } from "@/lib/web3";

export default function SocialRewardsTab() {
  const [mentionText, setMentionText] = useState('');
  const [username, setUsername] = useState('');
  const connectedWallet = web3Service.getAccount();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { mentionText: string; username: string; walletAddress: string }) =>
      apiRequest('/api/social/analyze-mention', 'POST', data),
  });

  const handleAnalyze = () => {
    if (!connectedWallet) return;
    
    analyzeMutation.mutate({
      mentionText,
      username,
      walletAddress: connectedWallet
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Social Media Rewards</h1>
        <p className="text-gray-400">
          Earn points for authentic Gemlaunch mentions across social platforms
        </p>
      </div>

      {/* Mention Analysis */}
      <Card className="bg-[#253935] border-[#22cda6]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#22cda6]">
            <MessageCircle className="h-5 w-5" />
            Analyze Your Mention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Your Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@yourhandle"
              className="bg-[#0f1713] border-[#22cda6]/30 text-white"
            />
          </div>

          <div>
            <Label htmlFor="mention">Social Media Mention</Label>
            <Textarea
              id="mention"
              value={mentionText}
              placeholder="Paste your tweet, Discord message, or other social media mention about Gemlaunch here..."
              onChange={(e) => setMentionText(e.target.value)}
              className="bg-[#0f1713] border-[#22cda6]/30 text-white min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!mentionText.trim() || !username.trim() || analyzeMutation.isPending}
            className="w-full bg-[#22cda6] hover:bg-[#1ea688] text-black font-medium"
          >
            {analyzeMutation.isPending ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Analyzing with Mixtral...
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Analyze Mention
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analyzeMutation.data && (
        <Card className="bg-[#253935] border-[#22cda6]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#22cda6]">
              <BarChart3 className="h-5 w-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#0f1713] rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span className={getScoreColor(analyzeMutation.data.analysis.authenticityScore)}>
                    {analyzeMutation.data.analysis.authenticityScore}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Authenticity Score</p>
              </div>

              <div className="text-center p-4 bg-[#0f1713] rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span className={getScoreColor(analyzeMutation.data.analysis.qualityScore * 10)}>
                    {analyzeMutation.data.analysis.qualityScore}/10
                  </span>
                </div>
                <p className="text-sm text-gray-400">Quality Score</p>
              </div>

              <div className="text-center p-4 bg-[#0f1713] rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span className="text-[#22cda6]">
                    {analyzeMutation.data.pointsEarned}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Points Earned</p>
              </div>
            </div>

            <div className="p-4 bg-[#0f1713] rounded-lg">
              <h4 className="font-semibold mb-2 text-[#22cda6]">AI Analysis</h4>
              <p className="text-sm text-gray-300">{analyzeMutation.data.analysis.reasoning}</p>
            </div>

            {analyzeMutation.data.error ? (
              <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Profile Setup Required</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  {analyzeMutation.data.error}
                </p>
                <Button 
                  onClick={() => window.location.href = '/profile'}
                  className="bg-[#22cda6] hover:bg-[#22cda6]/80 text-black font-gilroy-bold text-sm h-8"
                >
                  Update Profile
                </Button>
              </div>
            ) : analyzeMutation.data.awarded ? (
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Check className="w-4 h-4" />
                  <span className="font-semibold">Points Awarded!</span>
                </div>
                <p className="text-sm text-gray-300">
                  You earned {analyzeMutation.data.pointsEarned} points for this authentic mention.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <X className="w-4 h-4" />
                  <span className="font-semibold">No Points Awarded</span>
                </div>
                <p className="text-sm text-gray-300">
                  Content didn't meet minimum requirements for authenticity and quality.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scoring Guidelines */}
      <Card className="bg-[#253935] border-[#22cda6]/20">
        <CardHeader>
          <CardTitle className="text-[#22cda6]">Scoring Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Authenticity Factors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Natural language and personal experience</li>
                <li>• Specific details about platform usage</li>
                <li>• Balanced perspective (pros/cons)</li>
                <li>• Original thoughts vs promotional copy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Quality Factors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Thoughtful content that adds value</li>
                <li>• Technical insights or use cases</li>
                <li>• Community engagement potential</li>
                <li>• Educational or informative content</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#0f1713] rounded-lg p-4">
            <h4 className="font-medium text-[#22cda6] mb-2">Point Calculation</h4>
            <p className="text-sm text-gray-400">
              Base Points (10) × Quality Score (1-10) × Authenticity Score (0-100%) = Final Points
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Minimum thresholds: 60+ authenticity and 5+ quality to earn points
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}