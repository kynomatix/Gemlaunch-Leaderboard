import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, Copy, Users, TrendingUp, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReferralPanel() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Mock referral data
  const referralData = {
    referralLink: "https://gemlaunch.io?ref=ABC123XYZ",
    totalClicks: 234,
    conversions: 12,
    weeklyReferrals: 3,
    monthlyReferrals: 8,
    totalEarned: 6840
  };

  const mockRecentReferrals = [
    { id: 1, username: "User_7x9a2", joinedAt: "2 days ago", pointsEarned: 500 },
    { id: 2, username: "CryptoNinja", joinedAt: "1 week ago", pointsEarned: 500 },
    { id: 3, username: "TokenHunter", joinedAt: "2 weeks ago", pointsEarned: 500 },
    { id: 4, username: "DeFiExplorer", joinedAt: "3 weeks ago", pointsEarned: 500 }
  ];

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Referral Link Generator */}
      <Card className="bg-gem-slate border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Link className="h-6 w-6 text-primary mr-3" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gem-dark rounded-lg p-4 border border-primary/30">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-gray-300 truncate mr-4">
                  {referralData.referralLink}
                </div>
                <Button
                  onClick={copyReferralLink}
                  size="sm"
                  className={`${
                    copied 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-primary hover:bg-primary/90"
                  } text-primary-foreground`}
                >
                  {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {referralData.totalClicks}
                </div>
                <div className="text-sm text-gray-400">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {referralData.conversions}
                </div>
                <div className="text-sm text-gray-400">Conversions</div>
              </div>
            </div>

            <div className="bg-gem-dark rounded-lg p-4">
              <h4 className="font-medium mb-2">Referral Rewards</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <div>• 500 points per successful referral</div>
                <div>• 2% of referee's points permanently</div>
                <div>• Bonus multipliers for community leaders</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats and Recent Activity */}
      <div className="space-y-6">
        <Card className="bg-gem-slate border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Referral Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>This Week</span>
              <Badge variant="outline" className="border-primary text-primary">
                +{referralData.weeklyReferrals} referrals
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>This Month</span>
              <Badge variant="outline" className="border-primary text-primary">
                +{referralData.monthlyReferrals} referrals
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Earned</span>
              <span className="text-green-400 font-medium">
                {referralData.totalEarned.toLocaleString()} points
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Conversion Rate</span>
              <span className="text-primary font-medium">
                {((referralData.conversions / referralData.totalClicks) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gem-slate border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Recent Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecentReferrals.length > 0 ? (
              <div className="space-y-3">
                {mockRecentReferrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm">{referral.username}</div>
                      <div className="text-xs text-gray-400">{referral.joinedAt}</div>
                    </div>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      +{referral.pointsEarned} pts
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No referrals yet</p>
                <p className="text-xs mt-1">Share your link to start earning!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
