const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock weather database
const weatherData = [
  {
    id: 1,
    city: "New York",
    temperature: 22,
    country: "USA",
    condition: "Sunny",
    humidity: 65,
    windSpeed: 15
  },
  {
    id: 2,
    city: "London",
    temperature: 15,
    country: "UK",
    condition: "Cloudy",
    humidity: 80,
    windSpeed: 20
  },
  {
    id: 3,
    city: "Tokyo",
    temperature: 18,
    country: "Japan",
    condition: "Rainy",
    humidity: 75,
    windSpeed: 12
  },
  {
    id: 4,
    city: "Paris",
    temperature: 20,
    country: "France",
    condition: "Partly Cloudy",
    humidity: 70,
    windSpeed: 18
  },
  {
    id: 5,
    city: "Sydney",
    temperature: 25,
    country: "Australia",
    condition: "Sunny",
    humidity: 60,
    windSpeed: 10
  },
  {
    id: 6,
    city: "Dubai",
    temperature: 35,
    country: "UAE",
    condition: "Hot",
    humidity: 45,
    windSpeed: 8
  },
  {
    id: 7,
    city: "Toronto",
    temperature: 12,
    country: "Canada",
    condition: "Windy",
    humidity: 55,
    windSpeed: 25
  },
  {
    id: 8,
    city: "Berlin",
    temperature: 16,
    country: "Germany",
    condition: "Clear",
    humidity: 68,
    windSpeed: 14
  }
];

// GET - Get weather by city name
app.get('/weather/:city', (req, res) => {
  const cityName = req.params.city.toLowerCase();
  
  const cityData = weatherData.find(city => 
    city.city.toLowerCase() === cityName
  );

  if (cityData) {
    res.json({
      success: true,
      data: {
        city: cityData.city,
        temperature: cityData.temperature,
        country: cityData.country,
        condition: cityData.condition,
        humidity: cityData.humidity,
        windSpeed: cityData.windSpeed,
        unit: "celsius"
      },
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({
      success: false,
      error: `City '${req.params.city}' not found`,
      availableCities: weatherData.map(city => city.city)
    });
  }
});

// GET - Get all cities weather
app.get('/weather', (req, res) => {
  res.json({
    success: true,
    data: weatherData,
    count: weatherData.length,
    timestamp: new Date().toISOString()
  });
});

// GET - Search weather by country
app.get('/weather/country/:country', (req, res) => {
  const countryName = req.params.country.toLowerCase();
  
  const countryData = weatherData.filter(city => 
    city.country.toLowerCase().includes(countryName)
  );

  if (countryData.length > 0) {
    res.json({
      success: true,
      data: countryData,
      count: countryData.length,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({
      success: false,
      error: `No cities found in country '${req.params.country}'`
    });
  }
});

// GET - Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Healthy',
    service: 'Weather API',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`
  });
});

// GET - Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🌤️ Welcome to Weather API',
    description: 'Simple REST API with mock weather data',
    version: '1.0.0',
    endpoints: {
      'Get weather by city': 'GET /weather/:city',
      'Get all cities': 'GET /weather',
      'Search by country': 'GET /weather/country/:country',
      'Health check': 'GET /health'
    },
    examples: [
      '/weather/london',
      '/weather/tokyo', 
      '/weather/country/usa',
      '/health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Weather API server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Available cities: ${weatherData.map(c => c.city).join(', ')}`);
});