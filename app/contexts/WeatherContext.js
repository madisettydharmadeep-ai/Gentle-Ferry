'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WeatherContext = createContext(null);

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
  if (wmoCode === 0) return 'clear';
  if (wmoCode >= 1 && wmoCode <= 3) return 'cloudy';
  if (wmoCode >= 45 && wmoCode <= 48) return 'cloudy';
  if (wmoCode >= 51 && wmoCode <= 67) return 'rainy';
  if (wmoCode >= 71 && wmoCode <= 77) return 'snowy';
  if (wmoCode >= 80 && wmoCode <= 82) return 'rainy';
  if (wmoCode >= 85 && wmoCode <= 86) return 'snowy';
  if (wmoCode >= 95 && wmoCode <= 99) return 'thunderstorm';
  return 'clear';
};

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState('clear');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isManual, setIsManual] = useState(false);

  // Load manual weather from localStorage on mount
  useEffect(() => {
    const savedWeather = localStorage.getItem('gentle-ferry-weather');
    const savedIsManual = localStorage.getItem('gentle-ferry-weather-manual');
    if (savedWeather && savedIsManual === 'true') {
      setWeather(savedWeather);
      setLocationName('Manual');
      setIsManual(true);
    }
  }, []);

  const requestLocation = useCallback(async () => {
    // Don't auto-detect if user manually set weather
    if (isManual) return;
    
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
  }, [isManual]);

  // Auto-request on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const setManualWeather = useCallback((type) => {
    setWeather(type);
    setLocationName('Manual');
    setIsManual(true);
    localStorage.setItem('gentle-ferry-weather', type);
    localStorage.setItem('gentle-ferry-weather-manual', 'true');
  }, []);

  const resetToAuto = useCallback(() => {
    setIsManual(false);
    localStorage.removeItem('gentle-ferry-weather');
    localStorage.removeItem('gentle-ferry-weather-manual');
    requestLocation();
  }, [requestLocation]);

  return (
    <WeatherContext.Provider value={{
      weather,
      loading,
      error,
      locationName,
      isManual,
      requestLocation,
      setManualWeather,
      resetToAuto,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used inside WeatherProvider');
  }
  return context;
}
