import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Rocket, TrendingUp } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gem-slate border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm">Your Points</h3>
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">
            {userStats.totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {userStats.rank > 0 ? `Rank #${userStats.rank}` : "Connect wallet"}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gem-slate border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm">Referrals</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">
            {userStats.referralCount}
          </div>
          <div className="text-xs text-green-400 mt-1">
            Connect wallet to track
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gem-slate border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm">Launches</h3>
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">
            {userStats.launchCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            0 successful
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gem-slate border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm">Volume</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">
            ${userStats.volumeContributed.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Connect wallet to track
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
