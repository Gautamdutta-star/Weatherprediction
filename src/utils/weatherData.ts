import {
  WeatherData,
  ForecastDay,
  HourlyForecast,
  WeatherAlert,
} from '../types/weather';


// ==========================================
// OPEN-METEO API
// ==========================================

const GEOCODING_API =
  'https://geocoding-api.open-meteo.com/v1/search';

const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast';


// ==========================================
// TYPES
// ==========================================

interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface WeatherAPIResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    surface_pressure: number;
    wind_speed_10m: number;
    visibility: number;
    uv_index: number;
  };

  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
}


// ==========================================
// WEATHER CODE → CONDITION
// ==========================================

const getWeatherInfo = (code: number) => {

  if (code === 0) {
    return {
      condition: 'Sunny',
      description: 'Clear skies',
      icon: '☀️',
    };
  }

  if (code === 1 || code === 2) {
    return {
      condition: 'Partly Cloudy',
      description: 'Partly cloudy',
      icon: '⛅',
    };
  }

  if (code === 3) {
    return {
      condition: 'Cloudy',
      description: 'Overcast',
      icon: '☁️',
    };
  }

  if (
    code === 45 ||
    code === 48
  ) {
    return {
      condition: 'Foggy',
      description: 'Foggy conditions',
      icon: '🌫️',
    };
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 56 ||
    code === 57
  ) {
    return {
      condition: 'Drizzle',
      description: 'Light drizzle',
      icon: '🌦️',
    };
  }

  if (
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67
  ) {
    return {
      condition: 'Rainy',
      description: 'Rain',
      icon: '🌧️',
    };
  }

  if (
    code === 71 ||
    code === 73 ||
    code === 75 ||
    code === 77
  ) {
    return {
      condition: 'Snow',
      description: 'Snow',
      icon: '🌨️',
    };
  }

  if (
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return {
      condition: 'Rainy',
      description: 'Rain showers',
      icon: '🌦️',
    };
  }

  if (
    code === 85 ||
    code === 86
  ) {
    return {
      condition: 'Snow',
      description: 'Snow showers',
      icon: '🌨️',
    };
  }

  if (
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return {
      condition: 'Stormy',
      description: 'Thunderstorms',
      icon: '⛈️',
    };
  }

  return {
    condition: 'Cloudy',
    description: 'Cloudy',
    icon: '☁️',
  };
};


// ==========================================
// FIND CITY COORDINATES
// ==========================================

