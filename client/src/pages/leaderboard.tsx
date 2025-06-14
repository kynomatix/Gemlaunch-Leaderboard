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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section - Like Gemlaunch homepage */}
            <div className="bg-[var(--gem-form-bg)] rounded-lg p-8 border border-[var(--gem-border)]">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Innovating the BNB ecosystem through the Gem Launchpad
                  </h1>
                  <p className="text-[var(--gem-text-muted)]">
                    By virtue of its efficient and user-friendly interface, Gemlaunch enables projects to create tokens presales.
                  </p>
                </div>
                <Button className="bg-[var(--gem-primary)] hover:bg-[var(--gem-primary-hover)] text-black font-medium px-8 py-2 rounded-lg">
                  Create
                </Button>
              </div>
            </div>

            {/* Main Content Grid - Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest Pools */}
              <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)]">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Latest Pools</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'LaunchPad', token: 'neom' },
                    { name: 'LaunchPad', token: 'ACC' },
                    { name: 'LaunchPad', token: 'SON' }
                  ].map((pool, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[var(--gem-input-bg)] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[var(--gem-primary)] rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-black">{pool.token[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{pool.name}</div>
                          <div className="text-xs text-[var(--gem-text-muted)]">{pool.token}</div>
                        </div>
                      </div>
                      <button className="text-[var(--gem-primary)] text-sm hover:underline">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Sales */}
              <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)]">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Private Sales</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[var(--gem-input-bg)] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[var(--gem-primary)] rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-black">M</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">mainnet priv...</div>
                        <div className="text-xs text-[var(--gem-text-muted)]">BNB</div>
                      </div>
                    </div>
                    <button className="text-[var(--gem-primary)] text-sm hover:underline">
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* New Tokens */}
              <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)]">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">New Tokens</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'neomind', token: 'neom' },
                    { name: 'AccessToken', token: 'ACC' },
                    { name: 'SonicToken', token: 'SON' }
                  ].map((token, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[var(--gem-input-bg)] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{token.token[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{token.name}</div>
                          <div className="text-xs text-[var(--gem-text-muted)]">{token.token}</div>
                        </div>
                      </div>
                      <button className="text-[var(--gem-primary)] text-sm hover:underline">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <Tabs defaultValue="leaderboard" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-[var(--gem-card)]">
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[var(--gem-primary)] data-[state=active]:text-black">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="referrals" className="data-[state=active]:bg-[var(--gem-primary)] data-[state=active]:text-black">
                  <Users className="h-4 w-4 mr-2" />
                  Referrals
                </TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-[var(--gem-primary)] data-[state=active]:text-black">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Activities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard" className="mt-6">
                <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)]">
                  <LeaderboardTable />
                </div>
              </TabsContent>

              <TabsContent value="referrals" className="mt-6">
                <div className="rounded-lg p-6 border border-[var(--gem-border)] bg-[253935]">
                  <ReferralPanel />
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)]">
                  <ActivitiesPanel />
                </div>
              </TabsContent>
            </Tabs>

            {/* Bottom Statistics Cards - Like Gemlaunch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)] text-center">
                <h3 className="text-[var(--gem-text-muted)] text-sm font-medium mb-2">Funded Projects</h3>
                <p className="text-4xl font-bold text-[var(--gem-primary)]">5</p>
              </div>
              <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)] text-center">
                <h3 className="text-[var(--gem-text-muted)] text-sm font-medium mb-2">Raised Contribution</h3>
                <p className="text-4xl font-bold text-[var(--gem-primary)]">$39.76</p>
              </div>
              <div className="bg-[var(--gem-form-bg)] rounded-lg p-6 border border-[var(--gem-border)] text-center">
                <h3 className="text-[var(--gem-text-muted)] text-sm font-medium mb-2">Unique Participants</h3>
                <p className="text-4xl font-bold text-[var(--gem-primary)]">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
