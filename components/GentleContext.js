'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GentleContext() {
  const [context, setContext] = useState('A quiet moment ahead.');

  useEffect(() => {
    let active = true;

    async function fetchGentleWeather() {
      try {
        // 1. Unobtrusively grab general coordinates via IP (No intrusive prompts)
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!geoRes.ok) throw new Error();
        const geoData = await geoRes.json();
        
        // 2. Fetch anonymous weather data using open-meteo
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current_weather=true`);
        if (!weatherRes.ok) throw new Error();
        const weatherData = await weatherRes.json();
        
        const temp = weatherData.current_weather.temperature;
        const code = weatherData.current_weather.weathercode;

        // 3. Poetic Ghibli translation
        let feeling = "A gentle breeze. Let your thoughts settle.";
        
        if (code === 0) {
          feeling = temp >= 25 
            ? "Warm sunlight today. A good day for lighter tasks." 
            : "Clear skies. Very crisp and beautiful.";
        } else if (code >= 1 && code <= 3) {
          feeling = temp >= 25 
            ? "It's warm and cloudy. Take your time." 
            : "Cloudy skies. Perfect focus weather.";
        } else if (code >= 45 && code <= 48) {
          feeling = "Foggy outside. Take things one step at a time.";
        } else if (code >= 51 && code <= 67) {
          feeling = "Gentle rain is falling. Stay cozy indoors.";
        } else if (code >= 71 && code <= 77) {
          feeling = "Snow is drifting down. A quiet day for deep thoughts.";
        } else if (code >= 80 && code <= 99) {
          feeling = "Stormy weather. Keep warm and stay anchored.";
        } else {
          feeling = temp >= 28 
            ? "It's quite warm today. Make sure to pace yourself." 
            : "The world is quiet. A gentle day ahead.";
        }

        if (active) {
          setContext(feeling);
        }
      } catch (e) {
        // Silently keep the default fallback if adblockers/offline prevents fetch
      }
    }

    fetchGentleWeather();

    return () => { active = false; };
  }, []);

  return (
    <motion.span 
      key={context} 
      initial={{ opacity: 0, filter: 'blur(2px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="inline-block"
    >
      {context}
    </motion.span>
  );
}
