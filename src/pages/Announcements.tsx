import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, CalendarOff } from "lucide-react";
import { format, parseISO } from "date-fns";

const EDGE_FUNCTION_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-emails`;

interface Announcement {
  id: string;
  title: string;
  date: string;  // "YYYY-MM-DD"
  body: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error ?? `HTTP ${res.status}`);
        }

        const data: Announcement[] = await res.json();
        setAnnouncements(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
            Announcements &amp; News
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest news and announcements for Liberty Township Parks.
          </p>
        </div>

        <Alert className="mb-8 border-primary/30 bg-primary/5">
          <CalendarOff className="h-4 w-4" />
          <AlertTitle>Event calendar temporarily retired</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              The in-app event calendar has been temporarily retired while we improve how events
              are listed, reviewed, and kept up to date across Liberty Township parks.
            </p>
            <p>
              Past event information is being preserved, and we will post here when the calendar
              returns.               In the meantime, use this page for official announcements, or visit{" "}
              <Link to="/parks" className="font-medium text-primary underline-offset-4 hover:underline">
                Our Parks
              </Link>{" "}
              and the{" "}
              <Link to="/map" className="font-medium text-primary underline-offset-4 hover:underline">
                Interactive Map
              </Link>{" "}
              to plan your visit.
            </p>
          </AlertDescription>
        </Alert>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading announcements…</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-12 text-destructive">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-medium">Failed to load announcements.</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && announcements.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No announcements at this time.</p>
          </div>
        )}

        {/* Announcements list */}
        {!loading && !error && announcements.length > 0 && (
          <div className="grid gap-6">
            {announcements.map((item) => {
              let formattedDate = item.date;
              try {
                formattedDate = format(parseISO(item.date), "MMMM d, yyyy");
              } catch {
                // keep raw string if parsing fails
              }

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">
                      {item.title}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formattedDate}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {item.body}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
