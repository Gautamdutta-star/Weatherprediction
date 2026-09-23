import React, { useState } from 'react';
import { ChevronRight, Droplets, Wind } from 'lucide-react';
import { ForecastDay } from '../types/weather';

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Fahrenheit → Celsius
  const fahrenheitToCelsius = (fahrenheit: number) => {
    return Math.round(((fahrenheit - 32) * 5) / 9);
  };

  // mph → km/h
  const mphToKmh = (mph: number) => {
    return Math.round(mph * 1.60934);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">

      <h2 className="text-2xl font-bold mb-6">
        5-Day Forecast
      </h2>

      <div className="space-y-3">

        {forecast.map((day, index) => (

          <div key={index} className="space-y-3">

            {/* Forecast Day */}
            <button
              onClick={() =>
                setSelectedDay(selectedDay === index ? null : index)
              }
              className="w-full bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-200 flex items-center justify-between"
            >

              {/* Day Information */}
              <div className="flex items-center gap-4">

                <div className="text-2xl">
                  {day.icon}
                </div>

                <div className="text-left">

                  <p className="font-semibold">
                    {day.day}
                  </p>

                  <p className="text-white/70 text-sm">
                    {day.date}
                  </p>

                </div>

              </div>


              {/* Weather Information */}
              <div className="flex items-center gap-6">

                <div className="text-right">

                  <p className="font-semibold">
                    {day.condition}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-white/70">

                    {/* Precipitation */}
                    <Droplets className="w-3 h-3" />

                    <span>
                      {day.precipitation}%
                    </span>

                    {/* Wind */}
                    <Wind className="w-3 h-3 ml-2" />

                    <span>
                      {mphToKmh(day.windSpeed)} km/h
                    </span>

                  </div>

                </div>


                {/* High / Low Temperature */}
                <div className="text-right min-w-[100px]">

                  <div className="flex items-center gap-2">

                    <span className="text-xl font-semibold">
                      {fahrenheitToCelsius(day.high)}°C
                    </span>

                    <span className="text-white/60">
                      {fahrenheitToCelsius(day.low)}°C
                    </span>

                  </div>

                </div>


                {/* Expand Arrow */}
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-200 ${
                    selectedDay === index ? 'rotate-90' : ''
                  }`}
                />

              </div>

            </button>


            {/* Hourly Forecast */}
            {selectedDay === index && (

              <div className="bg-white/5 rounded-xl p-4 ml-4">

                <h4 className="font-semibold mb-4">
                  Hourly Forecast
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">

                  {day.hourly
                    .filter((_, i) => i % 4 === 0)
                    .map((hour, hourIndex) => (

                      <div
                        key={hourIndex}
                        className="bg-white/10 rounded-lg p-3 text-center"
                      >

                        {/* Time */}
                        <p className="text-sm text-white/70 mb-1">
                          {hour.time}
                        </p>

                        {/* Weather Icon */}
                        <div className="text-lg mb-1">
                          {hour.icon}
                        </div>

                        {/* Temperature */}
                        <p className="font-semibold">
                          {fahrenheitToCelsius(hour.temperature)}°C
                        </p>

                        {/* Precipitation */}
                        <div className="flex items-center justify-center gap-1 mt-1">

                          <Droplets className="w-3 h-3 text-blue-300" />

                          <span className="text-xs text-white/70">
                            {hour.precipitation}%
                          </span>

                        </div>

                      </div>

                    ))}

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
};
