import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
}

export interface UseCurrentPositionReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionStatus: Location.LocationPermissionResponse | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export const useCurrentPosition = (): UseCurrentPositionReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.LocationPermissionResponse | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setPermissionStatus({ status: 'granted' } as Location.LocationPermissionResponse);
        return true;
      }

      // Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus({ status } as Location.LocationPermissionResponse);

      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        return false;
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la demande de permission';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier les permissions
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission de localisation requise');
        setLoading(false);
        return;
      }

      // Obtenir la position actuelle
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy,
        altitude: locationResult.coords.altitude,
        heading: locationResult.coords.heading,
        speed: locationResult.coords.speed,
      };

      setLocation(locationData);
      
      //debug
      console.log('Position actuelle:', locationData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la position';
      setError(errorMessage);
      console.error('Erreur de géolocalisation:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async (): Promise<void> => {
    await getCurrentPosition();
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus({ status } as Location.LocationPermissionResponse);
        
        if (status === 'granted') {
          await getCurrentPosition();
        }
      } catch (err) {
        console.error('Erreur lors de la vérification des permissions:', err);
      }
    };

    checkPermissions();
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
  };
};

export const openLocationSettings = (): void => {
  Alert.alert(
    'Permission de localisation requise',
    'Veuillez activer la localisation dans les paramètres de votre appareil pour utiliser cette fonctionnalité.',
    [
      { text: 'Annuler', style: 'cancel' },
      { 
        text: 'Ouvrir les paramètres', 
        onPress: () => Linking.openSettings() 
      }
    ]
  );
};
