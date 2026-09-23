import React from 'react';
import {
  Eye,
  Droplets,
  Wind,
  Gauge,
  Sun,
  Sunset,
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {

  // Convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (fahrenheit: number) => {
    return Math.round(((fahrenheit - 32) * 5) / 9);
  };

  // Convert mph to km/h
  const mphToKmh = (mph: number) => {
    return Math.round(mph * 1.60934);
  };

  // Convert miles to kilometers
  const milesToKm = (miles: number) => {
    return Math.round(miles * 1.60934 * 10) / 10;
  };

  const temperatureC = fahrenheitToCelsius(weather.temperature);

  // Keep the same "feels like" logic, but convert the result to Celsius
  const feelsLikeF =
    weather.temperature + Math.floor(Math.random() * 6) - 3;

  const feelsLikeC = fahrenheitToCelsius(feelsLikeF);

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-400';
    if (uvIndex <= 5) return 'text-yellow-400';
    if (uvIndex <= 7) return 'text-orange-400';
    if (uvIndex <= 10) return 'text-red-400';
    return 'text-purple-400';
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold mb-2">
            {weather.city}
          </h1>

          <p className="text-white/80 text-lg">
            {weather.country}
          </p>
        </div>

        <div className="text-right">
          <div className="text-6xl mb-2">
            {weather.icon}
          </div>

          <p className="text-white/80">
            {weather.condition}
          </p>
        </div>

      </div>


      {/* Temperature */}
      <div className="flex items-center justify-between mb-8">

        <div className="flex items-baseline">

          <span className="text-7xl font-thin">
            {temperatureC}
          </span>

          <span className="text-3xl font-light ml-2">
            °C
          </span>

        </div>

        <div className="text-right">

          <p className="text-xl text-white/90 mb-1">
            {weather.description}
          </p>

          <p className="text-white/70">
            Feels like {feelsLikeC}°C
          </p>

        </div>

      </div>


      {/* Weather Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {/* Humidity */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Droplets className="w-5 h-5 text-blue-300" />

            <span className="text-white/80 text-sm">
              Humidity
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {weather.humidity}%
          </p>

        </div>


        {/* Wind Speed */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Wind className="w-5 h-5 text-green-300" />

            <span className="text-white/80 text-sm">
              Wind Speed
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {mphToKmh(weather.windSpeed)} km/h
          </p>

        </div>


        {/* Pressure */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Gauge className="w-5 h-5 text-yellow-300" />

            <span className="text-white/80 text-sm">
              Pressure
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {weather.pressure} mb
          </p>

        </div>


        {/* Visibility */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Eye className="w-5 h-5 text-purple-300" />

            <span className="text-white/80 text-sm">
              Visibility
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {milesToKm(weather.visibility)} km
          </p>

        </div>

      </div>


      {/* UV / Sunrise / Sunset */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* UV Index */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Sun
              className={`w-5 h-5 ${getUVIndexColor(
                weather.uvIndex
              )}`}
            />

            <span className="text-white/80 text-sm">
              UV Index
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {weather.uvIndex}
          </p>

          <p
            className={`text-sm ${getUVIndexColor(
              weather.uvIndex
            )}`}
          >
            {getUVIndexLabel(weather.uvIndex)}
          </p>

        </div>


        {/* Sunrise */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Sun className="w-5 h-5 text-orange-300" />

            <span className="text-white/80 text-sm">
              Sunrise
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {weather.sunrise}
          </p>

        </div>


        {/* Sunset */}
        <div className="bg-white/10 rounded-xl p-4">

          <div className="flex items-center gap-3 mb-2">

            <Sunset className="w-5 h-5 text-orange-300" />

            <span className="text-white/80 text-sm">
              Sunset
            </span>

          </div>

          <p className="text-2xl font-semibold">
            {weather.sunset}
          </p>

        </div>

      </div>

    </div>
  );
};
