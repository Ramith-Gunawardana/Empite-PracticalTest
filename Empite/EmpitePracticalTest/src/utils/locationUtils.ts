import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationOptions {
  onSuccess: (location: LocationCoords) => void;
  onError?: () => void;
  permissionMessage?: string;
  deniedMessage?: string;
  errorMessage?: string;
  defaultLocation?: LocationCoords;
}

/**
 * Default fallback location (Colombo)
 */
const DEFAULT_LOCATION: LocationCoords = {
  latitude: 6.9271,
  longitude: 79.8612,
};

/**
 * Request location permission and get current location
 */
export const requestLocationPermission = async (options: LocationOptions): Promise<void> => {
  const {
    onSuccess,
    onError,
    permissionMessage = 'This app needs access to your location.',
    deniedMessage = 'Location permission is required.',
    errorMessage = 'Could not get your location. Using default location.',
    defaultLocation = DEFAULT_LOCATION,
  } = options;

  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: permissionMessage,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation(onSuccess, onError, errorMessage, defaultLocation);
      } else {
        Alert.alert('Permission Denied', deniedMessage);
        if (onError) {
          onError();
        }
      }
    } else {
      // iOS - permissions handled via Info.plist
      getCurrentLocation(onSuccess, onError, errorMessage, defaultLocation);
    }
  } catch (err) {
    console.warn('Permission request error:', err);
    Alert.alert('Error', 'Failed to request location permission');
    if (onError) {
      onError();
    }
  }
};

/**
 * Get current device location
 */
const getCurrentLocation = (
  onSuccess: (location: LocationCoords) => void,
  onError?: () => void,
  errorMessage: string = 'Could not get your location. Using default location.',
  defaultLocation: LocationCoords = DEFAULT_LOCATION
): void => {
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      onSuccess({ latitude, longitude });
    },
    (error) => {
      console.error('Location Error:', error);
      Alert.alert('Location Error', errorMessage);
      // Use default location on error
      onSuccess(defaultLocation);
      if (onError) {
        onError();
      }
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};
