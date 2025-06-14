import { useState, useEffect } from "react";
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
  Zap,
  Settings,
  ChevronDown,
  Wallet
} from "lucide-react";
import { web3Service } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import StatsOverview from "@/components/leaderboard/StatsOverview";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import AccoladesPanel from "@/components/leaderboard/AccoladesPanel";
import ReferralPanel from "@/components/referrals/ReferralPanel";
import ActivitiesPanel from "@/components/activities/ActivitiesPanel";
import { useWebSocket } from "@/hooks/useWebSocket";

import Gemmy_Mascot from "@assets/Gemmy_Mascot.png";

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  // Auto-connect simulated wallet on component mount
  useEffect(() => {
    const connectSimulatedWallet = async () => {
      const account = await web3Service.connectWallet();
      setConnectedWallet(account);
      
      if (account) {
        // Register/login user in backend
        try {
          const response = await fetch('/api/wallet/connect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress: account }),
          });
          
          const data = await response.json();
          console.log("Auto-connected wallet:", data.message);
        } catch (error) {
          console.error("Failed to register wallet:", error);
        }
      }
    };
    
    connectSimulatedWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const account = await web3Service.connectWallet();
      setConnectedWallet(account);
      
      if (account) {
        // Register/login user in backend
        const response = await fetch('/api/wallet/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: account }),
        });
        
        const data = await response.json();
        
        toast({
          title: "Wallet Connected",
          description: data.message || `Connected to ${account?.slice(0, 6)}...${account?.slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed", 
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = () => {
    web3Service.disconnect();
    setConnectedWallet(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

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
            
            {connectedWallet ? (
              <div className="flex items-center space-x-2">
                <div className="bg-[#0f1713] border border-[#3d5c4d] px-4 py-2 rounded-full">
                  <span className="text-[#22cda6] text-sm font-mono">
                    {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
                  </span>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="border-[#3d5c4d] text-gray-400 hover:text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-[#22cda6] hover:bg-[#1fb898] text-black font-bold px-6 py-2"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome section with Gemmy */}
            <div className="bg-gradient-to-r from-[#253935] to-[#1a2b21] rounded-lg p-8 border border-[#22cda6]/20 mt-[20px] mb-[20px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={Gemmy_Mascot} 
                      alt="Gemmy Mascot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#22cda6] mb-2">
                      Welcome to GemLaunch Rewards Program!
                    </h2>
                    <p className="text-base text-[#9ca3af] mb-3">
                      Earn points for every on-chain activity: token creation, fair launches, presales, contributing to project funding, and referrals. 
                      Build your ranking for exclusive airdrops and rewards.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-[#22cda6]">
                      <span className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        Compete for Rankings
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Unlock Accolades
                      </span>
                      <span className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        Earn Airdrop Priority
                      </span>
                    </div>
                  </div>
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
                <p className="text-4xl font-bold text-[#22cda6]">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
