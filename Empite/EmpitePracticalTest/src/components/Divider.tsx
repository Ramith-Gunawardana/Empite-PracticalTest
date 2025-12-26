import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface DividerProps {
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Divider: React.FC<DividerProps> = ({ text, style, textStyle }) => {
  if (text) {
    return (
      <View style={[styles.dividerWithText, style]}>
        <View style={styles.line} />
        <Text style={[styles.text, textStyle]}>{text}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  dividerWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  text: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
});
