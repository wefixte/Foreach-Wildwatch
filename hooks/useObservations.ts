import { useState, useCallback } from 'react';
import { ObservationService } from '../services/observationService';
import { Observation, CreateObservationData, UpdateObservationData } from '../types/observation';
import { useFocusEffect } from '@react-navigation/native';

export const useObservations = () => {
    const [observations, setObservations] = useState<Observation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // récup tous les marqueurs
    const loadObservations = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const observation = await ObservationService.getAllObservations();
            setObservations(observation);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des marqueurs');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // créer un marqueur
    const createObservation = useCallback(async (observation: CreateObservationData) => {
        try {
            setError(null);
            const newObservation = await ObservationService.createObservation(observation);
            setObservations(prev => [...prev, newObservation]);
            return newObservation;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création du marqueur');
            return null;
        }
    }, []);

    // mettre à jour un marqueur
    const updateObservation = useCallback(async (id: string, observation: UpdateObservationData) => {
        try {
            setError(null);
            const updatedObservation = await ObservationService.updateObservation(id, observation);
            if (updatedObservation) {
                setObservations(prev => prev.map(obs => obs.id === id ? updatedObservation : obs));
                return updatedObservation;
            }
            return null;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du marqueur');
            return null;
        }
    }, []);
    
    // supprimer un marqueur
    const deleteObservation = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const success = await ObservationService.deleteObservation(id);
            if (success) {
                setObservations(prev => prev.filter(obs => obs.id !== id));
            }
            return success;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du marqueur');
            return false;
        }
    }, []);

    // recharger les marqueurs quand on revient sur la map
    useFocusEffect(useCallback(() => {
        loadObservations();
    }, [loadObservations])
    );

    return {
        observations,
        isLoading,
        error,
        createObservation,
        updateObservation,
        deleteObservation,
        reloadObservations: loadObservations, // pour recharger manuellement les marqueurs
    }
    }