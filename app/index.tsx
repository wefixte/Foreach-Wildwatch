import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useCurrentPosition, openLocationSettings } from '../hooks/useCurrentPosition';
import { LocationLoading } from '../components/LocationLoading';
import { LocationUnauthorized } from '../components/LocationUnauthorized';
import { LocationError } from '../components/LocationError';
import { MapboxMap } from '../components/MapboxMap';
import { LocationDisplay } from '../components/LocationDisplay';

export default function Index() {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
  } = useCurrentPosition();

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Permission refusée',
        'La localisation est nécessaire pour afficher la carte. Voulez-vous ouvrir les paramètres ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Ouvrir les paramètres', onPress: openLocationSettings }
        ]
      );
    }
  };

  const handleOpenSettings = () => {
    openLocationSettings();
  };

  const handleMapReady = () => {
    console.log('Carte Mapbox prête');
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Écran de chargement
  if (loading && !location && !error) {
    return <LocationLoading message="Chargement de la carte..." />;
  }

  // Écran d'autorisation
  if (permissionStatus?.status !== 'granted' && !loading && !error) {
    return (
      <LocationUnauthorized
        onRequestPermission={handleRequestPermission}
        onOpenSettings={handleOpenSettings}
      />
    );
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
        {/* Carte Mapbox */}
        <MapboxMap
          location={location}
          onMapReady={handleMapReady}
          style={showDetails ? styles.mapWithDetails : styles.mapFullScreen}
        />
        
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={toggleDetails}
          >
            <Text style={styles.floatingButtonText}>
              {showDetails ? '️' : 'ℹ️'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDetails && (
          <View style={styles.detailsPanel}>
            <ScrollView style={styles.detailsScrollView}>
              <LocationDisplay
                location={location}
                onRefresh={refreshLocation}
                refreshing={loading}
              />
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Erreur: {error}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  // Fallback
  return (
    <View style={styles.errorContainer}>
      <LocationLoading message="Erreur lors du chargement de la carte" />
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
  mapWithDetails: {
    flex: 0.6,
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 20,
  },
  detailsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '50%',
  },
  detailsScrollView: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
});