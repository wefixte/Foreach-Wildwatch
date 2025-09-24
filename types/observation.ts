export interface Observation {
  id: string;
  name: string;
  observationDate: string;
  latitude: number;
  longitude: number;
  imageUri?: string;
}

export interface CreateObservationData {
    name: string;
    observationDate: string;
    latitude: number;
    longitude: number;
    imageUri?: string;
}

export interface UpdateObservationData {
    name?: string;
    observationDate?: string;
}