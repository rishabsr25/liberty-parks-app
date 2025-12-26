import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { announcements } from "@/data/mockData";
import { AlertCircle, Calendar, Info, Wrench } from "lucide-react";
import { format } from "date-fns";

const AnnouncementIcon = ({ category }: { category: string }) => {
    switch (category) {
        case 'alert':
            return <AlertCircle className="h-5 w-5 text-destructive" />;
        case 'maintenance':
            return <Wrench className="h-5 w-5 text-orange-500" />;
        case 'event':
            return <Calendar className="h-5 w-5 text-primary" />;
        default:
            return <Info className="h-5 w-5 text-blue-500" />;
    }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    if (priority === 'high') {
        return <Badge variant="destructive">Urgent</Badge>;
    }
    if (priority === 'medium') {
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Important</Badge>;
    }
    return null;
};

export default function Announcements() {
    // Sort announcements by date (newest first)
    const sortedAnnouncements = [...announcements].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <Layout>
            <div className="container py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
                        Announcements & News
                    </h1>
                    <p className="text-muted-foreground">
                        Stay updated with the latest news, alerts, and maintenance schedules for Liberty Township Parks.
                    </p>
                </div>

                <div className="grid gap-6">
                    {sortedAnnouncements.map((item) => (
                        <Card key={item.id} className={`overflow-hidden transition-all hover:shadow-md ${item.priority === 'high' ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.priority === 'high' ? 'bg-background' : 'bg-muted'}`}>
                                            <AnnouncementIcon category={item.category} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                {item.title}
                                                <PriorityBadge priority={item.priority} />
                                            </CardTitle>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <span>{format(item.date, "MMMM d, yyyy")}</span>
                                                <span>•</span>
                                                <span className="capitalize">{item.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {item.content}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {sortedAnnouncements.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No announcements at this time.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
