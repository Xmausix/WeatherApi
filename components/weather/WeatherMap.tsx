'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

interface WeatherMapProps {
  lat: number;
  lon: number;
  className?: string;
}

export default function WeatherMap({ lat, lon, className }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;

    async function initializeMap() {
      const L = (await import('leaflet')).default;
      
      // Initialize map if it doesn't exist yet
      if (!leafletMapRef.current) {
        // Fix Leaflet's icon path issues with webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        // Create map instance
        leafletMapRef.current = L.map(mapRef.current).setView([lat, lon], 10);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(leafletMapRef.current);
        
        // Add weather layer
        L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`, {
          attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
          maxZoom: 18,
          opacity: 0.6,
        }).addTo(leafletMapRef.current);
        
        // Add marker
        markerRef.current = L.marker([lat, lon]).addTo(leafletMapRef.current);
      } else {
        // If map exists, update view and marker position
        leafletMapRef.current.setView([lat, lon], 10);
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
        }
      }
    }

    initializeMap();

    // Clean up on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <Card className={cn("h-[300px] md:h-[400px] overflow-hidden", className)}>
      <div ref={mapRef} className="h-full w-full" />
    </Card>
  );
}