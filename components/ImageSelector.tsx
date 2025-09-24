import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

interface ImageSelectorProps {
  imageUri?: string;
  onImageSelected: (uri: string | null) => void;
  disabled?: boolean;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  imageUri,
  onImageSelected,
  disabled = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const requestPermissions = async () => {
    try {
      // Demander les permissions de caméra
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      // Demander les permissions de galerie
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Vérifier si les permissions sont accordées
      const hasCameraPermission = cameraStatus === 'granted';
      const hasMediaPermission = mediaStatus === 'granted';
      
      if (!hasCameraPermission && !hasMediaPermission) {
        Alert.alert(
          'Permissions requises',
          'Cette application a besoin d\'accéder à votre appareil photo et à votre galerie pour ajouter des images.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la demande des permissions.'
      );
      return false;
    }
  };

  const showImageOptions = () => {
    if (disabled) return;
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir dans la galerie', ...(imageUri ? ['Supprimer l\'image'] : [])],
          cancelButtonIndex: 0,
          destructiveButtonIndex: imageUri ? 3 : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePicture();
          } else if (buttonIndex === 2) {
            pickImage();
          } else if (buttonIndex === 3 && imageUri) {
            removeImage();
          }
        }
      );
    } else {
      setShowOptions(true);
    }
  };

  const takePicture = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraStatus !== 'granted') {
        Alert.alert(
          'Permission caméra requise',
          'Cette application a besoin d\'accéder à votre appareil photo pour prendre des photos.'
        );
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre une photo');
    }
  };

  const pickImage = async () => {
    try {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (mediaStatus !== 'granted') {
        Alert.alert(
          'Permission galerie requise',
          'Cette application a besoin d\'accéder à votre galerie pour sélectionner des images.'
        );
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Supprimer l\'image',
      'Êtes-vous sûr de vouloir supprimer cette image ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => onImageSelected(null)
        }
      ]
    );
  };

  const handleOptionSelect = (option: string) => {
    setShowOptions(false);
    switch (option) {
      case 'camera':
        takePicture();
        break;
      case 'gallery':
        pickImage();
        break;
      case 'remove':
        removeImage();
        break;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={showImageOptions}
        disabled={disabled}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Ajouter une image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal pour Android */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner une image</Text>
            
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionSelect('camera')}
            >
              <Text style={styles.optionIcon}>📸</Text>
              <Text style={styles.optionText}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionSelect('gallery')}
            >
              <Text style={styles.optionIcon}>🖼️</Text>
              <Text style={styles.optionText}>Choisir dans la galerie</Text>
            </TouchableOpacity>

            {imageUri && (
              <TouchableOpacity
                style={[styles.optionButton, styles.removeButton]}
                onPress={() => handleOptionSelect('remove')}
              >
                <Text style={styles.optionIcon}>🗑️</Text>
                <Text style={[styles.optionText, styles.removeText]}>Supprimer l'image</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    backgroundColor: '#e9ecef',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
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
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#fff5f5',
  },
  removeText: {
    color: '#dc2626',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
});