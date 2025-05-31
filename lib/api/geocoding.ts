import { Location } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];
  
  const response = await fetch(
    `${BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }
  
  return response.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<Location[]> {
  const response = await fetch(
    `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to reverse geocode location');
  }
  
  return response.json();
}