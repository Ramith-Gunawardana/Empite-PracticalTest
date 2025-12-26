import axios from 'axios';
import { Config } from '../config/env';

export interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
}

export interface PlacesResponse {
  results: Restaurant[];
  status: string;
  error_message?: string;
}

/**
 * Fetch nearby restaurants using Vercel serverless proxy
 * This keeps the API key secure on the server side
 */
export const getNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  radius: number = 1500
): Promise<Restaurant[]> => {
  try {
    // Call Vercel serverless function instead of direct Google API
    const response = await axios.post<PlacesResponse>(
      Config.PLACES_API_URL,
      {
        latitude,
        longitude,
        radius,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (response.data.status === 'OK') {
      console.log('Places API Result:', response.data);
      return response.data.results;
    } else {
      console.warn('Places API status:', response.data.status);
      console.warn('Places API error:', response.data);
      return generateSampleRestaurants(latitude, longitude);
    }
  } catch (error: any) {
    console.error('Places API Error Message:', error.message);
    console.error('Places API Error:', error.response?.data);
    console.warn('Loading sample restaurant data...');
    return generateSampleRestaurants(latitude, longitude);
  }
};

/**
 * Generate sample restaurant data for testing/fallback
 */
const generateSampleRestaurants = (
  latitude: number,
  longitude: number
): Restaurant[] => {
  const restaurantNames = [
    "Joe's Pizza",
    'Sushi Paradise',
    'Burger Haven',
    'Pasta Palace',
    'Taco Fiesta',
    'Indian Spice',
    'Thai Kitchen',
    'Chinese Garden',
    'Mediterranean Grill',
    'Coffee & Bistro',
  ];

  return restaurantNames.map((name, index) => {
    const offsetLat = (Math.random() - 0.5) * 0.01;
    const offsetLng = (Math.random() - 0.5) * 0.01;

    return {
      place_id: `sample_${index}`,
      name,
      vicinity: `${Math.floor(Math.random() * 500) + 100} Sample Street`,
      geometry: {
        location: {
          lat: latitude + offsetLat,
          lng: longitude + offsetLng,
        },
      },
      rating: 3.5 + Math.random() * 1.5,
      user_ratings_total: Math.floor(Math.random() * 500) + 50,
      price_level: Math.floor(Math.random() * 4) + 1,
      opening_hours: {
        open_now: Math.random() > 0.3,
      },
      types: ['restaurant', 'food', 'point_of_interest'],
    };
  });
};
