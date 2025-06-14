import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import gemmyMascotPath from "@assets/Gemmy_Mascot_1749879808880.png";
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
        {/* Top Bar - Network Selection & Wallet */}
        <div className="bg-[#253935] border-b border-[#3d5c4d] px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-[#26d0ce] text-black px-4 py-2 rounded-full flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">BSC Mainnet</span>
              </div>
            </div>
            <div className="bg-[#0f1713] border border-[#3d5c4d] px-4 py-2 rounded-full">
              <span className="text-[#26d0ce] text-sm font-mono">0x23d9b...7592</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome section with Gemmy */}
            <div className="bg-gradient-to-r from-[#253935] to-[#1a2b21] rounded-lg p-6 border border-[#26d0ce]/20 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 64 64" className="w-12 h-12">
                      <circle cx="32" cy="28" r="14" fill="#4a90e2" stroke="#2563eb" strokeWidth="2"/>
                      <circle cx="27" cy="25" r="3" fill="#26d0ce"/>
                      <circle cx="37" cy="25" r="3" fill="#26d0ce"/>
                      <path d="M 26 32 Q 32 36 38 32" stroke="#26d0ce" strokeWidth="2" fill="none"/>
                      <line x1="32" y1="14" x2="32" y2="8" stroke="#2563eb" strokeWidth="2"/>
                      <circle cx="32" cy="8" r="2" fill="#26d0ce"/>
                      <rect x="24" y="40" width="16" height="20" rx="4" fill="#4a90e2" stroke="#2563eb" strokeWidth="2"/>
                      <polygon points="32,46 35,49 32,52 29,49" fill="#26d0ce"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#26d0ce] mb-1">
                      Welcome to GemLaunch Leaderboard!
                    </h2>
                    <p className="text-sm text-[#9ca3af]">
                      Track your on-chain activities and climb the ranks for upcoming airdrops
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#26d0ce]">🚀</div>
                  <div className="text-xs text-[#9ca3af]">Earn Points</div>
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <Tabs defaultValue="leaderboard" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#253935]">
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#26d0ce] data-[state=active]:text-black">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="referrals" className="data-[state=active]:bg-[#26d0ce] data-[state=active]:text-black">
                  <Users className="h-4 w-4 mr-2" />
                  Referrals
                </TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-[#26d0ce] data-[state=active]:text-black">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Activities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard" className="mt-6">
                <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d]">
                  <LeaderboardTable />
                </div>
              </TabsContent>

              <TabsContent value="referrals" className="mt-6">
                <div className="rounded-lg p-6 border border-[#3d5c4d] bg-[#253935]">
                  <ReferralPanel />
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d]">
                  <ActivitiesPanel />
                </div>
              </TabsContent>
            </Tabs>

            {/* Bottom Statistics Cards - Like Gemlaunch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d] text-center">
                <h3 className="text-[#9ca3af] text-sm font-medium mb-2">Funded Projects</h3>
                <p className="text-4xl font-bold text-[#26d0ce]">5</p>
              </div>
              <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d] text-center">
                <h3 className="text-[#9ca3af] text-sm font-medium mb-2">Raised Contribution</h3>
                <p className="text-4xl font-bold text-[#26d0ce]">$39.76</p>
              </div>
              <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d] text-center">
                <h3 className="text-[#9ca3af] text-sm font-medium mb-2">Unique Participants</h3>
                <p className="text-4xl font-bold text-[#26d0ce]">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
