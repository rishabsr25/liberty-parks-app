import { useState, useCallback, useEffect } from 'react';
import { MapPin, Filter, AlertTriangle, Bath, Armchair, TreePine, Car, Baby, UtensilsCrossed, Dog, Trophy, Info, Leaf, Waves } from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF, OverlayView } from '@react-google-maps/api';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parks, amenityInfo } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const amenityFilters = [
  { type: 'all', label: 'All' },
  { type: 'bathroom', label: 'Restrooms' },
  { type: 'parking', label: 'Parking' },
  { type: 'playground', label: 'Playground' },
  { type: 'trail', label: 'Trails' },
  { type: 'dog-park', label: 'Dog Park' },
  { type: 'sports', label: 'Sports' },
];

const IconMap: Record<string, any> = {
  Bath, Armchair, TreePine, Car, Baby, UtensilsCrossed, Dog, Trophy, Info, Leaf
};

const amenityColorMap: Record<string, string> = {
  sky: 'bg-sky text-sky-foreground border-sky/30',
  earth: 'bg-earth text-earth-foreground border-earth/30',
  forest: 'bg-forest text-forest-foreground border-forest-light/30',
  bark: 'bg-bark text-bark-foreground border-bark/30',
  accent: 'bg-accent text-accent-foreground border-accent/30',
  moss: 'bg-moss text-moss-foreground border-moss/30',
  primary: 'bg-primary text-primary-foreground border-primary/30',
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function MapPage() {
  const [selectedPark, setSelectedPark] = useState(parks[0]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const filteredAmenities = selectedPark.amenities.filter(
    (amenity) => activeFilter === 'all' || amenity.type === activeFilter
  );

  // Update map view when selected park changes
  useEffect(() => {
    if (map && selectedPark) {
      if (selectedPark.zoom) {
        map.panTo({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng });
        map.setZoom(selectedPark.zoom);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      // Add park location
      bounds.extend({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng });

      // Add amenities
      filteredAmenities.forEach((a) => {
        bounds.extend({ lat: a.coordinates.lat, lng: a.coordinates.lng });
      });

      if (filteredAmenities.length > 0) {
        map.fitBounds(bounds);
      } else {
        map.panTo({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng });
        map.setZoom(16);
      }
    }
  }, [map, selectedPark, filteredAmenities]);

  const apiKeyMissing = !import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-2">
            Interactive Park Map
          </h1>
          <p className="text-muted-foreground">
            Explore park amenities and find what you need for your visit.
          </p>
        </div>

        {apiKeyMissing && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription>
              Google Maps API Key is missing. Please add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Park List */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Select a Park</h2>
            <div className="space-y-2">
              {parks.map((park) => (
                <button
                  key={park.id}
                  onClick={() => setSelectedPark(park)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border transition-all',
                    selectedPark.id === park.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{park.name}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-muted">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng }}
                    zoom={15}
                    onLoad={onMapLoad}
                    onUnmount={onUnmount}
                    options={{
                      mapTypeId: 'satellite',
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {/* Park Marker - Removed as per request */}

                    {/* Amenities Markers */}
                    {filteredAmenities.map((amenity) => {
                      const info = amenityInfo[amenity.type];
                      const IconComponent = IconMap[info.icon] || MapPin;
                      const colorClass = amenityColorMap[info.color] || 'bg-primary text-primary-foreground';

                      return (
                        <OverlayView
                          key={amenity.id}
                          position={{ lat: amenity.coordinates.lat, lng: amenity.coordinates.lng }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div className="relative -translate-x-1/2 -translate-y-1/2 group cursor-pointer w-8 h-8">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-sm transition-transform group-hover:scale-110",
                              colorClass
                            )}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md border">
                                {amenity.name}
                              </div>
                            </div>
                          </div>
                        </OverlayView>
                      )
                    })}
                  </GoogleMap>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      {loadError ? (
                        <div className="text-destructive font-medium">Map failed to load. Check API Key.</div>
                      ) : apiKeyMissing ? (
                        <div className="text-muted-foreground">Map disabled (No API Key)</div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-5 w-5 animate-bounce" />
                          Loading Google Maps...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {amenityFilters.map((filter) => (
                <Button
                  key={filter.type}
                  variant={activeFilter === filter.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.type)}
                  className="shrink-0"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Amenities List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amenities at {selectedPark.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredAmenities.map((amenity) => {
                    const info = amenityInfo[amenity.type];
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          {/* We really should have a proper icon mapping component. 
                              For now, just MapPin is safe or we assume the text description is enough */}
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{amenity.name}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {info?.label || amenity.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredAmenities.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No amenities match the selected filter.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
