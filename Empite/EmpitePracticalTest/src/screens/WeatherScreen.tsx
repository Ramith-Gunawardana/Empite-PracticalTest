import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { requestLocationPermission } from '../utils/locationUtils';
import { getWeatherForecast, WeatherDay } from '../services/weatherService';
import { LoadingView, WeatherCard } from '../components';

interface WeatherItem {
  id: string;
  date: string;
  tempDay: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  clouds: number;
}

const WeatherScreen = () => {
  const { signOut } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    requestLocationPermission({
      onSuccess: (location) => {
        setLocation(location);
        fetchWeatherData(location.latitude, location.longitude);
      },
      onError: () => setLoading(false),
      permissionMessage: 'This app needs access to your location for weather forecast.',
      deniedMessage: 'Location permission is required for weather data.',
      errorMessage: 'Could not get your location. Using default location.',
    });
  }, []);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const data = await getWeatherForecast(latitude, longitude);
      
      const formattedData: WeatherItem[] = data.list.map((day: WeatherDay, index: number) => ({
        id: `day-${day.dt}`,
        date: new Date(day.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        tempDay: day.temp.day,
        tempMin: day.temp.min,
        tempMax: day.temp.max,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        humidity: day.humidity,
        clouds: day.clouds,
      }));

      setWeatherData(formattedData);
    } catch (error: any) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', error.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (location) {
      setRefreshing(true);
      fetchWeatherData(location.latitude, location.longitude);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderWeatherItem = ({ item }: { item: WeatherItem }) => (
    <WeatherCard
      date={item.date}
      tempDay={item.tempDay}
      tempMin={item.tempMin}
      tempMax={item.tempMax}
      description={item.description}
      icon={item.icon}
      humidity={item.humidity}
      clouds={item.clouds}
    />
  );

  if (loading) {
    return <LoadingView message="Loading weather forecast..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>16-Day Weather Forecast</Text>
          {location && (
            <Text style={styles.locationText}>
              📍 {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={weatherData}
        renderItem={renderWeatherItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  signOutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ff4444',
    borderRadius: 6,
  },
  signOutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
});

export default WeatherScreen;
