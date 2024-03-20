require('dotenv').config(); // Loads .env file contents into process.env

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // You can use any port

// Serve your static files (HTML, CSS, JS)
app.use(express.static('.')); // Assuming your HTML, CSS, JS files are in a directory named 'public'

// Example route that uses an environment variable
app.get('/api/key', (req, res) => {
    // NEVER directly send sensitive keys like this in production
    // This is just an example to show how to access environment variables
    res.send({ key: process.env.LOCATIONIQ_KEY });
});

app.get('/api/location', async (req, res) => {
    const { lat, lon } = req.query; // Latitude and longitude from the client
    const apiKey = process.env.LOCATIONIQ_KEY; // Your LocationIQ API key from .env
  
    try {
      const response = await axios.get(`https://us1.locationiq.com/v1/reverse.php`, {
        params: {
          key: apiKey,
          lat,
          lon,
          format: 'json'
        }
      });
      res.json(response.data); // Send back the relevant data to the client
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching location data');
    }
  });

// New route for weather data
app.get('/api/weather', async (req, res) => {
    const { latitude, longitude } = req.query;
    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,apparent_temperature,precipitation,weather_code',
          // Add other parameters as needed
          hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m',
          daily: 'temperature_2m_max,temperature_2m_min',
          timezone: 'auto'
        }
      });
      res.json(response.data); // Send the API response to the client
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching weather data');
    }
  });

  app.get('/api/autocomplete', async (req, res) => {
    const query = req.query.q; // Assuming 'q' is the query parameter from the client
    const apiKey = process.env.LOCATIONIQ_KEY; // Your LocationIQ API key from .env
  
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete.php`, {
        params: {
          key: apiKey,
          q: query,
          format: "json",
          limit: 5
        }
      });
      res.json(response.data); // Send back the API response to the client
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching autocomplete data');
    }
  });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
