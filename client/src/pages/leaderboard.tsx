import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  Rocket, 
  TrendingUp, 
  Star, 
  Crown, 
  Link,
  Home,
  Plus,
  Send,
  Shield,
  Gift,
  FileText,
  Settings,
  ChevronDown,
  Zap
} from "lucide-react";
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

  const sidebarItems = [
    { icon: Home, label: "Home", active: false },
    { icon: Plus, label: "Create Token", active: false },
    { icon: Rocket, label: "Launchpad", active: false, hasDropdown: true },
    { icon: Send, label: "Exchange", active: false },
    { icon: Shield, label: "Private Sale", active: false, hasDropdown: true },
    { icon: Shield, label: "Lock", active: false, hasDropdown: true },
    { icon: Gift, label: "Airdrop", active: false, hasDropdown: true },
    { icon: Send, label: "Multi-Sender", active: false },
    { icon: FileText, label: "Socials", active: false, hasDropdown: true },
    { icon: FileText, label: "Docs", active: false },
    { icon: Trophy, label: "Leaderboard", active: true },
    { icon: Zap, label: "Anti-Bot", active: false },
    { icon: Settings, label: "Admin", active: false }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">Gemlaunch</span>
            <ChevronDown className="h-4 w-4 text-sidebar-foreground ml-auto" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          {sidebarItems.map((item, index) => (
            <div key={index} className="px-4 py-1">
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}>
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown className="h-3 w-3 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 rounded-full">
                ? Not Connected
              </Badge>
              {/* Trending Bar */}
              <div className="hidden md:flex items-center space-x-4 bg-card rounded-lg px-4 py-2 border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔥</span>
                  </div>
                  <span className="text-sm font-medium">Trending:</span>
                </div>
                <div className="flex items-center space-x-3">
                  {['neom', 'ACC', 'BSC', 'BSC', 'BSC', 'BSC', 'KRO', 'Karen', 'NTT'].map((token, i) => (
                    <span key={i} className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
              Connecting...
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Rewards Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Earn points for every action on GemLaunch. Create tokens, fund launches, refer friends, and climb the leaderboard for exclusive airdrops!
            </p>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Content Tabs */}
          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-card">
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
                  <Card className="bg-card border-border">
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
                      <div className="h-px bg-border my-2" />
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
    </div>
  );
}