const getLocation = async (
  city: string
): Promise<LocationData> => {

  const url =
    `${GEOCODING_API}?name=${encodeURIComponent(city)}` +
    `&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to find the location.');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`Location "${city}" not found.`);
  }

  const result = data.results[0];

  return {
    name: result.name,
    country: result.country || '',
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || 'auto',
  };
};


// ==========================================
// GET CURRENT WEATHER
// ==========================================

export const getCurrentWeather = async (
  city: string
): Promise<WeatherData> => {

  const location = await getLocation(city);

  const url =
    `${WEATHER_API}?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    `&current=` +
    `temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `weather_code,surface_pressure,wind_speed_10m,visibility,uv_index` +
    `&daily=sunrise,sunset` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to fetch weather data.');
  }

  const data: WeatherAPIResponse = await response.json();

  const weatherInfo =
    getWeatherInfo(data.current.weather_code);

  // Open-Meteo visibility is returned in meters.
  // Convert meters → miles because CurrentWeather.tsx
  // converts miles → kilometers.
  const visibilityMiles =
    data.current.visibility / 1609.344;

  return {

    city: location.name,

    country: location.country,

    // Keep Fahrenheit here because CurrentWeather.tsx
    // converts Fahrenheit → Celsius.
    temperature:
      Math.round(data.current.temperature_2m),

    condition:
      weatherInfo.condition,

    description:
      weatherInfo.description,

    humidity:
      Math.round(data.current.relative_humidity_2m),

    // Keep mph because CurrentWeather.tsx
    // converts mph → km/h.
    windSpeed:
      Math.round(data.current.wind_speed_10m),

    pressure:
      Math.round(data.current.surface_pressure),

    visibility:
      Math.round(visibilityMiles * 10) / 10,

    uvIndex:
      Math.round(data.current.uv_index),

    sunrise:
      formatTime(data.daily.sunrise[0]),

    sunset:
      formatTime(data.daily.sunset[0]),

    icon:
      weatherInfo.icon,
  };
};


// ==========================================
// GET 5-DAY FORECAST
// ==========================================

export const getForecast = async (
  city: string
): Promise<ForecastDay[]> => {

  const location = await getLocation(city);

  const url =
    `${WEATHER_API}?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    `&current=temperature_2m` +
    `&hourly=temperature_2m,precipitation_probability,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
    `precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=auto` +
    `&forecast_days=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to fetch forecast data.');
  }

  const data: WeatherAPIResponse = await response.json();

  const forecast: ForecastDay[] =
    data.daily.time.map((date, index) => {

      const weatherInfo =
        getWeatherInfo(
          data.daily.weather_code[index]
        );

      // Find hourly data for this particular day.
      const dayHourly: HourlyForecast[] = [];

      for (
        let i = 0;
        i < data.hourly.time.length;
        i++
      ) {

        const hourDate =
          data.hourly.time[i].split('T')[0];

        if (hourDate === date) {

          dayHourly.push({
            time:
              formatHour(
                data.hourly.time[i]
              ),

            temperature:
              Math.round(
                data.hourly.temperature_2m[i]
              ),

            condition:
              getWeatherInfo(
                data.hourly.weather_code[i]
              ).condition,

            precipitation:
              data.hourly
                .precipitation_probability[i] ?? 0,

            icon:
              getWeatherInfo(
                data.hourly.weather_code[i]
              ).icon,
          });
        }
      }

      return {

        date:
          formatDate(date),

        day:
          getDayName(date, index),

        high:
          Math.round(
            data.daily.temperature_2m_max[index]
          ),

        low:
          Math.round(
            data.daily.temperature_2m_min[index]
          ),

        condition:
          weatherInfo.condition,

        description:
          weatherInfo.description,

        precipitation:
          data.daily
            .precipitation_probability_max[index] ?? 0,

        humidity: 0,

        windSpeed:
          Math.round(
            data.daily.wind_speed_10m_max[index]
          ),

        icon:
          weatherInfo.icon,

        hourly:
          dayHourly,
      };
    });

  return forecast;
};


// ==========================================
// WEATHER ALERTS
// ==========================================

export const getWeatherAlerts =
  async (): Promise<WeatherAlert[]> => {

    // Open-Meteo forecast endpoint does not provide
    // official government weather alerts in this app.
    // Return an empty list instead of fake alerts.

    return [];
  };


// ==========================================
// SEARCH CITIES
// ==========================================

export const searchCities = async (
  query: string
): Promise<string[]> => {

  if (!query.trim()) {
    return [];
  }

  try {

    const url =
      `${GEOCODING_API}?name=${encodeURIComponent(query)}` +
      `&count=5&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map(
      (result: any) => result.name
    );

  } catch (error) {

    console.error(
      'City search error:',
      error
    );

    return [];
  }
};


// ==========================================
// HELPER FUNCTIONS
// ==========================================

const formatTime = (
  isoTime: string
): string => {

  const date = new Date(isoTime);

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};


const formatHour = (
  isoTime: string
): string => {

  const date = new Date(isoTime);

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};


const formatDate = (
  dateString: string
): string => {

  const date =
    new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString();
};


const getDayName = (
  dateString: string,
  index: number
): string => {

  if (index === 0) {
    return 'Today';
  }

  if (index === 1) {
    return 'Tomorrow';
  }

  const date =
    new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
  });
};
