import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { CreateObservationData, UpdateObservationData } from '../types/observation';
import { ImageSelector } from './ImageSelector';

interface ObservationFormProps {
  initialData?: {
    name: string;
    observationDate: string;
    imageUri?: string;
  };
  latitude?: number;
  longitude?: number;
  onSave: (data: CreateObservationData | UpdateObservationData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const ObservationForm: React.FC<ObservationFormProps> = ({
  initialData,
  latitude,
  longitude,
  onSave,
  onDelete,
  onCancel,
  isLoading = false,
  isEditing = false
}) => {
  const [name, setName] = useState('');
  const [observationDate, setObservationDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Fonction pour formater la date en français (jj-mm-aaaa)
  const formatDateToFrench = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fonction pour parser une date française (jj-mm-aaaa)
  const parseFrenchDate = (dateString: string): Date | null => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Les mois commencent à 0
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  // Initialiser le formulaire
  useEffect(() => {
    if (isEditing && initialData) {
      setName(initialData.name);
      setObservationDate(initialData.observationDate);
      setImageUri(initialData.imageUri || null);
      const parsedDate = parseFrenchDate(initialData.observationDate);
      if (parsedDate) {
        setSelectedDate(parsedDate);
      }
    } else {
      const today = new Date();
      const formattedDate = formatDateToFrench(today);
      setObservationDate(formattedDate);
      setSelectedDate(today);
      setImageUri(null);
    }
  }, [isEditing, initialData]);

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateConfirm = () => {
    setObservationDate(formatDateToFrench(selectedDate));
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    
    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour l\'observation');
      return;
    }

    if (!observationDate) {
      Alert.alert('Erreur', 'Veuillez saisir une date d\'observation');
      return;
    }

    try {
      if (isEditing) {
        await onSave({
          name: name.trim(),
          observationDate,
          imageUri: imageUri || undefined,
        });
      } else {
        // Création
        if (latitude === undefined || longitude === undefined) {
          Alert.alert('Erreur', 'Coordonnées manquantes');
          return;
        }
        await onSave({
          name: name.trim(),
          observationDate,
          latitude,
          longitude,
          imageUri: imageUri || undefined,
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const handleDelete = () => {
    if (!isEditing || !onDelete) return;
    
    Alert.alert(
      'Supprimer l\'observation',
      'Êtes-vous sûr de vouloir supprimer cette observation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: onDelete
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <ImageSelector
          imageUri={imageUri || undefined}
          onImageSelected={setImageUri}
          disabled={isLoading}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nom de l'observation"
            placeholderTextColor="#999"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date d'observation</Text>
          <TouchableOpacity 
            style={styles.dateInputContainer}
            onPress={showDatePickerModal}
            disabled={isLoading}
          >
            <Text style={styles.dateInputText}>
              {observationDate || 'Sélectionner une date'}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>

          {isEditing && onDelete && (
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={handleDelete}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de sélection de date */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDateCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner une date</Text>
            
            <View style={styles.dateDisplay}>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => changeDate(-1)}
              >
                <Text style={styles.dateButtonText}>◀</Text>
              </TouchableOpacity>
              
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateText}>
                  {formatDateToFrench(selectedDate)}
                </Text>
                <Text style={styles.dateSubtext}>
                  {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => changeDate(1)}
              >
                <Text style={styles.dateButtonText}>▶</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={handleDateCancel}
              >
                <Text style={styles.cancelModalButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleDateConfirm}
              >
                <Text style={styles.confirmModalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 20,
  },
  actions: {
    marginTop: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  dateTextContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelModalButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmModalButton: {
    backgroundColor: '#007AFF',
  },
  cancelModalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});