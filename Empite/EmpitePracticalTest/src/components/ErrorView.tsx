import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorViewProps {
  message: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 16,
    color: '#ff4444',
  },
});
