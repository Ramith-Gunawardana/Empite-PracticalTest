import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { requestLocationPermission } from '../utils/locationUtils';
import { getNearbyRestaurants, Restaurant } from '../services/placesService';
import { LoadingView, ErrorView } from '../components';

const RestaurantScreen = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    requestLocationPermission({
      onSuccess: async (location) => {
        setLocation(location);
        await fetchNearbyRestaurants(location.latitude, location.longitude);
        setLoading(false);
      },
      onError: () => setLoading(false),
      permissionMessage: 'This app needs access to your location to show nearby restaurants.',
      deniedMessage: 'Location permission is required to show restaurants.',
      errorMessage: 'Using default location.',
    });
  }, []);

  const fetchNearbyRestaurants = async (latitude: number, longitude: number) => {
    try {
      const data = await getNearbyRestaurants(latitude, longitude);
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const renderRestaurantInfo = () => {
    if (!selectedRestaurant) return null;

    return (
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={styles.infoTitleContainer}>
            <Text style={styles.infoTitle}>{selectedRestaurant.name}</Text>
            {selectedRestaurant.rating && (
              <Text style={styles.rating}>⭐ {selectedRestaurant.rating.toFixed(1)}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setSelectedRestaurant(null)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.vicinity}>{selectedRestaurant.vicinity}</Text>
        <View style={styles.infoDetails}>
          {selectedRestaurant.opening_hours && (
            <Text style={[styles.status, selectedRestaurant.opening_hours.open_now && styles.openNow]}>
              {selectedRestaurant.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingView message="Loading nearby restaurants..." />;
  }

  if (!location) {
    return <ErrorView message="Unable to get location" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.place_id}
            coordinate={{
              latitude: restaurant.geometry.location.lat,
              longitude: restaurant.geometry.location.lng,
            }}
            title={restaurant.name}
            description={restaurant.vicinity}
            onPress={() => setSelectedRestaurant(restaurant)}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerText}>🍽️</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {renderRestaurantInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerText: {
    fontSize: 20,
  },
  markerIcon: {
    width: 32,
    height: 32,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoTitleContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    padding: 4,
  },
  vicinity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  status: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '600',
  },
  openNow: {
    color: '#4CAF50',
  },
  priceLevel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});

export default RestaurantScreen;
