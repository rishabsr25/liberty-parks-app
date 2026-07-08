import { Link } from 'react-router-dom';
import { SearchX, Map, Trees, Vote } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ParkSelectorRetiredNotice() {
  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-muted mb-4">
            <SearchX className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-3">
            Park Selector Temporarily Unavailable
          </h1>
          <p className="text-muted-foreground text-lg">
            We are actively working on improving the Park Selector right now.
          </p>
        </div>

        <Alert className="mb-8">
          <SearchX className="h-4 w-4" />
          <AlertTitle>What this means for you</AlertTitle>
          <AlertDescription>
            Personalized park recommendations are paused while we improve search accuracy,
            scoring, and how the tool matches activities to each park&apos;s amenities.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What we&apos;re improving</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The Park Selector helps you describe what you want to do — like running with a dog,
              hosting a picnic, or finding sports fields — and recommends the best Liberty Township
              parks for that visit. We are refining that experience so results are clearer, more
              accurate, and easier to act on.
            </p>
            <p>
              This is a temporary pause, not a permanent removal. The full selector will return once
              these improvements are ready.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plan your visit in the meantime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Our Parks</strong> — browse all parks, amenities,
                and shelter reservations
              </li>
              <li>
                <strong className="text-foreground">Interactive Map</strong> — explore amenities and
                locations across the township
              </li>
              <li>
                <strong className="text-foreground">Community Voting</strong> — share input on future
                park improvements
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/parks">
              <Trees className="h-4 w-4 mr-2" />
              Explore Parks
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/map">
              <Map className="h-4 w-4 mr-2" />
              Open Map
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/voting">
              <Vote className="h-4 w-4 mr-2" />
              Community Voting
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
