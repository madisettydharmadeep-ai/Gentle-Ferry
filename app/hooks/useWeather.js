'use client';

import { useState, useEffect, useCallback } from 'react';

// Open-Meteo API - free, no API key needed
const fetchWeather = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    );
    const data = await res.json();
    return data.current_weather;
  } catch (err) {
    console.error('Weather fetch failed:', err);
    return null;
  }
};

// WMO Weather code to our weather types
const getWeatherType = (wmoCode) => {
  // 0 = Clear, 1-3 = Cloudy, 45-48 = Fog, 51-67 = Rain, 71-77 = Snow, 80-82 = Rain showers, 85-86 = Snow showers, 95-99 = Thunderstorm
  if (wmoCode === 0) return 'clear';
  if (wmoCode >= 1 && wmoCode <= 3) return 'cloudy';
  if (wmoCode >= 45 && wmoCode <= 48) return 'cloudy';
  if (wmoCode >= 51 && wmoCode <= 67) return 'rainy';
  if (wmoCode >= 71 && wmoCode <= 77) return 'snowy';
  if (wmoCode >= 80 && wmoCode <= 82) return 'rainy';
  if (wmoCode >= 85 && wmoCode <= 86) return 'snowy';
  if (wmoCode >= 95 && wmoCode <= 99) return 'rainy';
  return 'clear';
};

export function useWeather() {
  const [weather, setWeather] = useState('clear');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState(null);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Fetch weather
        const weatherData = await fetchWeather(latitude, longitude);
        if (weatherData) {
          const type = getWeatherType(weatherData.weathercode);
          setWeather(type);
          setLocationName(`${weatherData.temperature}°C`);
        } else {
          setError('Could not fetch weather');
        }
        setLoading(false);
      },
      (err) => {
        setError('Location access denied');
        setLoading(false);
      }
    );
  }, []);

  // Auto-request on mount (will prompt user for permission)
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const setManualWeather = useCallback((type) => {
    setWeather(type);
    setLocationName('Manual');
  }, []);

  return {
    weather,
    loading,
    error,
    locationName,
    requestLocation,
    setManualWeather,
  };
}
