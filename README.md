# 🦅 Wildwatch - Application d'Observation de la Faune et de la Flore

Wildwatch est une application mobile React Native développée avec Expo qui permet aux utilisateurs de créer, visualiser et gérer des observations de la faune et flore sauvage directement sur une carte interactive.

## ✨ Fonctionnalités Principales

### 🗺️ Carte Interactive
- **Affichage de la position GPS** en temps réel
- **Carte Mapbox** haute qualité avec zoom et navigation
- **Marqueurs d'observations** cliquables sur la carte
- **Création d'observations** en tapant sur la carte

### 📝 Gestion des Observations
- **Création d'observations** avec nom, date et localisation GPS
- **Ajout de photos** via caméra ou galerie
- **Modification et suppression** des observations existantes
- **Stockage local** des données avec AsyncStorage

### 📝 Interface Utilisateur
- **Design moderne** et intuitif
- **Gestion des permissions** (localisation, caméra, galerie)
- **Modales interactives** pour la création/édition
- **Sélecteur de date** personnalisé
- **Gestion des erreurs** et états de chargement

## 🛠️ Technologies Utilisées

### Framework & Navigation
- **React Native** 0.81.4
- **Expo** ~54.0.9
- **Expo Router** ~6.0.7 (navigation basée sur les fichiers)
- **React Navigation** 7.x

### Cartographie & Localisation
- **@rnmapbox/maps** 10.1.44 (cartes Mapbox)
- **expo-location** ~19.0.7 (GPS et permissions)

### Gestion des Images
- **expo-image-picker** ^17.0.8 (caméra et galerie)
- **expo-media-library** ^18.2.0 (accès à la galerie)

### Stockage & État
- **@react-native-async-storage/async-storage** ^2.2.0 (stockage local)
- **React Hooks** (gestion d'état)

### Interface & UX
- **react-native-gesture-handler** ~2.28.0
- **react-native-reanimated** ^4.1.1
- **react-native-safe-area-context** ~5.6.0

### Développement
- **TypeScript** ~5.9.2
- **ESLint** ^9.25.0
- **Expo Dev Client** ~6.0.12

## 📁 Structure du Projet

```
Foreach-Wildwatch/
├── app/                          # Pages de l'application (Expo Router)
│   ├── _layout.tsx              # Layout principal
│   ├── index.tsx                # Page d'accueil (carte)
│   └── observation/             # Page d'observation
│       └── index.tsx
├── components/                   # Composants réutilisables
│   ├── ImageSelector.tsx        # Sélecteur d'images
│   ├── LocationDisplay.tsx      # Affichage de la localisation
│   ├── LocationError.tsx        # Gestion des erreurs GPS
│   ├── LocationLoading.tsx      # Indicateur de chargement
│   ├── LocationUnauthorized.tsx # Écran de permission refusée
│   ├── MapboxMap.tsx           # Composant carte Mapbox
│   ├── ObservationForm.tsx     # Formulaire d'observation
│   └── ObservationModal.tsx    # Modale d'observation
├── hooks/                       # Hooks personnalisés
│   ├── useCurrentPosition.ts   # Hook de géolocalisation
│   └── useObservations.ts      # Hook de gestion des observations
├── services/                    # Services métier
│   └── observationService.ts   # Service de gestion des observations
├── types/                       # Définitions TypeScript
│   └── observation.ts          # Types des observations
├── assets/                      # Ressources statiques
│   └── images/                 # Images et icônes
├── android/                     # Configuration Android
├── ios/                        # Configuration iOS
├── app.json                    # Configuration Expo
├── package.json               # Dépendances et scripts
└── tsconfig.json              # Configuration TypeScript
```

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (pour Android) ou **Xcode** (pour iOS)

### Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd Foreach-Wildwatch
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Préparer les builds natifs**
   ```bash
   npm run prebuild
   ```

4. **Démarrer l'application**

   **Pour Android :**
   ```bash
   npm run android
   ```

   **Pour iOS :**
   ```bash
   npm run ios
   ```

   **Pour le développement :**
   ```bash
   npm start
   ```

## 📱 Utilisation

### Première Utilisation

1. **Autoriser les permissions** : L'application demande l'accès à la localisation, à la caméra et à la galerie
2. **Attendre la localisation** : L'application récupère votre position GPS
3. **Explorer la carte** : Naviguez sur la carte pour voir votre environnement

### Créer une Observation

1. **Taper sur la carte** à l'endroit souhaité
2. **Remplir le formulaire** :
   - Nom de l'observation
   - Date (par défaut aujourd'hui)
   - Photo (optionnelle)
3. **Sauvegarder** l'observation

### Gérer les Observations

- **Voir toutes les observations** : Les marqueurs apparaissent sur la carte
- **Modifier une observation** : Taper sur un marqueur existant
- **Supprimer une observation** : Utiliser le bouton de suppression dans le formulaire

### Navigation

- **Zoom** : Pincer pour zoomer/dézoomer
- **Déplacement** : Glisser pour naviguer sur la carte
- **Centrage** : L'application se centre automatiquement sur votre position

## 🔧 Scripts Disponibles

```bash
# Développement
npm start                 # Démarrer le serveur de développement
npm run android          # Lancer sur Android
npm run ios              # Lancer sur iOS
npm run web              # Lancer sur le web

# Build
npm run prebuild         # Préparer les builds natifs

# Utilitaires
npm run reset-project    # Réinitialiser le projet
```

##  Fonctionnalités Techniques

### Gestion des Permissions
- **Localisation** : Demande automatique au démarrage
- **Caméra** : Demande lors de l'ajout d'images
- **Galerie** : Demande lors de la sélection d'images

### Stockage des Données
- **AsyncStorage** : Stockage local des observations
- **Persistance** : Les données survivent aux redémarrages

### Gestion d'État
- **Hooks personnalisés** : `useCurrentPosition`, `useObservations`
- **État local** : Gestion des formulaires et modales
- **Rechargement automatique** : Synchronisation des données

##  Dépannage

### Problèmes Courants

**L'application ne trouve pas ma position :**
- Vérifiez que la localisation est activée
- Autorisez l'accès à la localisation dans les paramètres
- Redémarrez l'application

**Les images ne s'affichent pas :**
- Vérifiez les permissions caméra/galerie
- Redémarrez l'application après avoir accordé les permissions

**La carte ne se charge pas :**
- Vérifiez votre connexion internet
- Les tokens Mapbox sont-ils valides ?

## 👥 Équipe

Développé dans le cadre du Mobile Bootcamp Foreach Academy.

---

**Wildwatch** - Observer, Enregistrer, Partager la Faune Sauvage 🦅
```
