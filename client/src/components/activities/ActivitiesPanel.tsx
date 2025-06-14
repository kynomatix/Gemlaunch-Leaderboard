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
  ChevronUp,
  Trophy
} from "lucide-react";
import { web3Service } from "@/lib/web3";
import { ACCOLADES } from "@shared/accolades";

export default function ActivitiesPanel() {
  const [showAntiSybilNotice, setShowAntiSybilNotice] = useState(false);
  
  const connectedWallet = web3Service.getAccount();
  
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
      type: "presale_launch",
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
      suffix: "pt / $1",
      description: "Earn points based on trading volume",
      icon: DollarSign,
      color: "blue"
    },
    {
      type: "referral",
      title: "Successful Referral",
      points: 500,
      description: "Each user who joins via your link",
      icon: Users,
      color: "green"
    },
    {
      type: "welcome_bonus",
      title: "Welcome Bonus",
      points: 1000,
      description: "First-time registration bonus",
      icon: Crown,
      color: "primary"
    },
    {
      type: "accolade_earned",
      title: "Accolade Earned",
      points: 0,
      description: "Achievement unlocked",
      icon: Crown,
      color: "yellow"
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

  const getAccoladeInfo = (accoladeType: string) => {
    const accolade = ACCOLADES.find(a => a.id === accoladeType);
    return accolade || { name: "Unknown Accolade", icon: "Award" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              );
            })}

            {/* Anti-Sybil Notice */}
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAntiSybilNotice(!showAntiSybilNotice)}
                className="w-full bg-gem-dark border-muted text-muted-foreground hover:bg-gem-slate hover:border-primary/30 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  <span>Fair Distribution Notice</span>
                </div>
                {showAntiSybilNotice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {showAntiSybilNotice && (
                <div className="mt-3 p-4 bg-gem-dark border border-muted rounded-lg">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To ensure fair distribution, our system employs advanced anti-sybil measures. 
                    Activities from suspicious accounts may be flagged and excluded from airdrop eligibility. 
                    Play fair, earn genuine rewards.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accolades Earned Section */}
        <Card className="bg-gem-slate border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Crown className="h-6 w-6 text-primary mr-3" />
              Accolades Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnedAccolades.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earnedAccolades.map((userAccolade: any) => {
                  const accolade = getAccoladeInfo(userAccolade.accoladeType);
                  return (
                    <div
                      key={userAccolade.id}
                      className="bg-gem-dark rounded-lg p-4 border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 mr-3 text-primary" />
                          <span className="font-medium text-primary">{accolade.name}</span>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary">
                          Level 1
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Earned on {formatDate(userAccolade.earnedAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No accolades earned yet</h3>
                <p>Complete activities to unlock achievements and earn special recognition!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <div>
        <Card className="bg-gem-slate border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Activity className="h-6 w-6 text-primary mr-3" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pointActivities.length > 0 ? (
              pointActivities.slice(0, 10).map((activity: any) => {
                const IconComponent = getActivityIcon(activity.activityType);
                const activityType = activityTypes.find(t => t.type === activity.activityType);
                
                return (
                  <div key={activity.id} className="bg-gem-dark rounded-lg p-3 border border-muted">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <IconComponent className={`h-4 w-4 mr-2 ${getActivityColor(activity.activityType)}`} />
                        <span className="font-medium text-sm">
                          {activity.activityType === 'welcome_bonus' 
                            ? 'Welcome Bonus' 
                            : activity.activityType === 'accolade_earned'
                            ? `${getAccoladeInfo(activity.metadata?.accoladeType).name} Earned`
                            : activityType?.title || 'Activity'}
                        </span>
                      </div>
                      <span className="text-primary font-bold text-sm">+{activity.points}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                <p>Start participating in Gemlaunch to earn points and see your activity here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}