export type QiblaViewMode = 'compass' | 'map' | 'ar';

export interface QiblaCoordinates {
  latitude: number;
  longitude: number;
}

export interface QiblaResult {
  bearing: number;
  distanceKm: number;
  from: QiblaCoordinates;
  to: QiblaCoordinates;
}

export interface QiblaCompassState {
  deviceHeading: number;
  qiblaBearing: number;
  /** Degrees to rotate arrow: qibla relative to device top */
  qiblaRelative: number;
  calibratedHeading: number;
  accuracy: 'high' | 'medium' | 'low' | 'unavailable';
}
