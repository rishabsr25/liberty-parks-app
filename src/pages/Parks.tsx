import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import { parks as allParks, Park, amenityInfo } from "@/data/mockData";
import { useSearchParams } from "react-router-dom";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Parks = () => {
    const [selectedPark, setSelectedPark] = useState<Park | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const parkId = searchParams.get('park');
        if (parkId) {
            const parkToSelect = allParks.find(p => p.id === parkId);
            if (parkToSelect) {
                setSelectedPark(parkToSelect);
            }
        }
    }, [searchParams]);

    const openParkDetails = (park: Park) => {
        setSelectedPark(park);
    };

    const closeParkDetails = () => {
        setSelectedPark(null);
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allParks.map((park) => (
                                <Card
                                    key={park.id}
                                    className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                    onClick={() => openParkDetails(park)}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        {park.image ? (
                                            <img
                                                src={park.image}
                                                alt={park.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Trees className="w-12 h-12 text-muted-foreground/50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                                            {park.name}
                                        </h3>
                                        <div className="flex items-start gap-2 text-muted-foreground text-sm mb-4">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{park.address}</span>
                                        </div>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                            {park.description}
                                        </p>

                                        <Button className="w-full mt-auto">
                                            Learn More
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Park Details Modal */}
                <Dialog open={!!selectedPark} onOpenChange={(open) => !open && closeParkDetails()}>
                    <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] p-0 gap-0">
                        {selectedPark && (
                            <>
                                {/* Modal Header Image */}
                                <div className="relative h-64 md:h-80 w-full overflow-hidden bg-muted">
                                    {selectedPark.image && (
                                        <img
                                            src={selectedPark.image}
                                            alt={selectedPark.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                                    <button
                                        onClick={closeParkDetails}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-2">{selectedPark.name}</h2>
                                        <div className="flex items-center gap-2 text-foreground/80">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm md:text-base">{selectedPark.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 space-y-8">
                                    {/* Description */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">About</h3>
                                        <p className="text-muted-foreground leading-relaxed text-lg">
                                            {selectedPark.description}
                                        </p>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedPark.amenities.map(amenity => {
                                                const info = amenityInfo[amenity.type];
                                                return (
                                                    <div key={amenity.id} className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/50 border border-secondary text-center gap-2">
                                                        <span className="text-sm font-medium text-foreground">{amenity.name}</span>
                                                        <Badge variant="outline" className="text-xs">{info?.label || amenity.type}</Badge>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};

export default Parks;
