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

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'loading';

export interface UseCurrentPositionReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionStatus: PermissionStatus;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export const useCurrentPosition = (): UseCurrentPositionReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('loading');

  const requestPermission = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setPermissionStatus('loading');

      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setPermissionStatus('granted');
        await getCurrentPosition();
        return true;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionStatus('granted');
        await getCurrentPosition();
        return true;
      } else {
        setPermissionStatus('denied');
        setError('Permission de localisation refusée');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la demande de permission';
      setError(errorMessage);
      setPermissionStatus('denied');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission de localisation requise');
        setPermissionStatus('denied');
        setLoading(false);
        return;
      }

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
      setPermissionStatus('granted');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la position';
      setError(errorMessage);
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
        
        if (status === 'granted') {
          setPermissionStatus('granted');
          await getCurrentPosition();
        } else {
          setPermissionStatus('undetermined');
        }
      } catch (err) {
        setPermissionStatus('denied');
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
