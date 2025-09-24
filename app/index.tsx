import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentPosition, openLocationSettings } from '../hooks/useCurrentPosition';
import { useObservations } from '../hooks/useObservations';
import { LocationLoading } from '../components/LocationLoading';
import { LocationError } from '../components/LocationError';
import { MapboxMap } from '../components/MapboxMap';
import { useEffect } from 'react';
import { Observation } from '../types/observation';

export default function Index() {
  const router = useRouter();
  const {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
  } = useCurrentPosition();

  const { observations, isLoading, error: observationsError } = useObservations();

  // Demande automatique de permission au démarrage
  useEffect(() => {
    if (permissionStatus === 'undetermined' && !loading) {
      requestPermission();
    }
  }, [permissionStatus, loading, requestPermission]);

  const handleOpenSettings = () => {
    openLocationSettings();
  };

  const handleMapReady = () => {
    // Carte prête
  };

  const handleMapPress = (latitude: number, longitude: number) => {
    router.push({
      pathname: '/observation' as any,
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        id: 'new'
      }
    });
  };

  const handleMarkerPress = (observation: Observation) => {
    router.push({
      pathname: '/observation' as any,
      params: {
        latitude: observation.latitude.toString(),
        longitude: observation.longitude.toString(),
        id: observation.id
      }
    });
  };

  // Écran de chargement
  if (loading || isLoading) {
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
          observations={observations}
          onMapPress={handleMapPress}
          onMarkerPress={handleMarkerPress}
          style={styles.mapFullScreen}
        />
        
        {observations.length > 0 && (
          <View style={styles.observationsIndicator}>
            <Text style={styles.observationsText}>
              {observations.length} observation{observations.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    );
  }

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
  observationsIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  observationsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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