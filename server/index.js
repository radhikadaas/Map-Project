require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const ORS_API_KEY = process.env.ORS_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Default home route
app.get('/', (req, res) => res.send('API Running ✅'));

// POST and GET endpoints

// 1. Save Journey
app.post('/journeys', async (req, res) => {
  const { name, user_id, source, destination, path, transport_mode } = req.body;
  
  const { data, error } = await supabase
    .from('journeys')
    .insert([{ name, user_id, source, destination, path, transport_mode }]);

  if (error) return res.status(500).json({ error: error.message });
  
  res.status(201).json({ message: 'Journey saved!', journey: data });
});

// 2. Get All Journeys
app.get('/journeys', async (req, res) => {
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  
  res.json(data);
});

// 3. Get Single Journey by ID
app.get('/journeys/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

const axios = require('axios'); // Add this at the top if not already imported

// 4. Get Real Road Route using OpenRouteService
app.post('/route', async (req, res) => {
  const { source, destination } = req.body;

  try {
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        coordinates: [
          [source.lng, source.lat],
          [destination.lng, destination.lat]
        ]
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch route from ORS' });
  }
});


app.listen(5000, () => console.log('Server running on http://localhost:5000'));
