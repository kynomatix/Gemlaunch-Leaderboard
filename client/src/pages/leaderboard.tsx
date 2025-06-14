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
              <div className="bg-[#22cda6] text-black px-4 py-2 rounded-full flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">BSC Mainnet</span>
              </div>
            </div>
            <div className="bg-[#0f1713] border border-[#3d5c4d] px-4 py-2 rounded-full">
              <span className="text-[#22cda6] text-sm font-mono">0x23d9b...7592</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome section with Gemmy */}
            <div className="bg-gradient-to-r from-[#253935] to-[#1a2b21] rounded-lg p-6 border border-[#22cda6]/20 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAzIDc5Ljk2OTBhODdmYywgMjAyNS8wMy8wNi0yMDo1MDoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MWU2YjIzNi1lYzAxLTI4NGUtYWFjOS1lZjRjNmU0YzhhYjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzZDQzlFQjM0OEUyMTFGMEEwMEI4RjRGMEQ3QzFFNkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzZDQzlFQjI0OEUyMTFGMEEwMEI4RjRGMEQ3QzFFNkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InV1aWQ6YzRmMWMzMzktNTBhZS00OWNjLThmZjUtZjhlNTNkNTVjMDM2IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTZiYzNmYmItYTVjMC1mNTRlLWJjYTEtNjVm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" 
                      alt="Gemmy Mascot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#22cda6] mb-1">
                      Welcome to GemLaunch Leaderboard!
                    </h2>
                    <p className="text-sm text-[#9ca3af]">
                      Track your on-chain activities and climb the ranks for upcoming airdrops
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#22cda6]">🚀</div>
                  <div className="text-xs text-[#9ca3af]">Earn Points</div>
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <Tabs defaultValue="leaderboard" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#253935]">
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#22cda6] data-[state=active]:text-black">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="referrals" className="data-[state=active]:bg-[#22cda6] data-[state=active]:text-black">
                  <Users className="h-4 w-4 mr-2" />
                  Referrals
                </TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-[#22cda6] data-[state=active]:text-black">
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
                <p className="text-4xl font-bold text-[#22cda6]">5</p>
              </div>
              <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d] text-center">
                <h3 className="text-[#9ca3af] text-sm font-medium mb-2">Raised Contribution</h3>
                <p className="text-4xl font-bold text-[#22cda6]">$39.76</p>
              </div>
              <div className="bg-[#253935] rounded-lg p-6 border border-[#3d5c4d] text-center">
                <h3 className="text-[#9ca3af] text-sm font-medium mb-2">Unique Participants</h3>
                <p className="text-4xl font-bold text-[22cda6]">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
