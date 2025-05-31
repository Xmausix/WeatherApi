'use client';

import { useEffect, useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import SearchBar from '@/components/weather/SearchBar';
import CurrentWeather from '@/components/weather/CurrentWeather';
import WeatherMap from '@/components/weather/WeatherMap';
import ForecastList from '@/components/weather/ForecastList';
import WeatherCharts from '@/components/weather/WeatherCharts';
import SearchHistory from '@/components/weather/SearchHistory';
import WeatherAlerts from '@/components/ui/weatherAlerts';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CloudSun, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WeatherDashboard() {
  const {
    currentLocation,
    currentWeather,
    forecast,
    isLoading,
    error,
    searchHistory,
    favorites,
    setLocation,
    useCurrentLocation,
    addToFavorites,
    removeFromFavorite,
    clearHistory,
    isFavorite,
  } = useWeather();

  const [mounted, setMounted] = useState(false);

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Get weather-based background gradient
  const getBackgroundGradient = () => {
    if (!currentWeather) return 'bg-gradient-to-br from-blue-100 to-blue-300';

    const weatherId = currentWeather.weather[0].id;
    const isDaytime = currentWeather.weather[0].icon.includes('d');

    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return 'bg-gradient-to-br from-gray-700 via-slate-800 to-gray-900';
    }
    // Drizzle or Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      return isDaytime 
        ? 'bg-gradient-to-br from-blue-300 via-blue-400 to-gray-600' 
        : 'bg-gradient-to-br from-gray-700 via-gray-800 to-blue-900';
    }
    // Snow
    else if (weatherId >= 600 && weatherId < 700) {
      return 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200';
    }
    // Atmosphere (fog, mist, etc.)
    else if (weatherId >= 700 && weatherId < 800) {
      return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
    }
    // Clear
    else if (weatherId === 800) {
      return isDaytime 
        ? 'bg-gradient-to-br from-blue-400 via-sky-500 to-blue-600' 
        : 'bg-gradient-to-br from-blue-900 via-purple-900 to-blue-950';
    }
    // Clouds
    else {
      return isDaytime 
        ? 'bg-gradient-to-br from-blue-300 via-blue-400 to-gray-400' 
        : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
    }
  };

  return (
    <main className={cn(
      "min-h-screen transition-colors duration-500",
      getBackgroundGradient()
    )}>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <CloudSun className="h-8 w-8 mr-2 text-white" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">Weather App</h1>
            </div>
            
            <div className="w-full md:w-auto flex gap-2 items-center">
              <SearchBar 
                onLocationSelect={setLocation}
                onUseCurrentLocation={useCurrentLocation}
              />
              <ThemeToggle />
            </div>
          </header>

          {/* Loading State */}
          {isLoading && !currentWeather && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="h-16 w-16 animate-spin text-white" />
              <p className="text-white mt-4 text-lg">Loading weather data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/90 text-white p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Weather Content */}
          {currentWeather && forecast && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Current Weather & Search History */}
              <div className="space-y-6">
                <CurrentWeather 
                  data={currentWeather}
                  isFavorite={currentLocation ? isFavorite(currentLocation.lat, currentLocation.lon) : false}
                  onToggleFavorite={() => {
                    if (currentLocation) {
                      if (isFavorite(currentLocation.lat, currentLocation.lon)) {
                        const favorite = favorites.find(
                          f => f.lat === currentLocation.lat && f.lon === currentLocation.lon
                        );
                        if (favorite) {
                          removeFromFavorite(favorite.id);
                        }
                      } else {
                        addToFavorites(currentLocation);
                      }
                    }
                  }}
                />
                
                <WeatherAlerts data={currentWeather} />
                
                <SearchHistory 
                  history={searchHistory}
                  favorites={favorites}
                  onSelectLocation={setLocation}
                  onClearHistory={clearHistory}
                  onToggleFavorite={(location) => {
                    if (isFavorite(location.lat, location.lon)) {
                      removeFromFavorite(location.id);
                    } else {
                      addToFavorites(location);
                    }
                  }}
                  onRemoveFavorite={removeFromFavorite}
                />
              </div>
              
              {/* Middle Column: Map */}
              <div className="md:col-span-2">
                <WeatherMap 
                  lat={currentWeather.coord.lat} 
                  lon={currentWeather.coord.lon}
                  className="h-[400px] md:h-[500px]" 
                />
                
                <ForecastList data={forecast} />
              </div>
            </div>
          )}
          
          {/* Charts */}
          {forecast && (
            <div className="mt-6">
              <WeatherCharts data={forecast} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}