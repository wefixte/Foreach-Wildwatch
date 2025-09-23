import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LocationLoadingProps {
  message?: string;
}

export const LocationLoading: React.FC<LocationLoadingProps> = ({ 
  message = 'Récupération de votre position...' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
