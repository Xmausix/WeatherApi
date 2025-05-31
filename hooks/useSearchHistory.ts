'use client';

import { useState, useEffect } from 'react';
import { Location, SavedLocation } from '@/types/weather';
import { v4 as uuidv4 } from 'uuid';

const HISTORY_KEY = 'weather_search_history';
const FAVORITES_KEY = 'weather_favorites';

export default function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SavedLocation[]>([]);
  const [favorites, setFavorites] = useState<SavedLocation[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  // Save to localStorage whenever history or favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToHistory = (location: Location) => {
    const savedLocation: SavedLocation = {
      ...location,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    setSearchHistory(prev => {
      // Filter out any existing entries for the same location
      const filtered = prev.filter(
        item => !(item.lat === location.lat && item.lon === location.lon)
      );
      
      // Add the new location to the beginning of the array
      return [savedLocation, ...filtered].slice(0, 10); // Keep only the 10 most recent
    });
    
    return savedLocation;
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const addToFavorites = (location: Location | SavedLocation) => {
    if ('id' in location) {
      // Location is already a SavedLocation
      setFavorites(prev => {
        if (prev.some(fav => fav.id === location.id)) {
          return prev; // Already in favorites
        }
        return [location as SavedLocation, ...prev];
      });
    } else {
      // Convert Location to SavedLocation
      const savedLocation: SavedLocation = {
        ...location,
        id: uuidv4(),
        timestamp: Date.now(),
      };
      
      setFavorites(prev => {
        if (prev.some(fav => fav.lat === location.lat && fav.lon === location.lon)) {
          return prev; // Already in favorites
        }
        return [savedLocation, ...prev];
      });
    }
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(location => location.id !== id));
  };

  const isFavorite = (lat: number, lon: number) => {
    return favorites.some(fav => fav.lat === lat && fav.lon === lon);
  };

  return {
    searchHistory,
    favorites,
    addToHistory,
    clearHistory,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
}