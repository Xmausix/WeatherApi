'use client';

import { SavedLocation } from '@/types/weather';
import { formatDistanceToNow } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, Trash2, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchHistoryProps {
  history: SavedLocation[];
  favorites: SavedLocation[];
  onSelectLocation: (location: SavedLocation) => void;
  onClearHistory: () => void;
  onToggleFavorite: (location: SavedLocation) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function SearchHistory({
  history,
  favorites,
  onSelectLocation,
  onClearHistory,
  onToggleFavorite,
  onRemoveFavorite
}: SearchHistoryProps) {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Search History
          </CardTitle>
          {history.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your search history will appear here
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((location) => (
                <div 
                  key={location.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => onSelectLocation(location)}
                >
                  <div>
                    <div className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1 inline-block text-muted-foreground" />
                      {location.name}, {location.country}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(location.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(location);
                    }}
                  >
                    <Star 
                      className="h-4 w-4" 
                      fill={favorites.some(f => f.id === location.id) ? 'currentColor' : 'none'} 
                    />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Favorites</h3>
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Add locations to favorites for quick access
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {favorites.map((location) => (
                <Card 
                  key={location.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectLocation(location)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="truncate pr-2">
                        <div className="font-medium truncate">{location.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{location.country}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 -mr-1 -mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(location.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}