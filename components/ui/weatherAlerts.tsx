'use client';

import { WeatherData } from '@/types/weather';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Cloud, CloudRain, CloudLightning, CloudSnow, Wind, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherAlertsProps {
  data: WeatherData;
}

export default function WeatherAlerts({ data }: WeatherAlertsProps) {
  // Determine if there are any weather conditions to alert about
  const hasStrongWind = data.wind.speed > 10; // Wind speed greater than 10 m/s
  const hasHeavyRain = data.rain && data.rain['1h'] && data.rain['1h'] > 10; // Heavy rain
  const hasThunderstorm = data.weather.some(w => w.id >= 200 && w.id < 300); // Thunderstorm
  const hasSnow = data.weather.some(w => w.id >= 600 && w.id < 700); // Snow
  const hasExtremeTemp = data.main.temp > 35 || data.main.temp < 0; // Extreme temperatures
  
  if (!hasStrongWind && !hasHeavyRain && !hasThunderstorm && !hasSnow && !hasExtremeTemp) {
    return null; // No alerts needed
  }
  
  return (
    <div className="space-y-3">
      {hasThunderstorm && (
        <Alert variant="destructive\" className="bg-amber-500/90 text-white border-amber-600">
          <CloudLightning className="h-4 w-4" />
          <AlertTitle>Thunderstorm Alert</AlertTitle>
          <AlertDescription>
            Thunderstorms are in the area. Seek shelter and avoid open areas.
          </AlertDescription>
        </Alert>
      )}
      
      {hasHeavyRain && (
        <Alert className="bg-blue-600/90 text-white border-blue-700">
          <CloudRain className="h-4 w-4" />
          <AlertTitle>Heavy Rain</AlertTitle>
          <AlertDescription>
            Heavy rainfall may cause reduced visibility and local flooding.
          </AlertDescription>
        </Alert>
      )}
      
      {hasStrongWind && (
        <Alert className="bg-yellow-500/90 text-white border-yellow-600">
          <Wind className="h-4 w-4" />
          <AlertTitle>Strong Winds</AlertTitle>
          <AlertDescription>
            Wind speeds are high ({Math.round(data.wind.speed)} m/s). Secure loose objects outdoors.
          </AlertDescription>
        </Alert>
      )}
      
      {hasSnow && (
        <Alert className="bg-sky-300/90 text-slate-800 border-sky-400">
          <CloudSnow className="h-4 w-4" />
          <AlertTitle>Snow Conditions</AlertTitle>
          <AlertDescription>
            Snowfall may affect travel. Check road conditions before traveling.
          </AlertDescription>
        </Alert>
      )}
      
      {hasExtremeTemp && (
        <Alert className={cn(
          "text-white",
          data.main.temp > 35 
            ? "bg-red-600/90 border-red-700" 
            : "bg-indigo-600/90 border-indigo-700"
        )}>
          <Thermometer className="h-4 w-4" />
          <AlertTitle>
            {data.main.temp > 35 ? "Extreme Heat" : "Freezing Temperatures"}
          </AlertTitle>
          <AlertDescription>
            {data.main.temp > 35 
              ? "High temperatures may pose health risks. Stay hydrated and avoid prolonged sun exposure." 
              : "Freezing temperatures may cause icy conditions. Dress warmly and be cautious on roads."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}