import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface WeatherCardProps {
  date: string;
  tempDay: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  clouds: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  date,
  tempDay,
  tempMin,
  tempMax,
  description,
  icon,
  humidity,
  clouds,
}) => {
  const getWeatherIconUrl = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <View style={styles.weatherCard}>
      <View style={styles.weatherHeader}>
        <View>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <Image
          source={{ uri: getWeatherIconUrl(icon) }}
          style={styles.weatherIcon}
        />
      </View>
      <View style={styles.weatherDetails}>
        <View style={styles.tempContainer}>
          <Text style={styles.tempText}>{formatTemp(tempDay)}</Text>
          <View style={styles.minMaxContainer}>
            <Text style={styles.minMaxText}>↓ {formatTemp(tempMin)}</Text>
            <Text style={styles.minMaxText}>↑ {formatTemp(tempMax)}</Text>
          </View>
        </View>
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>💧 {Math.round(humidity)}%</Text>
          <Text style={styles.infoText}>☁️ {Math.round(clouds)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weatherIcon: {
    width: 60,
    height: 60,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
  },
  tempText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  minMaxContainer: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  minMaxText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  additionalInfo: {
    alignItems: 'flex-end',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
