import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Twitter, Award, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SocialAnalysis {
  authenticityScore: number;
  isSpam: boolean;
  qualityScore: number;
  reasoning: string;
}

interface AnalysisResult {
  analysis: SocialAnalysis;
  pointsEarned: number;
  awarded: boolean;
}

export default function SocialRewards() {
  const [mentionText, setMentionText] = useState("");
  const [username, setUsername] = useState("");
  const queryClient = useQueryClient();

  // Get connected wallet address
  const walletAddress = "0x2d9b878DD5f779aF723a430F8d56f21dAc847592"; // Simulated for now

  const analyzeMutation = useMutation({
    mutationFn: async (data: { mentionText: string; username: string; walletAddress: string }) => {
      return await apiRequest("/api/social/analyze-mention", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    }
  });

  const handleAnalyze = () => {
    if (!mentionText.trim() || !username.trim()) return;
    
    analyzeMutation.mutate({
      mentionText: mentionText.trim(),
      username: username.trim(),
      walletAddress
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#22cda6] to-[#1ea688] bg-clip-text text-transparent">
          Social Media Rewards
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Earn points for authentic social media engagement about Gemlaunch. 
          High-quality mentions are rewarded based on authenticity and value to the community.
        </p>
      </div>

      {/* Analysis Tool */}
      <Card className="bg-[#253935] border-[#22cda6]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#22cda6]">
            <MessageCircle className="h-5 w-5" />
            Analyze Social Media Mention
          </CardTitle>
          <CardDescription className="text-gray-400">
            Test the authenticity and quality scoring system for social media mentions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                placeholder="@crypto_user123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0f1713] border-[#22cda6]/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Connected Wallet</Label>
              <Input
                value={`${walletAddress.substring(0, 8)}...${walletAddress.substring(-6)}`}
                disabled
                className="bg-[#0f1713] border-[#22cda6]/30 text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mention" className="text-gray-300">Social Media Mention</Label>
            <Textarea
              id="mention"
              placeholder="Just tried @Gemlaunch for my token launch, the UI is actually pretty smooth compared to other platforms"
              value={mentionText}
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
              <Award className="h-5 w-5" />
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
                  <span className="text-gray-400 text-sm ml-1">/100</span>
                </div>
                <div className="text-sm text-gray-400">Authenticity Score</div>
              </div>

              <div className="text-center p-4 bg-[#0f1713] rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span className={getQualityColor(analyzeMutation.data.analysis.qualityScore)}>
                    {analyzeMutation.data.analysis.qualityScore}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">/10</span>
                </div>
                <div className="text-sm text-gray-400">Quality Score</div>
              </div>

              <div className="text-center p-4 bg-[#0f1713] rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span className={analyzeMutation.data.pointsEarned > 0 ? "text-[#22cda6]" : "text-gray-400"}>
                    {analyzeMutation.data.pointsEarned}
                  </span>
                </div>
                <div className="text-sm text-gray-400">Points Earned</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={analyzeMutation.data.analysis.isSpam ? "destructive" : "secondary"}>
                {analyzeMutation.data.analysis.isSpam ? "Spam Detected" : "Authentic Content"}
              </Badge>
              <Badge variant={analyzeMutation.data.awarded ? "default" : "secondary"}>
                {analyzeMutation.data.awarded ? "Points Awarded" : "No Points"}
              </Badge>
            </div>

            <div className="p-4 bg-[#0f1713] rounded-lg">
              <div className="text-sm font-medium text-gray-300 mb-2">AI Analysis Reasoning:</div>
              <div className="text-sm text-gray-400">
                {analyzeMutation.data.analysis.reasoning}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scoring Guidelines */}
      <Card className="bg-[#253935] border-[#22cda6]/20">
        <CardHeader>
          <CardTitle className="text-[#22cda6]">Scoring Guidelines</CardTitle>
          <CardDescription className="text-gray-400">
            How the Mixtral AI system evaluates social media mentions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Authenticity Factors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Natural language and personal experience</li>
                <li>• Specific details about platform usage</li>
                <li>• Balanced perspective (pros/cons)</li>
                <li>• Genuine user tone vs promotional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Quality Factors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Thoughtful content and insights</li>
                <li>• Helpful information for others</li>
                <li>• Proper context and relevance</li>
                <li>• Educational or informative value</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#22cda6]/20">
            <h4 className="font-medium text-gray-300 mb-2">Point Requirements</h4>
            <p className="text-sm text-gray-400">
              Minimum 60 authenticity score and 5 quality score required for points. 
              Base 10 points × quality multiplier × authenticity multiplier.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}