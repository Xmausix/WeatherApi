'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { WeatherData, ForecastData, Location, SavedLocation } from '@/types/weather';
import { getCurrentWeather, getForecast } from '@/lib/api/weather';
import { reverseGeocode } from '@/lib/api/geocoding';
import useGeolocation from '@/hooks/useGeolocation';
import useSearchHistory from '@/hooks/useSearchHistory';

interface WeatherContextType {
  currentLocation: Location | null;
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  searchHistory: SavedLocation[];
  favorites: SavedLocation[];
  setLocation: (location: Location) => Promise<void>;
  useCurrentLocation: () => void;
  addToFavorites: (location: Location | SavedLocation) => void;
  removeFromFavorite: (id: string) => void;
  clearHistory: () => void;
  isFavorite: (lat: number, lon: number) => boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const geolocation = useGeolocation();
  const { 
    searchHistory, 
    favorites, 
    addToHistory, 
    clearHistory, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useSearchHistory();

  // Fetch weather data when location changes
  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Set location and fetch weather
  const setLocationAndFetchWeather = async (location: Location) => {
    setCurrentLocation(location);
    addToHistory(location);
    await fetchWeatherData(location.lat, location.lon);
  };

  // Use current geolocation
  const useCurrentLocation = async () => {
    if (geolocation.error) {
      setError(geolocation.error);
      return;
    }
    
    if (geolocation.latitude && geolocation.longitude) {
      setIsLoading(true);
      
      try {
        const locations = await reverseGeocode(geolocation.latitude, geolocation.longitude);
        
        if (locations && locations.length > 0) {
          await setLocationAndFetchWeather(locations[0]);
        } else {
          throw new Error('Could not find location information');
        }
      } catch (err) {
        setError('Failed to get your location. Please try searching instead.');
        console.error('Error getting current location:', err);
      }
    }
  };

  // Initialize with geolocation on first load
  useEffect(() => {
    if (!geolocation.loading && geolocation.latitude && geolocation.longitude && !currentLocation) {
      useCurrentLocation();
    }
  }, [geolocation.loading, geolocation.latitude, geolocation.longitude]);

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        currentWeather,
        forecast,
        isLoading,
        error,
        searchHistory,
        favorites,
        setLocation: setLocationAndFetchWeather,
        useCurrentLocation,
        addToFavorites,
        removeFromFavorite: removeFromFavorites,
        clearHistory,
        isFavorite,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  
  return context;
}