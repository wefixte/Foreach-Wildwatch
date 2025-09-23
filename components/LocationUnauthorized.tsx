import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';

interface LocationUnauthorizedProps {
  onRequestPermission?: () => void;
  onOpenSettings?: () => void;
}

export const LocationUnauthorized: React.FC<LocationUnauthorizedProps> = ({ 
  onRequestPermission,
  onOpenSettings 
}) => {
  const handleRequestPermission = () => {
    if (onRequestPermission) {
      onRequestPermission();
    }
  };

  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📍</Text>
      </View>
      
      <Text style={styles.title}>Localisation requise</Text>
      
      <Text style={styles.description}>
        Cette application a besoin d'accéder à votre localisation pour afficher votre position sur la carte et vous fournir des informations pertinentes.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleRequestPermission}
        >
          <Text style={styles.primaryButtonText}>Autoriser la localisation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleOpenSettings}
        >
          <Text style={styles.secondaryButtonText}>Ouvrir les paramètres</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
