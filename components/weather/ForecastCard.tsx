'use client';

import { ForecastItem } from '@/types/weather';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ForecastCardProps {
  data: ForecastItem;
  timezone: number;
}

export default function ForecastCard({ data, timezone }: ForecastCardProps) {
  // Convert timestamp to local date with timezone offset
  const date = new Date((data.dt + timezone) * 1000);
  
  // Get day name (e.g., "Monday")
  const dayName = format(date, 'EEEE');
  
  // Get time (e.g., "15:00")
  const time = format(date, 'HH:mm');
  
  // Get weather icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
      <CardContent className="p-3">
        <div className="text-center">
          <p className="font-medium">{dayName}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
          
          <div className="my-2 flex justify-center">
            <img 
              src={iconUrl} 
              alt={data.weather[0].description} 
              className="h-10 w-10"
            />
          </div>
          
          <p className="text-xl font-bold">{Math.round(data.main.temp)}°C</p>
          
          <p className="text-xs capitalize text-muted-foreground mt-1">
            {data.weather[0].description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}