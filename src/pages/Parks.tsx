import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, ChevronDown } from "lucide-react";
import { useState } from "react";
import { parks as allParks } from "@/data/mockData";

const Parks = () => {
    const [expandedParkId, setExpandedParkId] = useState<string | null>(null);

    const toggleParkDescription = (parkId: string) => {
        setExpandedParkId(expandedParkId === parkId ? null : parkId);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        {/* Section Header */}
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                                <Trees className="w-4 h-4" />
                                All Parks
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                                Our Parks
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Explore all parks in Liberty Township and find your next outdoor destination.
                            </p>
                        </div>

                        {/* Parks Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {allParks.map((park) => (
                                <Card
                                    key={park.id}
                                    className="overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-300"
                                    onClick={() => toggleParkDescription(park.id)}
                                >
                                    {/* Content */}
                                    <CardContent className="p-6">
                                        <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                                            {park.name}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            {park.address}
                                        </p>

                                        {/* Expandable Description */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${expandedParkId === park.id ? "max-h-96" : "max-h-0"
                                                }`}
                                        >
                                            <p className="text-sm text-foreground mb-4 pb-4 border-t pt-4">
                                                {park.description}
                                            </p>
                                        </div>

                                        {/* Toggle Button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-0 h-auto text-primary hover:text-primary/80 w-full justify-center"
                                        >
                                            {expandedParkId === park.id ? "Show Less" : "Learn More"}
                                            <ChevronDown
                                                className={`w-4 h-4 ml-1 transition-transform duration-300 ${expandedParkId === park.id ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Parks;
