export interface Observation {
  id: string;
  name: string;
  observationDate: string;
  latitude: number;
  longitude: number;
}

export interface CreateObservationData {
    name: string;
    observationDate: string;
    latitude: number;
    longitude: number;
}

export interface UpdateObservationData {
    name?: string;
    observationDate?: string;
}