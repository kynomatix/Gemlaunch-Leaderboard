import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Rocket, TrendingUp, Gem, Star, Crown, Link } from "lucide-react";
import StatsOverview from "@/components/leaderboard/StatsOverview";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import AccoladesPanel from "@/components/leaderboard/AccoladesPanel";
import ReferralPanel from "@/components/referrals/ReferralPanel";
import ActivitiesPanel from "@/components/activities/ActivitiesPanel";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  return (
    <div className="min-h-screen bg-gem-dark text-white">
      {/* Navigation Header */}
      <nav className="bg-gem-slate border-b border-primary/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Gem className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">GemLaunch</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-gray-300 hover:text-primary">
                Launchpad
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-primary">
                Create
              </Button>
              <Button variant="ghost" className="text-primary font-medium">
                Rewards
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-primary">
                Portfolio
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header with Mascot */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center pulse-glow">
                <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Gem className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 gem-gradient">
            Rewards Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Earn points for every action on GemLaunch. Create tokens, fund launches, refer friends, and climb the leaderboard for exclusive airdrops!
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content Tabs */}
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gem-slate">
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              Activities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LeaderboardTable />
              </div>
              <div className="space-y-6">
                <AccoladesPanel />
                
                {/* Point Multipliers */}
                <Card className="bg-gem-slate border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                      Active Multipliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Base Rate</span>
                      <span className="text-primary font-medium">1.0x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accolades Bonus</span>
                      <span className="text-green-400 font-medium">+0.15x</span>
                    </div>
                    <div className="h-px bg-primary/20 my-2" />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Multiplier</span>
                      <span className="text-primary">1.15x</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="mt-8">
            <ReferralPanel />
          </TabsContent>

          <TabsContent value="activities" className="mt-8">
            <ActivitiesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
