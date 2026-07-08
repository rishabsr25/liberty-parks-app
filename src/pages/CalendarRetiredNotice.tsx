import { Link } from 'react-router-dom';
import { CalendarOff, Megaphone, Map, Trees } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CalendarRetiredNotice() {
  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-muted mb-4">
            <CalendarOff className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-3">
            Event Calendar Temporarily Retired
          </h1>
          <p className="text-muted-foreground text-lg">
            The community event calendar is paused while we improve the experience.
          </p>
        </div>

        <Alert className="mb-8">
          <Megaphone className="h-4 w-4" />
          <AlertTitle>What this means for you</AlertTitle>
          <AlertDescription>
            You can no longer browse upcoming park events, add community events, or view the
            monthly calendar in the app. Existing event data is being preserved, and the calendar
            will return once updates are complete.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why we&apos;re making this change</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We launched the event calendar to help residents discover programs, festivals, and
              gatherings across Liberty Township parks. After seeing how the feature was used, we
              decided to temporarily retire it so we can refine event listings, improve how
              submissions are reviewed, and make sure dates and locations stay accurate over time.
            </p>
            <p>
              This is not a permanent removal. We are actively working on a better calendar
              experience and will bring it back when it meets the standard our community deserves.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Where to find park news in the meantime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Important updates, seasonal programs, and township announcements will still be
              shared through other parts of the app:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Announcements</strong> — official news and
                notices from Liberty Township Parks
              </li>
              <li>
                <strong className="text-foreground">Our Parks</strong> — park details, amenities,
                and shelter reservations
              </li>
              <li>
                <strong className="text-foreground">Interactive Map</strong> — explore locations
                and amenities across all parks
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/announcements">
              <Megaphone className="h-4 w-4 mr-2" />
              View Announcements
            </Link>
          </Button>
          <Button asChild variant="outline">
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
        </div>
      </div>
    </Layout>
  );
}
