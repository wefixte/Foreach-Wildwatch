import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LocationErrorProps {
  error: string;
  onRetry: () => void;
  onOpenSettings?: () => void;
}

export const LocationError: React.FC<LocationErrorProps> = ({ 
  error,
  onRetry,
  onOpenSettings 
}) => {
  const getErrorMessage = (error: string) => {
    if (error.includes('Permission')) {
      return {
        title: 'Permission refusée',
        description: 'L\'accès à votre localisation a été refusé. Veuillez autoriser l\'accès à la localisation pour utiliser cette fonctionnalité.',
        showSettings: true
      };
    } else if (error.includes('timeout') || error.includes('Timeout')) {
      return {
        title: 'Délai dépassé',
        description: 'La récupération de votre position prend plus de temps que prévu. Vérifiez votre connexion et réessayez.',
        showSettings: false
      };
    } else if (error.includes('network') || error.includes('Network')) {
      return {
        title: 'Problème de réseau',
        description: 'Impossible de récupérer votre position. Vérifiez votre connexion internet et réessayez.',
        showSettings: false
      };
    } else {
      return {
        title: 'Erreur de localisation',
        description: 'Une erreur s\'est produite lors de la récupération de votre position. Veuillez réessayer.',
        showSettings: false
      };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      
      <Text style={styles.title}>{errorInfo.title}</Text>
      
      <Text style={styles.description}>
        {errorInfo.description}
      </Text>

      <View style={styles.errorDetails}>
        <Text style={styles.errorLabel}>Détails de l'erreur :</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onRetry}
        >
          <Text style={styles.primaryButtonText}>�� Réessayer</Text>
        </TouchableOpacity>

        {errorInfo.showSettings && onOpenSettings && (
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={onOpenSettings}
          >
            <Text style={styles.secondaryButtonText}>⚙️ Ouvrir les paramètres</Text>
          </TouchableOpacity>
        )}
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
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorDetails: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#c62828',
    fontFamily: 'monospace',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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