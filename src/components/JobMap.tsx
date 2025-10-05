import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface JobMapProps {
  location: string;
  showInput?: boolean;
}

const JobMap = ({ location, showInput = false }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number]>([77.2090, 28.6139]); // Default to Delhi

  useEffect(() => {
    if (mapboxToken && mapContainer.current && !map.current) {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 12,
      });

      // Add marker
      new mapboxgl.Marker({ color: 'hsl(var(--primary))' })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${location}</strong>`))
        .addTo(map.current);

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, coordinates, location]);

  // Geocode location when it changes
  useEffect(() => {
    if (mapboxToken && location) {
      geocodeLocation(location);
    }
  }, [location, mapboxToken]);

  const geocodeLocation = async (locationStr: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationStr)}.json?access_token=${mapboxToken}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setCoordinates([lng, lat]);
        
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 12,
            essential: true
          });
          
          // Update marker
          new mapboxgl.Marker({ color: 'hsl(var(--primary))' })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${location}</strong>`))
            .addTo(map.current);
        }
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  };

  if (showInput && !mapboxToken) {
    return (
      <div className="space-y-3 p-4 border border-border rounded-lg bg-card">
        <Label htmlFor="mapbox-token">Enter your Mapbox Public Token</Label>
        <Input
          id="mapbox-token"
          type="text"
          placeholder="pk.eyJ1..."
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Get your free token at{' '}
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        <p className="text-sm">Map requires Mapbox token</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default JobMap;
