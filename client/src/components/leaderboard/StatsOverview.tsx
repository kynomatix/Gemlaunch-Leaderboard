import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Rocket, TrendingUp } from "lucide-react";

export default function StatsOverview() {
  // These would normally come from API calls based on connected wallet
  const userStats = {
    totalPoints: 0,
    rank: 0,
    referralCount: 0,
    launchCount: 0,
    volumeContributed: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5</div>
            <div className="text-sm text-muted-foreground">Funded Projects</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$39.76</div>
            <div className="text-sm text-muted-foreground">Raised Contribution</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2</div>
            <div className="text-sm text-muted-foreground">Unique Participants</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
