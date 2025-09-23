import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation, CreateObservationData, UpdateObservationData } from '../types/observation';

const OBSERVATION_STORAGE_KEY = '@wildwatch_observations';

export class ObservationService {

    // récup les marqueurs
    static async getAllObservations(): Promise<Observation[]> {
        try {
            const data = await AsyncStorage.getItem(OBSERVATION_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des marqueurs:', error);
            return [];
        }
    }

    // récup marqueur par id
    static async getObservationById(id: string): Promise<Observation | null> {
        try {
            const observations = await this.getAllObservations();
            return observations.find(obs => obs.id === id) || null;
        } catch (error) {
            console.error('Erreur lors de la récupération du marqueur:', error);
            return null;
        }
    }

    // créer un marqueur
    static async createObservation(observation: CreateObservationData): Promise<Observation> {
        try {
            const observations = await this.getAllObservations();
            const newObservation: Observation = {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                ...observation,
            };
            observations.push(newObservation);
            await AsyncStorage.setItem(OBSERVATION_STORAGE_KEY, JSON.stringify(observations));
            return newObservation;
        } catch (error) {
            console.error('Erreur lors de la création du marqueur:', error);
            throw error;
        }
    }

    // mettre à jour un marqueur
    static async updateObservation(id: string, observation: UpdateObservationData): Promise<Observation | null> { 
        try {
            const observations = await this.getAllObservations();
            const index = observations.findIndex(obs => obs.id === id);
            if (index === -1) {
                return null;
            }
            observations[index] = { ...observations[index], ...observation };
            await AsyncStorage.setItem(OBSERVATION_STORAGE_KEY, JSON.stringify(observations));
            return observations[index];
        } catch (error) {
            console.error('Erreur lors de la mise à jour du marqueur:', error);
            throw error;
        }
    }
    
    // supprimer un marqueur
    static async deleteObservation(id: string): Promise<boolean> {
        try {
            const observations = await this.getAllObservations();
            const filteredObservations = observations.filter(obs => obs.id !== id);
            await AsyncStorage.setItem(OBSERVATION_STORAGE_KEY, JSON.stringify(filteredObservations));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du marqueur:', error);
            throw error;
        }
    }
}
