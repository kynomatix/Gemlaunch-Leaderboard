import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Flame, 
  Crown, 
  Gavel, 
  DollarSign, 
  Users, 
  TrendingUp,
  Activity,
  Shield,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ActivitiesPanel() {
  const [showAntiSybilNotice, setShowAntiSybilNotice] = useState(false);
  
  const { data: recentActivities } = useQuery({
    queryKey: ["/api/activities/recent"],
    refetchInterval: 30000,
  });

  const activityTypes = [
    {
      type: "token_creation",
      title: "Token Creation",
      points: 100,
      description: "Create a new token on GemLaunch",
      icon: Rocket,
      color: "primary"
    },
    {
      type: "fair_launch",
      title: "Fair Launch",
      points: 500,
      description: "Launch a fair launch campaign",
      icon: Flame,
      color: "green"
    },
    {
      type: "presale",
      title: "Presale Launch",
      points: 750,
      description: "Create and run a presale",
      icon: Crown,
      color: "yellow"
    },
    {
      type: "dutch_auction",
      title: "Dutch Auction",
      points: 1000,
      description: "Host a Dutch auction",
      icon: Gavel,
      color: "purple"
    },
    {
      type: "volume_contribution",
      title: "Volume Contribution",
      points: 1,
      description: "Earn points based on trading volume",
      icon: DollarSign,
      color: "primary",
      suffix: "pt / $1"
    },
    {
      type: "referral",
      title: "Successful Referral",
      points: 500,
      description: "Each user who joins via your link",
      icon: Users,
      color: "blue"
    }
  ];

  const mockRecentActivities = [
    {
      id: 1,
      activityType: "token_creation",
      points: 100,
      createdAt: "2024-01-15T10:30:00Z",
      user: { username: "You" }
    },
    {
      id: 2,
      activityType: "volume_contribution",
      points: 150,
      createdAt: "2024-01-15T09:15:00Z",
      user: { username: "You" }
    },
    {
      id: 3,
      activityType: "referral",
      points: 500,
      createdAt: "2024-01-14T16:45:00Z",
      user: { username: "You" }
    }
  ];

  const getActivityIcon = (type: string) => {
    const activity = activityTypes.find(a => a.type === type);
    return activity?.icon || Activity;
  };

  const getActivityColor = (type: string) => {
    const activity = activityTypes.find(a => a.type === type);
    const colorMap = {
      primary: "text-primary",
      green: "text-green-400",
      yellow: "text-yellow-400",
      purple: "text-purple-400",
      blue: "text-blue-400"
    };
    return colorMap[activity?.color as keyof typeof colorMap] || "text-primary";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Point Sources */}
      <div className="lg:col-span-2">
        <Card className="bg-gem-slate border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 text-primary mr-3" />
              Point Earning Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityTypes.map((activity) => {
              const IconComponent = activity.icon;
              
              return (
                <div
                  key={activity.type}
                  className={`bg-gem-dark rounded-lg p-4 border transition-all hover:border-opacity-60 ${
                    activity.color === "primary" ? "border-primary/20" :
                    activity.color === "green" ? "border-green-400/20" :
                    activity.color === "yellow" ? "border-yellow-400/20" :
                    activity.color === "purple" ? "border-purple-400/20" :
                    activity.color === "blue" ? "border-blue-400/20" :
                    "border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <IconComponent className={`h-5 w-5 mr-3 ${getActivityColor(activity.type)}`} />
                      <span className="font-medium">{activity.title}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-bold ${
                        activity.color === "primary" ? "border-primary text-primary" :
                        activity.color === "green" ? "border-green-400 text-green-400" :
                        activity.color === "yellow" ? "border-yellow-400 text-yellow-400" :
                        activity.color === "purple" ? "border-purple-400 text-purple-400" :
                        activity.color === "blue" ? "border-blue-400 text-blue-400" :
                        "border-primary text-primary"
                      }`}
                    >
                      {activity.points} {activity.suffix || "pts"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">{activity.description}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Recent Activity */}
        <Card className="bg-gem-slate border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecentActivities.length > 0 ? (
              <div className="space-y-3">
                {mockRecentActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.activityType);
                  const formattedTime = new Date(activity.createdAt).toLocaleDateString();
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 py-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        getActivityColor(activity.activityType).replace('text-', 'bg-')
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm capitalize">
                          {activity.activityType.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400">{formattedTime}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-sm font-medium ${getActivityColor(activity.activityType)} border-current`}
                      >
                        +{activity.points}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No activities yet</p>
                <p className="text-xs mt-1">Start using GemLaunch to earn points!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anti-Sybil Notice */}
        <Card className="bg-[#253935]/80 border border-[#22cda6]/30">
          <CardHeader>
            <Button
              variant="ghost"
              onClick={() => setShowAntiSybilNotice(!showAntiSybilNotice)}
              className="w-full justify-between p-0 h-auto hover:bg-transparent"
            >
              <CardTitle className="text-sm font-bold flex items-center text-[#22cda6]">
                <Shield className="h-4 w-4 mr-2" />
                Fair Distribution Notice
              </CardTitle>
              {showAntiSybilNotice ? (
                <ChevronUp className="h-4 w-4 text-[#22cda6]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#22cda6]" />
              )}
            </Button>
          </CardHeader>
          {showAntiSybilNotice && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-[#9ca3af] text-xs leading-relaxed">
                  To ensure equitable distribution and maintain program integrity, comprehensive anti-sybil analysis will be conducted 
                  at the conclusion of the airdrop qualification period. Participants engaging in coordinated multi-account activities, 
                  artificial transaction patterns, or other forms of ecosystem manipulation will be identified and excluded from final 
                  reward distributions.
                </p>
                <p className="text-[#22cda6] text-xs font-medium">
                  Authentic participation and genuine community engagement are the foundation of GemLaunch's reward ecosystem.
                </p>
              </div>
            </CardContent>
          )}
        </Card>


      </div>
    </div>
  );
}
