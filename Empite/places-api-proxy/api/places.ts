import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { latitude, longitude, radius = 1500 } = req.body;

    // Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Missing required parameters: latitude and longitude' 
      });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured on server' 
      });
    }

    // Call Google Places API
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/nearbysearch/json`,
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'restaurant',
          key: GOOGLE_PLACES_API_KEY,
        },
      }
    );

    // Return the results
    return res.status(200).json(response.data);

  } catch (error: any) {
    console.error('Places API Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch places data',
      details: error.response?.data || error.message
    });
  }
}
