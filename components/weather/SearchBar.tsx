'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchLocations } from '@/lib/api/geocoding';
import { Location } from '@/types/weather';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  onUseCurrentLocation: () => void;
}

export default function SearchBar({ onLocationSelect, onUseCurrentLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        setIsOpen(locations.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          {query && (
            <button 
              onClick={clearSearch} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          onClick={onUseCurrentLocation}
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="hidden">Open</PopoverTrigger>
        <PopoverContent 
          className="p-0 w-[calc(100%-3rem)] max-w-md mt-2 max-h-[300px] overflow-y-auto" 
          align="start"
        >
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((location, index) => (
                <li 
                  key={`${location.lat}-${location.lon}-${index}`}
                  className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => handleSelect(location)}
                >
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {location.state ? `${location.state}, ` : ''}{location.country}
                  </div>
                </li>
              ))}
            </ul>
          ) : isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}