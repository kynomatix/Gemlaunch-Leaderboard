import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { web3Service } from "@/lib/web3";
import { ACCOLADES } from "@shared/accolades";

export default function ActivitiesPanel() {
  const [showAntiSybilNotice, setShowAntiSybilNotice] = useState(false);
  
  const connectedWallet = web3Service.getAccount();

  // Dynamic icon renderer for consistent icon display
  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className || "w-5 h-5"} />;
    }
    return <LucideIcons.Award className={className || "w-5 h-5"} />;
  };
  
  const { data: recentActivities } = useQuery({
    queryKey: ["/api/activities/recent", connectedWallet],
    queryFn: () => {
      if (!connectedWallet) return Promise.resolve([]);
      return fetch(`/api/activities/recent?wallet=${connectedWallet}`).then(res => res.json());
    },
    refetchInterval: 30000,
  });

  const { data: userAccolades } = useQuery({
    queryKey: ["/api/user/accolades", connectedWallet],
    queryFn: () => {
      if (!connectedWallet) return Promise.resolve([]);
      return fetch(`/api/user/accolades?wallet=${connectedWallet}`).then(res => res.json());
    },
    refetchInterval: 30000,
  });

  // Filter out accolade activities from recent activities - only show point-earning activities
  const pointActivities = Array.isArray(recentActivities) 
    ? recentActivities.filter((activity: any) => activity.activityType !== 'accolade_earned')
    : [];

  const earnedAccolades = Array.isArray(userAccolades) ? userAccolades : [];

  const activityTypes = [
    {
      type: "token_creation",
      title: "Token Creation",
      points: 100,
      description: "Create a new token on Gemlaunch",
      icon: "Rocket"
    },
    {
      type: "fair_launch",
      title: "Fair Launch",
      points: 500,
      description: "Launch a fair launch campaign",
      icon: "Flame"
    },
    {
      type: "presale_launch",
      title: "Presale Launch",
      points: 750,
      description: "Create and run a presale",
      icon: "Crown"
    },
    {
      type: "dutch_auction",
      title: "Dutch Auction",
      points: 1000,
      description: "Host a Dutch auction",
      icon: "Gavel"
    },
    {
      type: "volume_contribution",
      title: "Volume Contribution",
      points: 1,
      suffix: "pt / $1",
      description: "Earn points based on trading volume",
      icon: "DollarSign"
    },
    {
      type: "referral",
      title: "Successful Referral",
      points: 500,
      description: "Each user who joins via your link",
      icon: "Users"
    },
    {
      type: "welcome_bonus",
      title: "Welcome Bonus",
      points: 1000,
      description: "First-time registration bonus",
      icon: "Crown"
    },
    {
      type: "accolade_earned",
      title: "Accolade Earned",
      points: 0,
      description: "Achievement unlocked",
      icon: "Crown"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getAccoladeInfo = (accoladeType: string) => {
    const accolade = ACCOLADES.find(a => a.id === accoladeType);
    return accolade || { name: "Unknown Accolade", icon: "Award" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Point Earning Activities */}
      <div className="lg:col-span-2">
        <Card className="bg-[#253935] border-[#3d5c4d]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              {renderIcon('TrendingUp', 'h-6 w-6 text-[#22cda6] mr-3')}
              Point Earning Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityTypes.map((activity) => (
              <div
                key={activity.type}
                className="bg-[#0f1713] rounded-lg p-4 border border-[#3d5c4d] hover:border-[#22cda6]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {renderIcon(activity.icon, 'h-5 w-5 mr-3 text-[#22cda6]')}
                    <div>
                      <span className="font-medium text-white">{activity.title}</span>
                      <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[#22cda6] text-[#22cda6] font-bold"
                  >
                    {activity.points} {activity.suffix || "pts"}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Anti-Sybil Notice */}
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAntiSybilNotice(!showAntiSybilNotice)}
                className="w-full bg-[#0f1713] border-[#3d5c4d] text-gray-300 hover:bg-[#253935] hover:border-[#22cda6]/30 flex items-center justify-between"
              >
                <div className="flex items-center">
                  {renderIcon('Shield', 'h-4 w-4 mr-2 text-[#22cda6]')}
                  <span>Fair Distribution Notice</span>
                </div>
                {showAntiSybilNotice ? renderIcon('ChevronUp', 'h-4 w-4') : renderIcon('ChevronDown', 'h-4 w-4')}
              </Button>
              
              {showAntiSybilNotice && (
                <div className="mt-3 p-4 bg-[#0f1713] border border-[#3d5c4d] rounded-lg">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    To ensure fair distribution, our system employs advanced anti-sybil measures. 
                    Activities from suspicious accounts may be flagged and excluded from airdrop eligibility. 
                    Play fair, earn genuine rewards.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Accolades Earned */}
        <Card className="bg-[#253935] border-[#3d5c4d]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              {renderIcon('Crown', 'h-5 w-5 text-[#22cda6] mr-2')}
              Accolades Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnedAccolades.length > 0 ? (
              <div className="space-y-3">
                {earnedAccolades.map((userAccolade: any) => {
                  const accolade = getAccoladeInfo(userAccolade.accoladeType);
                  return (
                    <div
                      key={userAccolade.id}
                      className="bg-[#0f1713] rounded-lg p-3 border border-[#22cda6]/30 flex items-center"
                    >
                      <div className="flex items-center flex-1">
                        {renderIcon(accolade.icon, 'h-5 w-5 mr-3 text-[#22cda6]')}
                        <div>
                          <span className="font-medium text-[#22cda6] text-sm">{accolade.name}</span>
                          <p className="text-xs text-gray-400">{formatDate(userAccolade.earnedAt)}</p>
                        </div>
                      </div>
                      <Badge className="bg-[#22cda6]/10 text-[#22cda6] border-[#22cda6] text-xs">
                        Level 1
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <div className="mb-2">{renderIcon('Crown', 'h-8 w-8 mx-auto opacity-50')}</div>
                <p className="text-sm">No accolades earned yet</p>
                <p className="text-xs mt-1">Complete activities to unlock achievements</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#253935] border-[#3d5c4d]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              {renderIcon('Activity', 'h-5 w-5 text-[#22cda6] mr-2')}
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pointActivities.length > 0 ? (
              <div className="space-y-3">
                {pointActivities.slice(0, 5).map((activity: any) => {
                  const activityType = activityTypes.find(t => t.type === activity.activityType);
                  return (
                    <div
                      key={activity.id}
                      className="bg-[#0f1713] rounded-lg p-3 border border-[#3d5c4d] flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {renderIcon(activityType?.icon || 'Activity', 'h-4 w-4 mr-3 text-[#22cda6]')}
                        <div>
                          <span className="font-medium text-white text-sm">
                            {activityType?.title || 'Activity'}
                          </span>
                          <p className="text-xs text-gray-400">{formatDate(activity.createdAt)}</p>
                        </div>
                      </div>
                      <span className="text-[#22cda6] font-bold text-sm">+{activity.points}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <div className="mb-2">{renderIcon('Activity', 'h-8 w-8 mx-auto opacity-50')}</div>
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Start participating to earn points</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}