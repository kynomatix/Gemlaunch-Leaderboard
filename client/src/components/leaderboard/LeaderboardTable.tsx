import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Trophy, Medal, User, Clock } from "lucide-react";

export default function LeaderboardTable() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-gem-slate border-primary/20">
        <CardContent className="p-6">
          <div className="text-center py-8">Loading leaderboard...</div>
        </CardContent>
      </Card>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const remaining = leaderboard?.slice(3) || [];

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-yellow-400 mr-3" />
            Global Leaderboard
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Live Updates</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>

      {/* Top 3 Podium */}
      <div className="p-6 bg-gradient-to-br from-gem-slate to-gem-dark">
        <div className="flex justify-center items-end space-x-4 mb-6">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <div className="bg-gem-slate rounded-lg p-3 min-h-[80px] flex flex-col justify-center">
                <div className="font-bold text-sm truncate">
                  {topThree[1].walletAddress.slice(0, 6)}...{topThree[1].walletAddress.slice(-4)}
                </div>
                <div className="text-primary text-xs font-medium">
                  {topThree[1].totalPoints.toLocaleString()} pts
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-3 mx-auto pulse-glow">
                <Crown className="h-6 w-6 text-yellow-800" />
              </div>
              <div className="gradient-border">
                <div className="bg-primary/20 border border-primary rounded-lg p-4 min-h-[100px] flex flex-col justify-center">
                  <div className="font-bold">
                    {topThree[0].walletAddress.slice(0, 6)}...{topThree[0].walletAddress.slice(-4)}
                  </div>
                  <div className="text-primary font-bold">
                    {topThree[0].totalPoints.toLocaleString()} pts
                  </div>
                  <div className="text-xs text-gray-400 mt-1">👑 Champion</div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <div className="bg-gem-slate rounded-lg p-3 min-h-[80px] flex flex-col justify-center">
                <div className="font-bold text-sm truncate">
                  {topThree[2].walletAddress.slice(0, 6)}...{topThree[2].walletAddress.slice(-4)}
                </div>
                <div className="text-primary text-xs font-medium">
                  {topThree[2].totalPoints.toLocaleString()} pts
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-primary/10">
        {remaining.map((user: any) => (
          <div 
            key={user.id} 
            className="p-4 rank-animation hover:bg-gem-dark/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gem-dark rounded-full flex items-center justify-center text-sm font-bold">
                  {user.rank}
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {user.walletAddress.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.totalPoints.toLocaleString()} total points
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">
                  {user.totalPoints.toLocaleString()} pts
                </div>
                <div className="text-xs text-gray-400">
                  Rank #{user.rank}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Current User Position Placeholder */}
        <div className="p-4 bg-primary/10 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                ?
              </div>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  Connect Wallet to See Your Rank
                </div>
                <div className="text-xs text-gray-400">
                  Track your progress on the leaderboard
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">-- pts</div>
              <div className="text-xs text-gray-400">Rank --</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
