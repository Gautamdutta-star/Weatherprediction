import {
  WeatherData,
  ForecastDay,
  HourlyForecast,
  WeatherAlert,
} from '../types/weather';

// Mock weather data
export const getCurrentWeather = async (
  city: string
): Promise<WeatherData> => {

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Available weather conditions
  // Snow has been removed
  const weatherConditions = [
    {
      condition: 'Sunny',
      description: 'Clear skies',
      icon: '☀️',
    },
    {
      condition: 'Partly Cloudy',
      description: 'Some clouds',
      icon: '⛅',
    },
    {
      condition: 'Cloudy',
      description: 'Overcast',
      icon: '☁️',
    },
    {
      condition: 'Rainy',
      description: 'Light rain',
      icon: '🌧️',
    },
    {
      condition: 'Stormy',
      description: 'Thunderstorms',
      icon: '⛈️',
    },
  ];

  // Select random weather condition
  const randomWeather =
    weatherConditions[
      Math.floor(Math.random() * weatherConditions.length)
    ];

  // City → Country mapping
  const cityCountries: Record<string, string> = {
    // India
    Delhi: 'India',
    'New Delhi': 'India',
    Mumbai: 'India',
    Bengaluru: 'India',
    Kolkata: 'India',
    Chennai: 'India',
    Hyderabad: 'India',
    Pune: 'India',
    Ahmedabad: 'India',
    Jaipur: 'India',
    Bhubaneswar: 'India',
    Patna: 'India',
    Lucknow: 'India',
    Chandigarh: 'India',
    Kochi: 'India',

    // Nepal
    Kathmandu: 'Nepal',
    Pokhara: 'Nepal',
    Lalitpur: 'Nepal',
    Biratnagar: 'Nepal',
    Janakpur: 'Nepal',
  };

  const country = cityCountries[city] || 'US';

  return {
    city,
    country,

    // Temperature is generated in Fahrenheit
    temperature: Math.floor(Math.random() * 40) + 50,

    condition: randomWeather.condition,
    description: randomWeather.description,

    humidity: Math.floor(Math.random() * 40) + 40,

    // Wind speed in mph
    windSpeed: Math.floor(Math.random() * 20) + 5,

    pressure: Math.floor(Math.random() * 50) + 1000,

    // Visibility in miles
    visibility: Math.floor(Math.random() * 10) + 5,

    uvIndex: Math.floor(Math.random() * 11),

    sunrise: '6:42 AM',
    sunset: '7:28 PM',

    icon: randomWeather.icon,
  };
};


// ==========================================
// 5-DAY FORECAST
// ==========================================

export const getForecast = async (
  city: string
): Promise<ForecastDay[]> => {

  await new Promise(resolve => setTimeout(resolve, 300));

  const days = [
    'Today',
    'Tomorrow',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  // Snow is also removed from forecast
  const conditions = [
    {
      condition: 'Sunny',
      icon: '☀️',
    },
    {
      condition: 'Partly Cloudy',
      icon: '⛅',
    },
    {
      condition: 'Cloudy',
      icon: '☁️',
    },
    {
      condition: 'Rainy',
      icon: '🌧️',
    },
    {
      condition: 'Stormy',
      icon: '⛈️',
    },
  ];

  return days.map((day, index) => {

    // Random condition
    const randomCondition =
      conditions[
        Math.floor(Math.random() * conditions.length)
      ];

    // Base temperature in Fahrenheit
    const baseTemp =
      Math.floor(Math.random() * 20) + 60;

    // Hourly forecast
    const hourly: HourlyForecast[] = Array.from(
      { length: 24 },
      (_, hour) => ({
        time: `${hour
          .toString()
          .padStart(2, '0')}:00`,

        temperature:
          baseTemp +
          Math.floor(Math.random() * 10) -
          5,

        condition: randomCondition.condition,

        precipitation:
          Math.floor(Math.random() * 30),

        icon: randomCondition.icon,
      })
    );

    return {
      date: new Date(
        Date.now() +
          index * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),

      day,

      high:
        baseTemp +
        Math.floor(Math.random() * 10),

      low:
        baseTemp -
        Math.floor(Math.random() * 15),

      condition:
        randomCondition.condition,

      description:
        `${randomCondition.condition.toLowerCase()} skies`,

      precipitation:
        Math.floor(Math.random() * 50),

      humidity:
        Math.floor(Math.random() * 40) + 40,

      windSpeed:
        Math.floor(Math.random() * 15) + 5,

      icon:
        randomCondition.icon,

      hourly,
    };
  });
};


// ==========================================
// WEATHER ALERTS
// ==========================================

export const getWeatherAlerts = async (): Promise<WeatherAlert[]> => {

  const alerts: WeatherAlert[] = [
    {
      type: 'warning',
      title: 'Heat Wave Warning',
      description:
        'Extreme heat expected through the weekend. Stay hydrated and avoid prolonged sun exposure.',
      severity: 'severe',
    },
  ];

  return Math.random() > 0.7
    ? alerts
    : [];
};


// ==========================================
// CITY SEARCH
// ==========================================

export const searchCities = async (
  query: string
): Promise<string[]> => {

  const cities = [

    // India
    'Delhi',
    'New Delhi',
    'Mumbai',
    'Bengaluru',
    'Kolkata',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Bhubaneswar',
    'Patna',
    'Lucknow',
    'Chandigarh',
    'Kochi',

    // Nepal
    'Kathmandu',
    'Pokhara',
    'Lalitpur',
    'Biratnagar',
    'Janakpur',

    // United States
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'San Francisco',
    'Seattle',
    'Denver',
    'Boston',
  ];

  return cities
    .filter(city =>
      city
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 5);
};
