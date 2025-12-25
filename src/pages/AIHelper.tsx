import { useState } from 'react';
import { Sparkles, MapPin, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { parks, parkAttributes, ParkRecommendation } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MatchScore {
  parkId: string;
  parkName: string;
  score: number;
  matchReason: string;
}

const ACTIVITY_KEYWORDS: Record<string, Record<string, number>> = {
  run: { runningTrails: 5, parking: 2, accessibility: 3 },
  dog: { dogFriendly: 5, parking: 3, playground: 1 },
  picnic: { picnicFacilities: 5, parking: 3, playground: 1 },
  family: { playground: 5, picnicFacilities: 3, parking: 4, accessibility: 3 },
  sports: { sportsFields: 5, parking: 3, accessibility: 3 },
  nature: { natureSensitivity: 5, waterAccess: 3, runningTrails: 2 },
  water: { waterAccess: 5, parking: 3, playground: 2 },
  hiking: { runningTrails: 5, natureSensitivity: 3, accessibility: 2 },
  playground: { playground: 5, parking: 3, picnicFacilities: 2 },
  fishing: { waterAccess: 5, parking: 3, picnicFacilities: 2 },
};

export default function AIParkHelperPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<MatchScore[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const calculateParkScore = (query: string): MatchScore[] => {
    const lowerQuery = query.toLowerCase();
    const scores: MatchScore[] = [];

    for (const park of parks) {
      const parkAttr = parkAttributes[park.id];
      if (!parkAttr) continue;

      let totalScore = 0;
      let maxPossibleScore = 0;
      const matchedActivities: string[] = [];

      for (const [keyword, weights] of Object.entries(ACTIVITY_KEYWORDS)) {
        if (lowerQuery.includes(keyword)) {
          matchedActivities.push(keyword);
          let keywordScore = 0;
          let keywordMax = 0;

          for (const [attribute, weight] of Object.entries(weights)) {
            const attrValue = parkAttr[attribute as keyof typeof parkAttr] || 0;
            keywordScore += (attrValue / 5) * weight;
            keywordMax += weight;
          }

          totalScore += keywordScore;
          maxPossibleScore += keywordMax;
        }
      }

      if (matchedActivities.length > 0) {
        const percentage = Math.round((totalScore / maxPossibleScore) * 100);
        scores.push({
          parkId: park.id,
          parkName: park.name,
          score: Math.min(100, Math.max(0, percentage)),
          matchReason: `Perfect for ${matchedActivities.slice(0, 2).join(', ')}`,
        });
      } else {
        // Default score for no matches
        scores.push({
          parkId: park.id,
          parkName: park.name,
          score: Math.random() * 30 + 40,
          matchReason: 'General park amenities',
        });
      }
    }

    return scores.sort((a, b) => b.score - a.score);
  };

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: 'Please enter your interests',
        description: 'Tell us what you like to do at parks!',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simulate AI processing
    setTimeout(() => {
      const results = calculateParkScore(query);
      setRecommendations(results);
      setIsSearching(false);
      toast({
        title: 'Analysis Complete',
        description: 'Here are your personalized park recommendations!',
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            AI Park Helper
          </h1>
          <p className="text-muted-foreground">
            Discover the perfect park for your needs. Tell us what you want to do, and we'll recommend the best parks in Liberty Township.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  What would you like to do? (e.g., "run with my dog and have a picnic")
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tell me about your ideal park visit..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isSearching ? 'Analyzing...' : 'Find Parks'}
                  </Button>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'I want to run with my dog',
                    'Family day with kids',
                    'Peaceful nature walk',
                    'Sports and recreation',
                    'Picnic and relaxation',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        setQuery(example);
                        const results = calculateParkScore(example);
                        setRecommendations(results);
                        setHasSearched(true);
                      }}
                      className="px-3 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Your Personalized Recommendations</h2>

            {recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map((rec, index) => {
                  const park = parks.find((p) => p.id === rec.parkId);
                  if (!park) return null;

                  return (
                    <Card
                      key={rec.parkId}
                      className={cn(
                        'overflow-hidden transition-all hover:shadow-lg',
                        index === 0 && 'border-2 border-primary bg-primary/5'
                      )}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-foreground">
                                  {rec.parkName}
                                </h3>
                                {index === 0 && (
                                  <Badge className="bg-primary">Top Match</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{park.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-4xl font-bold text-primary">{rec.score}%</div>
                              <p className="text-xs text-muted-foreground mt-1">Match</p>
                            </div>
                          </div>

                          {/* Match Reason */}
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-700 font-medium">{rec.matchReason}</p>
                          </div>

                          {/* Match Bar */}
                          <div className="space-y-2">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                style={{ width: `${rec.score}%` }}
                              />
                            </div>
                          </div>

                          {/* Park Info */}
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="text-sm font-medium flex items-start gap-1 mt-1">
                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                {park.address}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Amenities</p>
                              <p className="text-sm font-medium mt-1">{park.amenities.length} available</p>
                            </div>
                          </div>

                          {/* Amenity Tags */}
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(park.amenities.map((a) => a.type)))
                              .slice(0, 4)
                              .map((amenityType) => (
                                <Badge key={amenityType} variant="secondary" className="text-xs">
                                  {amenityType.replace('-', ' ')}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No parks found for your search. Try different keywords!</p>
                </CardContent>
              </Card>
            )}

            {/* Why These Recommendations */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Why These Recommendations?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Our AI Park Helper analyzes your interests and matches them against Liberty Township's 7 parks. Each park is scored based on its amenities and suitability for your activities.
                </p>
                <p>
                  We consider factors like running trails, dog-friendliness, picnic areas, sports fields, water access, and more to give you personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initial Info */}
        {!hasSearched && (
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Personalized',
                description: 'Get tailored recommendations based on your specific interests and preferences.',
              },
              {
                title: 'Comprehensive',
                description: 'We analyze all 7 parks in Liberty Township to find the best match for you.',
              },
              {
                title: 'Detailed',
                description: 'Each recommendation includes match percentage, amenities, and location details.',
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
