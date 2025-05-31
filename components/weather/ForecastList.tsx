'use client';

import { ForecastData } from '@/types/weather';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  data: ForecastData;
}

export default function ForecastList({ data }: ForecastListProps) {
  // Group forecast items by day
  const grouped = data.list.reduce<{ [key: string]: typeof data.list }>((acc, item) => {
    const date = new Date((item.dt + data.city.timezone) * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!acc[day]) {
      acc[day] = [];
    }
    
    acc[day].push(item);
    return acc;
  }, {});

  // Take first 5 days
  const days = Object.keys(grouped).slice(0, 5);

  return (
    <div className="space-y-6 mt-6">
      {days.map((day, dayIndex) => {
        const date = new Date(day);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        });
        
        return (
          <div key={day}>
            <h3 className="text-lg font-medium mb-2">{dayIndex === 0 ? 'Today' : formattedDate}</h3>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-2">
                {grouped[day].map((item) => (
                  <div key={item.dt} className="w-[120px] flex-shrink-0">
                    <ForecastCard 
                      data={item} 
                      timezone={data.city.timezone} 
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-2.5" />
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}