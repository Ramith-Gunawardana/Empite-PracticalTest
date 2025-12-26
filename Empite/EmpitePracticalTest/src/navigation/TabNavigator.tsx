import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import WeatherScreen from '../screens/WeatherScreen';
import RestaurantScreen from '../screens/RestaurantScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          title: 'Weather Forecast',
          tabBarLabel: 'Weather',
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>☀️</Text>
          )
        }}
      />
      <Tab.Screen
        name="Restaurants"
        component={RestaurantScreen}
        options={{
          title: 'Nearby Restaurants',
          tabBarLabel: 'Restaurants',
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>🍴</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
