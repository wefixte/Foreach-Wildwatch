import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useCurrentPosition, openLocationSettings } from '../hooks/useCurrentPosition';
import { LocationLoading } from '../components/LocationLoading';
import { LocationError } from '../components/LocationError';
import { MapboxMap } from '../components/MapboxMap';
import { useEffect } from 'react';

export default function Index() {
  const {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
  } = useCurrentPosition();

  // Demande automatique de permission au démarrage
  useEffect(() => {
    if (permissionStatus === 'undetermined' && !loading) {
      console.log('Demande de permission...');
      requestPermission();
    }
  }, [permissionStatus, loading, requestPermission]);

  const handleOpenSettings = () => {
    openLocationSettings();
  };

  const handleMapReady = () => {
    console.log('Carte Mapbox prête');
  };

  // Écran de chargement
  if (loading) {
    return <LocationLoading message="Chargement de la carte..." />;
  }

  // Écran d'erreur
  if (error && !location) {
    return (
      <LocationError
        error={error}
        onRetry={refreshLocation}
        onOpenSettings={handleOpenSettings}
      />
    );
  }

  // Écran principal
  if (location) {
    return (
      <View style={styles.container}>
        <MapboxMap
          location={location}
          onMapReady={handleMapReady}
          style={styles.mapFullScreen}
        />
      </View>
    );
  }

  // Fallback
  return (
    <View style={styles.errorContainer}>
      <LocationLoading message="Initialisation..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapFullScreen: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});