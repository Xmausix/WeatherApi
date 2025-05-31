import { WeatherData, ForecastData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch current weather data');
  }
  
  return response.json();
}

export async function getForecast(lat: number, lon: number): Promise<ForecastData> {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  
  return response.json();
}