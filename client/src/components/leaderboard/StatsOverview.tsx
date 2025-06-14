import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Rocket, TrendingUp } from "lucide-react";
import gemmyMascotPath from "@assets/Gemmy_Mascot_1749879808880.png";

export default function StatsOverview() {
  // These would normally come from API calls based on connected wallet
  const userStats = {
    totalPoints: 0,
    rank: 0,
    referralCount: 0,
    launchCount: 0,
    volumeContributed: 0
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Welcome section with Gemmy */}
      <Card className="bg-gradient-to-r from-gem-slate to-gem-dark border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={gemmyMascotPath} 
                alt="Gemmy Mascot" 
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">
                  Welcome to GemLaunch Leaderboard!
                </h2>
                <p className="text-sm text-gray-300">
                  Track your on-chain activities and climb the ranks for upcoming airdrops
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">🚀</div>
              <div className="text-xs text-gray-400">Earn Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-sm text-muted-foreground">Funded Projects</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$39.76</div>
              <div className="text-sm text-muted-foreground">Raised Contribution</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <div className="text-sm text-muted-foreground">Unique Participants</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
