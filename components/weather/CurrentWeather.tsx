'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { formatDistance } from 'date-fns';
import { Wind, Droplets, Eye, Sunrise, Sunset, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CurrentWeatherProps {
  data: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CurrentWeather({ 
  data, 
  isFavorite,
  onToggleFavorite 
}: CurrentWeatherProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Update the "time ago" text
    const updateTimeAgo = () => {
      const now = new Date();
      const dataTime = new Date(data.dt * 1000);
      setTimeAgo(formatDistance(dataTime, now, { addSuffix: true }));
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data.dt]);

  // Convert sunrise and sunset times to local time
  const sunriseTime = new Date((data.sys.sunrise + data.timezone) * 1000)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date((data.sys.sunset + data.timezone) * 1000)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Get weather icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  
  // Get weather-based gradient
  const getWeatherGradient = () => {
    const weatherId = data.weather[0].id;
    const isDaytime = data.weather[0].icon.includes('d');

    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return 'bg-gradient-to-br from-gray-700 to-gray-900';
    }
    // Drizzle or Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      return isDaytime 
        ? 'bg-gradient-to-br from-blue-300 to-gray-600' 
        : 'bg-gradient-to-br from-gray-700 to-blue-900';
    }
    // Snow
    else if (weatherId >= 600 && weatherId < 700) {
      return 'bg-gradient-to-br from-blue-100 to-blue-300';
    }
    // Atmosphere (fog, mist, etc.)
    else if (weatherId >= 700 && weatherId < 800) {
      return 'bg-gradient-to-br from-gray-300 to-gray-500';
    }
    // Clear
    else if (weatherId === 800) {
      return isDaytime 
        ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
        : 'bg-gradient-to-br from-blue-900 to-purple-900';
    }
    // Clouds
    else {
      return isDaytime 
        ? 'bg-gradient-to-br from-blue-300 to-gray-400' 
        : 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  };

  return (
    <Card className={cn("overflow-hidden", getWeatherGradient())}>
      <CardContent className="p-0">
        <div className="relative p-6 text-white">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFavorite}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-white" : "")} />
          </Button>

          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-3xl font-bold">{data.name}, {data.sys.country}</h2>
            <p className="text-sm text-white/80">Updated {timeAgo}</p>
          </div>

          <div className="flex items-center">
            <img 
              src={iconUrl} 
              alt={data.weather[0].description}
              className="w-24 h-24 object-contain mr-4"
            />
            <div>
              <div className="text-5xl font-bold">
                {Math.round(data.main.temp)}°C
              </div>
              <div className="capitalize text-lg">
                {data.weather[0].description}
              </div>
              <div className="text-sm">
                Feels like {Math.round(data.main.feels_like)}°C
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-white/80" />
              <div>
                <div className="text-sm text-white/80">Wind</div>
                <div>{data.wind.speed} m/s</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-white/80" />
              <div>
                <div className="text-sm text-white/80">Humidity</div>
                <div>{data.main.humidity}%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-white/80" />
              <div>
                <div className="text-sm text-white/80">Visibility</div>
                <div>{(data.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <Sunrise className="h-5 w-5 text-white/80" />
                <Sunset className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <div className="text-sm text-white/80">Sun</div>
                <div className="text-xs">{sunriseTime} / {sunsetTime}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}