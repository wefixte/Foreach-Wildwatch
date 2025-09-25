import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Modal, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentPosition, openLocationSettings } from '../hooks/useCurrentPosition';
import { useObservations } from '../hooks/useObservations';
import { LocationLoading } from '../components/LocationLoading';
import { LocationError } from '../components/LocationError';
import { MapboxMap } from '../components/MapboxMap';
import { useEffect } from 'react';
import { Observation } from '../types/observation';
import { ObservationForm } from '../components/ObservationForm';

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

  const { observations, isLoading, error: observationsError, createObservation, updateObservation, deleteObservation } = useObservations();

  // État pour la modale
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [modalLatitude, setModalLatitude] = useState<number | undefined>();
  const [modalLongitude, setModalLongitude] = useState<number | undefined>();

  // Demande automatique de permission au démarrage
  useEffect(() => {
    if (permissionStatus === 'undetermined' && !loading) {
      requestPermission();
    }
  }, [permissionStatus, loading, requestPermission]);

  // Gestion du bouton retour Android
  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true; // Empêche le comportement par défaut
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [modalVisible]);

  const handleOpenSettings = () => {
    openLocationSettings();
  };

  const handleMapReady = () => {
    // Carte prête
  };

  const handleMapPress = (latitude: number, longitude: number) => {
    setModalLatitude(latitude);
    setModalLongitude(longitude);
    setSelectedObservation(null);
    setModalVisible(true);
  };

  const handleMarkerPress = (observation: Observation) => {
    setSelectedObservation(observation);
    setModalLatitude(observation.latitude);
    setModalLongitude(observation.longitude);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedObservation(null);
    setModalLatitude(undefined);
    setModalLongitude(undefined);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedObservation) {
        // Modification
        const result = await updateObservation(selectedObservation.id, data);
        if (result) {
          Alert.alert('Succès', 'Observation mise à jour avec succès', [
            { text: 'OK', onPress: handleCloseModal }
          ]);
        }
      } else {
        // Création
        const result = await createObservation(data);
        if (result) {
          Alert.alert('Succès', 'Observation créée avec succès', [
            { text: 'OK', onPress: handleCloseModal }
          ]);
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const handleDelete = async () => {
    if (!selectedObservation) return;
    
    try {
      const success = await deleteObservation(selectedObservation.id);
      if (success) {
        Alert.alert('Succès', 'Observation supprimée avec succès', [
          { text: 'OK', onPress: handleCloseModal }
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression');
    }
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

        {/* Modale */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackdrop} 
              activeOpacity={1}
              onPress={handleCloseModal}
            />
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedObservation ? 'Modifier l\'observation' : 'Nouvelle observation'}
                  </Text>
                </View>
                
                <ObservationForm
                  initialData={selectedObservation ? {
                    name: selectedObservation.name,
                    observationDate: selectedObservation.observationDate,
                    imageUri: selectedObservation.imageUri
                  } : undefined}
                  latitude={modalLatitude}
                  longitude={modalLongitude}
                  onSave={handleSave}
                  onDelete={selectedObservation ? handleDelete : undefined}
                  onCancel={handleCloseModal}
                  isLoading={isLoading}
                  isEditing={!!selectedObservation}
                />
              </View>
            </View>
          </View>
        </Modal>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  // Styles pour la modale
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'tranparent',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalHeader: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});