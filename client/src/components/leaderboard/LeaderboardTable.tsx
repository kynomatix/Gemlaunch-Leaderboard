import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Crown, Trophy, Medal, User, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { web3Service } from "@/lib/web3";
import { ACCOLADES } from "@shared/accolades";
import { useState } from "react";

export default function LeaderboardTable() {
  const [expandedAccolades, setExpandedAccolades] = useState<{[key: string]: boolean}>({});
  
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const connectedWallet = web3Service.getAccount();
  
  // Find current user in leaderboard data
  const currentUser = connectedWallet 
    ? leaderboard?.find((user: any) => user.walletAddress.toLowerCase() === connectedWallet.toLowerCase())
    : null;

  if (isLoading) {
    return (
      <Card className="bg-[#253935] border-[#22cda6]/20">
        <CardContent className="p-6">
          <div className="text-center py-8 text-white">Loading leaderboard...</div>
        </CardContent>
      </Card>
    );
  }

  const users = Array.isArray(leaderboard) ? leaderboard : [];
  const topThree = users.slice(0, 3);
  const remaining = users.slice(3);

  const getAccoladeData = (type: string) => {
    const accolade = ACCOLADES.find(a => a.id === type);
    return accolade ? {
      icon: accolade.icon,
      name: accolade.name,
      description: accolade.description,
      rarity: accolade.rarity,
      pointsBonus: accolade.pointsBonus
    } : {
      icon: '🎖️',
      name: 'Unknown Accolade',
      description: 'Achievement not found',
      rarity: 'common' as const,
      pointsBonus: 0
    };
  };

  const toggleAccolades = (userId: string) => {
    setExpandedAccolades(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const renderAccolades = (accolades: any[], userId: string) => {
    if (!accolades || accolades.length === 0) {
      return <span className="text-xs text-gray-400">No accolades yet</span>;
    }

    const isExpanded = expandedAccolades[userId];
    const displayedAccolades = isExpanded ? accolades : accolades.slice(0, 2);
    const hasMore = accolades.length > 2;

    return (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {displayedAccolades.map((accolade: any, index: number) => {
            const accoladeData = getAccoladeData(accolade.accoladeType);
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-1 ${
                        accoladeData.rarity === 'legendary' ? 'border-orange-400 text-orange-300 bg-orange-500/10' :
                        accoladeData.rarity === 'epic' ? 'border-purple-400 text-purple-300 bg-purple-500/10' :
                        accoladeData.rarity === 'rare' ? 'border-blue-400 text-blue-300 bg-blue-500/10' :
                        accoladeData.rarity === 'uncommon' ? 'border-green-400 text-green-300 bg-green-500/10' :
                        'border-gray-400 text-gray-300 bg-gray-500/10'
                      }`}
                    >
                      <span className="mr-1">{accoladeData.icon}</span>
                      {accoladeData.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="text-sm">
                      <div className="font-medium">{accoladeData.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{accoladeData.description}</div>
                      <div className="text-xs text-[#22cda6] mt-1">+{accoladeData.pointsBonus} points</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAccolades(userId)}
            className="h-6 px-2 text-xs text-[#22cda6] hover:text-[#22cda6] hover:bg-[#22cda6]/10"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                +{accolades.length - 2} more
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-[#253935] border-[#22cda6]/20 overflow-hidden">
      <CardHeader className="border-b border-[#22cda6]/20">
        <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-[#22cda6] mr-3" />
            Global Leaderboard
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Live Updates</span>
            <div className="w-2 h-2 bg-[#22cda6] rounded-full animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      {/* Top 3 Podium */}
      <div className="p-6 bg-gradient-to-br from-[#253935] to-[#1a2b21]">
        <div className="flex justify-center items-end space-x-4 mb-6">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <div className="bg-[#253935] rounded-lg p-3 min-h-[80px] flex flex-col justify-center">
                <div className="font-bold text-sm truncate text-white">
                  {topThree[1].walletAddress.slice(0, 6)}...{topThree[1].walletAddress.slice(-4)}
                </div>
                <div className="text-[#22cda6] text-xs font-medium">
                  {topThree[1].totalPoints.toLocaleString()} pts
                </div>
                <div className="text-xs text-gray-400 mt-1">Rank #{topThree[1].rank}</div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Crown className="h-6 w-6 text-yellow-800" />
              </div>
              <div className="bg-[#22cda6]/20 border border-[#22cda6] rounded-lg p-4 min-h-[100px] flex flex-col justify-center">
                <div className="font-bold text-white">
                  {topThree[0].walletAddress.slice(0, 6)}...{topThree[0].walletAddress.slice(-4)}
                </div>
                <div className="text-[#22cda6] font-bold">
                  {topThree[0].totalPoints.toLocaleString()} pts
                </div>
                <div className="text-xs text-gray-400 mt-1">👑 Champion</div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <div className="bg-[#253935] rounded-lg p-3 min-h-[80px] flex flex-col justify-center">
                <div className="font-bold text-sm truncate text-white">
                  {topThree[2].walletAddress.slice(0, 6)}...{topThree[2].walletAddress.slice(-4)}
                </div>
                <div className="text-[#22cda6] text-xs font-medium">
                  {topThree[2].totalPoints.toLocaleString()} pts
                </div>
                <div className="text-xs text-gray-400 mt-1">Rank #{topThree[2].rank}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Complete Rankings List - Top 10+ */}
      <div className="bg-[#253935]">
        <div className="p-4 border-b border-[#22cda6]/20">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Trophy className="h-5 w-5 text-[#22cda6] mr-2" />
            Complete Rankings
          </h3>
        </div>
        
        <div className="divide-y divide-[#22cda6]/10">
          {/* Show all users in leaderboard */}
          {users.map((user: any, index: number) => (
            <div 
              key={user.id} 
              className="p-4 hover:bg-[#1a2b21] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    user.rank <= 3 
                      ? 'bg-gradient-to-br from-[#22cda6] to-[#1a9b99] text-black' 
                      : 'bg-[#1a2b21] text-[#22cda6] border border-[#22cda6]/30'
                  }`}>
                    {user.rank}
                  </div>
                  
                  {/* User Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[#1a2b21] text-[#22cda6] text-sm font-medium">
                      {user.walletAddress.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </span>
                      
                      {/* Accolades Inline - Icons Only with Tooltips */}
                      <div className="flex items-center space-x-1">
                        {user.accolades && user.accolades.length > 0 && user.accolades.map((accolade: any, idx: number) => (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-lg hover:scale-110 transition-transform cursor-help">
                                  {getAccoladeIcon(accolade.accoladeType)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#253935] border-[#22cda6] text-white max-w-xs">
                                <p className="font-medium">{getAccoladeName(accolade.accoladeType)}</p>
                                {accolade.level > 1 && (
                                  <p className="text-sm text-[#22cda6]">Level {accolade.level}</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {user.totalPoints.toLocaleString()} total points
                      {user.accolades && user.accolades.length > 0 && (
                        <span className="ml-2">• {user.accolades.length} achievement{user.accolades.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Points & Rank */}
                <div className="text-right">
                  <div className="font-bold text-[#22cda6] text-lg">
                    {user.totalPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    Rank #{user.rank}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Current User Position */}
          <div className="p-4 bg-[#22cda6]/10 border border-[#22cda6]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black bg-[#22cda6]">
                  {currentUser ? currentUser.rank : '?'}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#22cda6] text-black">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white flex items-center">
                    {currentUser 
                      ? `${currentUser.walletAddress.slice(0, 6)}...${currentUser.walletAddress.slice(-4)}`
                      : 'Connect Wallet to See Your Rank'
                    }
                    {currentUser?.accolades?.length > 0 && (
                      <div className="ml-2 flex space-x-1">
                        {currentUser.accolades.map((accolade: any, index: number) => (
                          <span key={index} className="text-sm">
                            {getAccoladeIcon(accolade.accoladeType)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {currentUser 
                      ? `${currentUser.accolades?.length || 0} accolades earned`
                      : 'Track your progress and earn accolades'
                    }
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#22cda6] text-lg">
                  {currentUser ? `${currentUser.totalPoints.toLocaleString()} pts` : '-- pts'}
                </div>
                <div className="text-xs text-gray-400">
                  Rank {currentUser ? `#${currentUser.rank}` : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
