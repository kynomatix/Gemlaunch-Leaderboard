import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from "lucide-react";
import { ACCOLADES, RARITY_COLORS, CATEGORY_NAMES, AccoladeDefinition } from "@shared/accolades";

export default function Accolades() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: userAccolades } = useQuery({
    queryKey: ['/api/user/accolades'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
  });

  const earnedAccoladeIds = new Set((userAccolades || []).map((a: any) => a.accoladeId));

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className || "w-5 h-5"} />;
    }
    return <LucideIcons.Award className={className || "w-5 h-5"} />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pioneer': return renderIcon('Star', 'h-5 w-5');
      case 'trading': return renderIcon('TrendingUp', 'h-5 w-5');
      case 'social': return renderIcon('Users', 'h-5 w-5');
      case 'creator': return renderIcon('Trophy', 'h-5 w-5');
      case 'elite': return renderIcon('Crown', 'h-5 w-5');
      case 'streak': return renderIcon('Zap', 'h-5 w-5');
      default: return renderIcon('Star', 'h-5 w-5');
    }
  };

  const getFilteredAccolades = (category: string) => {
    if (category === 'all') return ACCOLADES;
    if (category === 'earned') return ACCOLADES.filter(a => earnedAccoladeIds.has(a.id));
    return ACCOLADES.filter(a => a.category === category);
  };



  return (
    <div className="min-h-screen bg-[#0a0f0c] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            {renderIcon('Crown', 'h-8 w-8 mr-3 text-[#22cda6]')}
            Accolades & Achievements
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock achievements by participating in the Gemlaunch ecosystem. Each accolade grants bonus points and special recognition.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#253935] border-[#3d5c4d]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#22cda6] mb-2">
                {earnedAccoladeIds.size}
              </div>
              <div className="text-sm text-gray-400">Accolades Earned</div>
            </CardContent>
          </Card>
          <Card className="bg-[#253935] border-[#3d5c4d]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#22cda6] mb-2">
                {ACCOLADES.length}
              </div>
              <div className="text-sm text-gray-400">Total Available</div>
            </CardContent>
          </Card>
          <Card className="bg-[#253935] border-[#3d5c4d]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#22cda6] mb-2">
                {Math.round((earnedAccoladeIds.size / ACCOLADES.length) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Completion Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-[#253935] border-[#3d5c4d]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#22cda6] mb-2">
                {(userAccolades || []).reduce((sum: number, a: any) => sum + (ACCOLADES.find(accolade => accolade.id === a.accoladeId)?.pointsBonus || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Bonus Points Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-[#253935] border border-[#3d5c4d]">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#22cda6] data-[state=active]:text-black">
              All
            </TabsTrigger>
            <TabsTrigger value="earned" className="data-[state=active]:bg-[#22cda6] data-[state=active]:text-black">
              Earned
            </TabsTrigger>
            {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-[#22cda6] data-[state=active]:text-black flex items-center gap-1"
              >
                {getCategoryIcon(key)}
                <span className="hidden lg:inline">{name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(['all', 'earned'] as const).concat(Object.keys(CATEGORY_NAMES) as any).map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredAccolades(category).map((accolade) => {
                  const isEarned = earnedAccoladeIds.has(accolade.id);
                  const rarityColor = RARITY_COLORS[accolade.rarity];
                  
                  return (
                    <Card 
                      key={accolade.id}
                      className={`bg-[#253935] border transition-all hover:border-opacity-60 ${
                        isEarned 
                          ? 'border-[#22cda6] shadow-lg shadow-[#22cda6]/20' 
                          : 'border-[#3d5c4d] opacity-75'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl ${isEarned ? '' : 'grayscale opacity-50'}`}>
                              {renderIcon(accolade.icon, 'w-8 h-8')}
                            </div>
                            <div>
                              <CardTitle className={`text-lg ${isEarned ? 'text-[#22cda6]' : 'text-gray-300'}`}>
                                {accolade.name}
                              </CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  variant="outline" 
                                  style={{ 
                                    borderColor: rarityColor,
                                    color: rarityColor 
                                  }}
                                  className="text-xs"
                                >
                                  {accolade.rarity}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                                  Level {accolade.level}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {isEarned && (
                            <div className="text-[#22cda6]">
                              {renderIcon('Crown', 'h-5 w-5')}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-400 mb-3">
                          {accolade.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium">
                            HOW TO UNLOCK:
                          </div>
                          <div className="text-sm text-gray-300">
                            {accolade.criteria}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#3d5c4d]">
                          <div className="text-sm">
                            <span className="text-gray-500">Reward: </span>
                            <span className="text-[#22cda6] font-medium">+{accolade.pointsBonus} pts</span>
                            {accolade.multiplier && (
                              <span className="text-yellow-400 ml-2">
                                {(accolade.multiplier * 100 - 100).toFixed(0)}% bonus
                              </span>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {CATEGORY_NAMES[accolade.category]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {getFilteredAccolades(category).length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  {renderIcon('Crown', 'h-16 w-16 mx-auto mb-4 opacity-50')}
                  <h3 className="text-xl font-medium mb-2">No accolades found</h3>
                  <p>
                    {category === 'earned' 
                      ? "You haven't earned any accolades yet. Start participating to unlock achievements!"
                      : "No accolades available in this category."
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}