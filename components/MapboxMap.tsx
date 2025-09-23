import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { LocationData } from '../hooks/useCurrentPosition';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic3JheW5hdWQtbGFtb2JpbGVyeSIsImEiOiJjbWZmdTRienQwb2F4MmtzYmprNWxieWZwIn0.mgySs3rW_6jA7hEKCF7ycw';

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
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ 
  location, 
  style, 
  onMapReady 
}) => {
  const mapRef = useRef<Mapbox.MapView>(null);

  useEffect(() => {
    Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  }, []);

  const handleMapReady = () => {
    if (onMapReady) {
      onMapReady();
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
            <View style={styles.marker}>
              <View style={styles.markerInner} />
            </View>
          </View>
        </Mapbox.PointAnnotation>
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
  marker: {
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
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    position: 'absolute',
    top: 3,
    left: 3,
  },
});
