import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text, Image } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Constants from 'expo-constants';
import { LocationData } from '../hooks/useCurrentPosition';
import { Observation } from '../types/observation';

const MAPBOX_ACCESS_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken || process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

const DEFAULT_MAP_CONFIG = {
  style: 'mapbox://styles/mapbox/streets-v12',
  zoomLevel: 15,
  minZoomLevel: 5,
  maxZoomLevel: 20,
} as const;

interface MapboxMapProps {
  location: LocationData;
  style?: any;
  onMapReady?: () => void;
  observations?: Observation[];
  onMapPress?: (latitude: number, longitude: number) => void;
  onMarkerPress?: (observation: Observation) => void;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ 
  location, 
  style, 
  onMapReady,
  observations = [],
  onMapPress,
  onMarkerPress
}) => {
  const mapRef = useRef<Mapbox.MapView>(null);

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('Mapbox access token is missing. Please check your .env file.');
      Alert.alert(
        'Configuration manquante',
        'Le token Mapbox est manquant. Veuillez vérifier votre fichier .env.',
        [{ text: 'OK' }]
      );
      return;
    }
    Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  }, []);

  const handleMapReady = () => {
    if (onMapReady) {
      onMapReady();
    }
  };

  const handleMapPress = (event: any) => {
    if (onMapPress) {
      const coords = event.coordinates || event.geometry?.coordinates || event.point;
      if (coords && coords.length >= 2) {
        const [longitude, latitude] = coords;
        onMapPress(latitude, longitude);
      }
    }
  };

  const handleMarkerPress = (observation: Observation) => {
    if (onMarkerPress) {
      onMarkerPress(observation);
    }
  };

  const centerCoordinate: [number, number] = [location.longitude, location.latitude];

  return (
    <View style={[styles.container, style]}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={DEFAULT_MAP_CONFIG.style}
        onDidFinishLoadingMap={handleMapReady}
        onPress={handleMapPress}
      >
        <Mapbox.Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={DEFAULT_MAP_CONFIG.zoomLevel}
          minZoomLevel={DEFAULT_MAP_CONFIG.minZoomLevel}
          maxZoomLevel={DEFAULT_MAP_CONFIG.maxZoomLevel}
          animationMode="flyTo"
          animationDuration={1000}
        />
        
        {/* Marqueur de position utilisateur */}
        <Mapbox.PointAnnotation
          id="user-location"
          coordinate={centerCoordinate}
        >
          <View style={styles.markerContainer}>
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </View>
        </Mapbox.PointAnnotation>

        {/* Marqueurs des observations */}
        {observations.map((observation) => (
          <Mapbox.PointAnnotation
            key={observation.id}
            id={`observation-${observation.id}`}
            coordinate={[observation.longitude, observation.latitude]}
            onSelected={() => handleMarkerPress(observation)}
          >
            <View style={styles.markerContainer}>
              {observation.imageUri ? (
                <View style={styles.observationMarkerWithImage}>
                  <Image 
                    source={{ uri: observation.imageUri }} 
                    style={styles.markerImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('Erreur de chargement de l\'image:', error.nativeEvent.error);
                    }}
                    onLoad={() => {
                      console.log('Image chargée avec succès');
                    }}
                  />
                </View>
              ) : (
                <View style={styles.observationMarker}>
                  <Text style={styles.markerText}>
                    {observation.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    position: 'absolute',
    top: 3,
    left: 3,
  },
  observationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#28a745',
    borderWidth: 3,
    borderColor: 'white',
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
    overflow: 'hidden',
  },
  observationMarkerWithImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  markerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});