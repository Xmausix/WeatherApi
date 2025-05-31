'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForecastData, ForecastItem } from '@/types/weather';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface WeatherChartsProps {
  data: ForecastData;
}

export default function WeatherCharts({ data }: WeatherChartsProps) {
  const [activeTab, setActiveTab] = useState('temperature');
  
  // Prepare data for the charts
  const chartData = data.list.slice(0, 16).map((item) => {
    const date = new Date(item.dt * 1000);
    
    return {
      time: format(date, 'HH:mm'),
      day: format(date, 'EEE'),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      precipitation: item.rain?.['3h'] || 0,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    };
  });

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            <TabsTrigger value="humidity">Humidity & Wind</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="temperature" className="h-[300px] mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value, index) => `${chartData[index].day} ${value}`}
              />
              <YAxis tick={{ fill: '#6B7280' }} tickCount={6} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="Temperature (°C)"
                dot={{ fill: "hsl(var(--chart-1))" }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="feelsLike" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2} 
                name="Feels Like (°C)"
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="precipitation" className="h-[300px] mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value, index) => `${chartData[index].day} ${value}`}
              />
              <YAxis tick={{ fill: '#6B7280' }} tickCount={6} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="precipitation" 
                fill="hsl(var(--chart-2))" 
                name="Precipitation (mm)" 
                barSize={20} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="humidity" className="h-[300px] mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value, index) => `${chartData[index].day} ${value}`}
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fill: '#6B7280' }} 
                tickCount={6} 
                domain={[0, 100]} 
                label={{ value: '%', position: 'insideTopLeft', dy: -10, fill: '#6B7280' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fill: '#6B7280' }} 
                tickCount={6} 
                domain={[0, 'auto']} 
                label={{ value: 'm/s', position: 'insideTopRight', dy: -10, fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="humidity" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                name="Humidity (%)"
                dot={{ fill: "hsl(var(--chart-3))" }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="windSpeed" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2} 
                name="Wind Speed (m/s)"
                dot={{ fill: "hsl(var(--chart-4))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </CardContent>
    </Card>
  );
}