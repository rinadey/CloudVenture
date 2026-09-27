import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// OpenWeather API key - prefer environment variable, fallback to user-provided key
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'f9b52c2d776c20bcefeefc36c9fd405b';
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBuG8Z1BVICqtC7sfHGxGufVSUejsEG09c';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDnEf6c6YvEYnQzFvWaPGZX6r62ZJNhf68';

// API: Real Places from Google Places API (New)
app.get('/api/places', async (req, res) => {
  try {
    const city = req.query.city as string;
    const country = req.query.country as string;
    const weather = req.query.weather as string;
    const category = req.query.category as string;
    const timeOfDay = req.query.timeOfDay as string;
    const customQuery = req.query.query as string;

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    let query = `top attractions, landmarks and famous spots in ${city} ${country || ''}`;

    if (customQuery) {
      query = `${customQuery} in ${city} ${country || ''}`;
    } else if (category === 'food') {
      if (timeOfDay === 'morning') {
        query = `best breakfast cafes, bakeries, morning brunch and coffee in ${city} ${country || ''}`;
      } else if (timeOfDay === 'lunch') {
        query = `best lunch restaurants, bistros, local authentic food in ${city} ${country || ''}`;
      } else if (timeOfDay === 'tea') {
        query = `best afternoon tea, patisseries, dessert cafes in ${city} ${country || ''}`;
      } else if (timeOfDay === 'dinner' || timeOfDay === 'evening') {
        query = `best dinner restaurants, local dining, fine cuisine in ${city} ${country || ''}`;
      } else if (timeOfDay === 'night') {
        query = `best late night food, 24 hour cafes, midnight spots in ${city} ${country || ''}`;
      } else {
        query = `best local restaurants, famous food, cafes in ${city} ${country || ''}`;
      }
    } else if (weather) {
      const w = weather.toLowerCase();
      if (w.includes('rain') || w.includes('thunder') || w.includes('snow') || w.includes('drizzle')) {
        query = `top indoor museums, art galleries, and cozy cafes in ${city} ${country || ''}`;
      } else if (w.includes('clear') || w.includes('sun')) {
        query = `parks, gardens, scenic viewpoints, and vibrant outdoor spots in ${city} ${country || ''}`;
      }
    }

    const placesRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.primaryTypeDisplayName,places.location,places.websiteUri'
      },
      body: JSON.stringify({
        textQuery: query,
        pageSize: 6
      })
    });

    if (!placesRes.ok) {
      const errText = await placesRes.text();
      console.warn('Google Places API returned error:', errText);
      return res.status(placesRes.status).json({ error: 'Failed to fetch places', details: errText });
    }

    const placesData = await placesRes.json();
    return res.json(placesData.places || []);
  } catch (err: any) {
    console.error('Places route error:', err);
    return res.status(500).json({ error: 'Internal server error while fetching places' });
  }
});

// API: Geocode / Search city
app.get('/api/geocode', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=6&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(geoUrl);
    
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Geocoding failed', details: errText });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Geocoding error:', error);
    return res.status(500).json({ error: 'Internal server error while searching location' });
  }
});

// API: Complete weather (Current + 5-day / 3-hour Forecast + UV / details)
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat as string;
    const lon = req.query.lon as string;
    const city = req.query.city as string;

    let targetLat = lat;
    let targetLon = lon;

    // If city name is provided instead of coordinates, geocode first
    if ((!targetLat || !targetLon) && city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          targetLat = geoData[0].lat;
          targetLon = geoData[0].lon;
        }
      }
    }

    if (!targetLat || !targetLon) {
      return res.status(400).json({ error: 'Latitude and Longitude or a valid city name are required' });
    }

    // Fetch Current Weather & 5-Day Forecast in parallel
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${targetLat}&lon=${targetLon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok) {
      const errText = await currentRes.text();
      return res.status(currentRes.status).json({ error: 'Failed to fetch current weather', details: errText });
    }

    const currentData = await currentRes.json();
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    return res.json({
      current: currentData,
      forecast: forecastData,
      coordinates: { lat: Number(targetLat), lon: Number(targetLon) }
    });
  } catch (error: any) {
    console.error('Weather error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching weather' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloudventure server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
