import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LocationData } from '../hooks/useCurrentPosition';

interface LocationDisplayProps {
  location: LocationData;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  location, 
  onRefresh, 
  refreshing = false 
}) => {
  const formatCoordinate = (value: number, decimals: number = 6): string => {
    return value.toFixed(decimals);
  };

  const formatAccuracy = (accuracy: number | null): string => {
    if (accuracy === null) return 'N/A';
    return `${Math.round(accuracy)}m`;
  };

  const formatSpeed = (speed: number | null): string => {
    if (speed === null) return 'N/A';
    return `${Math.round(speed * 3.6)} km/h`;
  };

  const formatAltitude = (altitude: number | null): string => {
    if (altitude === null) return 'N/A';
    return `${Math.round(altitude)}m`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Position actuelle</Text>
        {onRefresh && (
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.coordinatesContainer}>
        <View style={styles.coordinateRow}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{formatCoordinate(location.latitude)}°</Text>
        </View>
        
        <View style={styles.coordinateRow}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{formatCoordinate(location.longitude)}°</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Précision:</Text>
          <Text style={styles.detailValue}>{formatAccuracy(location.accuracy)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Altitude:</Text>
          <Text style={styles.detailValue}>{formatAltitude(location.altitude)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vitesse:</Text>
          <Text style={styles.detailValue}>{formatSpeed(location.speed)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  coordinatesContainer: {
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
});
