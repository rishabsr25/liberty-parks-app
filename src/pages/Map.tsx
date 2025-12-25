import { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin, Car, TreePine, Bath, Baby, Dog, Trophy, Armchair, UtensilsCrossed, Filter } from 'lucide-react';
import { GoogleMap } from '@react-google-maps/api';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parks, amenityInfo } from '@/data/mockData';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bath,
  Armchair,
  TreePine,
  Car,
  Baby,
  UtensilsCrossed,
  Dog,
  Trophy,
};

const amenityFilters = [
  { type: 'all', label: 'All' },
  { type: 'bathroom', label: 'Restrooms' },
  { type: 'parking', label: 'Parking' },
  { type: 'playground', label: 'Playground' },
  { type: 'trail', label: 'Trails' },
  { type: 'dog-park', label: 'Dog Park' },
  { type: 'sports', label: 'Sports' },
];

export default function MapPage() {
  const [selectedPark, setSelectedPark] = useState(parks[0]);
  const [activeFilter, setActiveFilter] = useState('all');

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // API key (for development only - remove before production)
  const apiKey = '';

  useEffect(() => {
    const key = apiKey;
    if (!key) {
      setLoadError(true);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script already exists in DOM
    const existing = Array.from(document.getElementsByTagName('script')).find((s) => s.src.includes('maps.googleapis.com'));
    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&language=en&region=US`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError(true);
    document.head.appendChild(script);
  }, [apiKey]);

  const mapContainerStyle = { width: '100%', height: '100%' };
  const defaultZoom = 15;
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const filteredAmenities = selectedPark.amenities.filter(
    (amenity) => activeFilter === 'all' || amenity.type === activeFilter
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    try {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng } as any);
      filteredAmenities.forEach((a) => bounds.extend({ lat: a.coordinates.lat, lng: a.coordinates.lng } as any));
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds);
      } else {
        mapRef.current.setCenter({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng });
        mapRef.current.setZoom(defaultZoom);
      }
    } catch (e) {
      // ignore if google maps types not ready
    }
  }, [isLoaded, selectedPark, activeFilter, filteredAmenities]);

  // create AdvancedMarkerElement markers (preferred over google.maps.Marker)
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // clear existing markers
    try {
      markersRef.current.forEach((m) => {
        if (m && typeof m.setMap === 'function') m.setMap(null);
      });
    } catch (e) {
      // ignore
    }
    markersRef.current = [];

    try {
      // park marker
      const parkMarker = new google.maps.Marker({
        position: { lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng },
        title: selectedPark.name,
        map: mapRef.current,
      });
      markersRef.current.push(parkMarker);

      // amenity markers
      filteredAmenities.forEach((a) => {
        const m = new google.maps.Marker({
          position: { lat: a.coordinates.lat, lng: a.coordinates.lng },
          title: a.name,
          map: mapRef.current,
        });
        markersRef.current.push(m);
      });
    } catch (e) {
      // fallback: do nothing
    }

    return () => {
      try {
        markersRef.current.forEach((m) => {
          if (m && typeof m.setMap === 'function') m.setMap(null);
        });
      } catch (e) {}
      markersRef.current = [];
    };
  }, [isLoaded, selectedPark, filteredAmenities]);

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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {park.amenities.length} amenities
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Google Map (satellite) */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10]">
                {!isLoaded && !loadError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      <div>Loading map…</div>
                    </div>
                  </div>
                )}

                {loadError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-red-600">Map failed to load</div>
                  </div>
                )}

                {isLoaded && (
                  <div className="absolute inset-0">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={{ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng }}
                      zoom={defaultZoom}
                      options={{ mapTypeId: 'satellite' as any, streetViewControl: false, mapTypeControl: false }}
                      onLoad={onMapLoad}
                    />
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
                    const Icon = iconMap[info.icon] || MapPin;
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{amenity.name}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {info.label}
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
