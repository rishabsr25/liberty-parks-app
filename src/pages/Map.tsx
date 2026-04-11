import { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Filter, AlertTriangle, Bath, Armchair, TreePine, Car, Baby, UtensilsCrossed, Dog, Trophy, Info, Leaf, Waves, LocateFixed } from 'lucide-react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
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

  // User location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationTracking, setLocationTracking] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);


  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });


  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);


  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);


  const filteredAmenities = selectedPark.amenities.filter(
    (amenity) => activeFilter === 'all' || amenity.type === activeFilter
  );


  // Update map view when selected park changes (only if not actively tracking user)
  useEffect(() => {
    if (map && selectedPark && !locationTracking) {
      if (selectedPark.zoom) {
        map.panTo({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng });
        map.setZoom(selectedPark.zoom);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: selectedPark.coordinates.lat, lng: selectedPark.coordinates.lng });

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
  }, [map, selectedPark, filteredAmenities, locationTracking]);


  // Inject "Find My Location" button into the map once loaded
  useEffect(() => {
    if (!map || !isLoaded) return;

    const btn = document.createElement('button');
    btn.id = 'find-my-location-btn';
    btn.title = 'Find my location';
    btn.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
      padding: 8px 14px;
      background: white;
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      color: #1a73e8;
      transition: box-shadow 0.2s, background 0.2s;
    `;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="#1a73e8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#1a73e8" fill-opacity="0.15" stroke="none"/>
      </svg>
      Find My Location
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      btn.style.background = '#f0f7ff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      btn.style.background = 'white';
    });

    btn.addEventListener('click', handleFindLocation);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(btn);

    return () => {
      // Clean up the button and any active watch on unmount
      map.controls[google.maps.ControlPosition.TOP_CENTER].clear();
    };
  }, [map, isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps


  // Stop watching position when component unmounts
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);


  function handleFindLocation() {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    // If already tracking, stop
    if (locationTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setLocationTracking(false);
      setUserLocation(null);
      setLocationError(null);

      // Update button appearance to "inactive"
      updateButtonState(false);
      return;
    }

    setLocationError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(pos);
        setLocationTracking(true);
        setLocationError(null);

        if (map) {
          map.panTo(pos);
          map.setZoom(16);
        }

        updateButtonState(true);
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : err.code === err.POSITION_UNAVAILABLE
            ? 'Location unavailable.'
            : 'Could not get your location.';
        setLocationError(msg);
        setLocationTracking(false);
        updateButtonState(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    watchIdRef.current = watchId;
  }

  function updateButtonState(active: boolean) {
    const btn = document.getElementById('find-my-location-btn') as HTMLButtonElement | null;
    if (!btn) return;
    if (active) {
      btn.style.color = '#1a73e8';
      btn.style.background = '#e8f0fe';
      btn.style.boxShadow = '0 0 0 2px #1a73e8 inset, 0 2px 8px rgba(0,0,0,0.2)';
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="#1a73e8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" fill="#1a73e8"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
        Tracking Location
      `;
    } else {
      btn.style.color = '#1a73e8';
      btn.style.background = 'white';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="#1a73e8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
        Find My Location
      `;
    }
  }


  const apiKeyMissing = !import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


  return (
    <Layout>
      <div className="min-h-screen px-5 sm:px-4 md:px-6 py-8 md:py-12 overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
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

        {locationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}


        <div className="grid gap-6 lg:grid-cols-3 md:w-full">
          {/* Sidebar - Park List */}
          <div className="space-y-4 w-[63%] md:w-full">
            <h2 className="font-heading text-lg font-semibold text-foreground">Select a Park</h2>
            <div className="space-y-2">
              {parks.map((park) => (
                <button
                  key={park.id}
                  onClick={() => {
                    setSelectedPark(park);
                    // Stop location tracking when user picks a park
                    if (locationTracking) {
                      if (watchIdRef.current !== null) {
                        navigator.geolocation.clearWatch(watchIdRef.current);
                        watchIdRef.current = null;
                      }
                      setLocationTracking(false);
                      setUserLocation(null);
                      updateButtonState(false);
                    }
                  }}
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
            <Card className="overflow-hidden w-[63%] md:w-full">
              <div className="relative w-full h-[70vh] min-h-[100px] bg-muted">
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
                      isFractionalZoomEnabled: true,
                    }}
                  >
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
                          <div className="relative -translate-x-1/2 -translate-y-1/2 group cursor-pointer w-6 sm:w-8 h-6 sm:h-8">
                            <div className={cn(
                              "flex h-6 sm:h-8 w-6 sm:w-8 items-center justify-center rounded-full border-2 shadow-sm transition-transform group-hover:scale-110",
                              colorClass
                            )}>
                              <IconComponent className="h-3 sm:h-4 w-3 sm:w-4" />
                            </div>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md border">
                                {amenity.name}
                              </div>
                            </div>
                          </div>
                        </OverlayView>
                      );
                    })}

                    {/* User Location Dot — blue circle with white border, Google Maps style */}
                    {userLocation && (
                      <OverlayView
                        position={userLocation}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                          style={{
                            transform: 'translate(-50%, -50%)',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#4285F4',
                            border: '3px solid white',
                            boxShadow: '0 0 0 2px rgba(66,133,244,0.35), 0 2px 8px rgba(0,0,0,0.3)',
                            position: 'relative',
                          }}
                        >
                          {/* Pulsing ring animation */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: -8,
                              borderRadius: '50%',
                              background: 'rgba(66,133,244,0.18)',
                              animation: 'locationPulse 2s ease-out infinite',
                            }}
                          />
                        </div>
                      </OverlayView>
                    )}
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
            <div className="flex items-center gap-2 pb-2 w-[62%] md:w-full overflow-x-auto">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {amenityFilters.map((filter) => (
                <Button
                  key={filter.type}
                  variant={activeFilter === filter.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.type)}
                  className="shrink-0 text-xs sm:text-sm"
                >
                  {filter.label}
                </Button>
              ))}
            </div>


            {/* Amenities List */}
            <Card className="w-[63%] md:w-full">
              <CardHeader>
                <CardTitle className="text-lg">Amenities at {selectedPark.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredAmenities.map((amenity) => {
                    const info = amenityInfo[amenity.type];
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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

        {/* Pulse animation keyframes injected once */}
        <style>{`
          @keyframes locationPulse {
            0%   { transform: scale(0.8); opacity: 0.8; }
            70%  { transform: scale(2.2); opacity: 0;   }
            100% { transform: scale(2.2); opacity: 0;   }
          }
        `}</style>
      </div>
    </Layout>
  );
}