import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, SafeAreaView } from 'react-native';
import { ObservationForm } from './ObservationForm';
import { useObservations } from '../hooks/useObservations';
import { CreateObservationData, UpdateObservationData, Observation } from '../types/observation';

interface ObservationModalProps {
  latitude?: number;
  longitude?: number;
  observationId?: string;
  onClose: () => void;
}

export const ObservationModal: React.FC<ObservationModalProps> = ({
  latitude,
  longitude,
  observationId,
  onClose
}) => {
  const { 
    observations, 
    isLoading, 
    error, 
    createObservation, 
    updateObservation, 
    deleteObservation 
  } = useObservations();

const [currentObservation, setCurrentObservation] = useState<Observation | null>(null);
const [isEditing, setIsEditing] = useState(false);
const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

useEffect(() => {
  if (isLoading) {
    return;
  }

  if (!hasAttemptedLoad && observations.length === 0) {
    setHasAttemptedLoad(true);
    return;
  }

  if (observationId && observationId !== 'new') {
    const observation = observations.find(obs => obs.id === observationId);
    if (observation) {
      setCurrentObservation(observation);
      setIsEditing(true);
    } else {
      Alert.alert('Erreur', 'Observation non trouvée', [
        { text: 'OK', onPress: onClose }
      ]);
    }
  } else {
    setCurrentObservation(null);
    setIsEditing(false);
  }
}, [observationId, observations, onClose, isLoading, hasAttemptedLoad]);


  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
    }
  }, [error]);

  const handleSave = async (data: CreateObservationData | UpdateObservationData) => {
    try {
      if (isEditing && currentObservation) {
        // Modification
        const result = await updateObservation(currentObservation.id, data);
        if (result) {
          Alert.alert('Succès', 'Observation mise à jour avec succès', [
            { text: 'OK', onPress: onClose }
          ]);
        }
      } else {
        // Création
        const result = await createObservation(data as CreateObservationData);
        if (result) {
          Alert.alert('Succès', 'Observation créée avec succès', [
            { text: 'OK', onPress: onClose }
          ]);
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const handleDelete = async () => {
    if (!currentObservation) return;
    
    try {
      const success = await deleteObservation(currentObservation.id);
      if (success) {
        Alert.alert('Succès', 'Observation supprimée avec succès', [
          { text: 'OK', onPress: onClose }
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (isLoading && observationId && observationId !== 'new') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chargement...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement de l'observation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Modifier l\'observation' : 'Nouvelle observation'}
        </Text>
      </View>

      <ObservationForm
        initialData={currentObservation ? {
          name: currentObservation.name,
          observationDate: currentObservation.observationDate
        } : undefined}
        latitude={latitude}
        longitude={longitude}
        onSave={handleSave}
        onDelete={isEditing ? handleDelete : undefined}
        onCancel={handleCancel}
        isLoading={isLoading}
        isEditing={isEditing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});