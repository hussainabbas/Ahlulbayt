import { KAABA } from '../constants/kaaba';
import type { QiblaCoordinates, QiblaResult } from '../types';

const DEG = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return deg * DEG;
}

function toDeg(rad: number): number {
  return rad / DEG;
}

/** Normalize angle to 0–360° */
export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Shortest signed difference a → b in degrees (-180..180) */
export function angleDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

/**
 * Initial great-circle bearing from `from` to `to` (0° = North, clockwise).
 * Works fully offline.
 */
export function calculateBearing(from: QiblaCoordinates, to: QiblaCoordinates): number {
  const φ1 = toRad(from.latitude);
  const φ2 = toRad(to.latitude);
  const Δλ = toRad(to.longitude - from.longitude);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return normalizeAngle(toDeg(Math.atan2(y, x)));
}

/** Haversine distance in kilometres */
export function calculateDistanceKm(from: QiblaCoordinates, to: QiblaCoordinates): number {
  const φ1 = toRad(from.latitude);
  const φ2 = toRad(to.latitude);
  const Δφ = toRad(to.latitude - from.latitude);
  const Δλ = toRad(to.longitude - from.longitude);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function calculateQibla(from: QiblaCoordinates): QiblaResult {
  return {
    bearing: calculateBearing(from, KAABA),
    distanceKm: calculateDistanceKm(from, KAABA),
    from,
    to: KAABA,
  };
}

/** Project lat/lon to 0–1 for equirectangular map */
export function projectEquirectangular(
  lat: number,
  lon: number,
): { x: number; y: number } {
  return {
    x: (lon + 180) / 360,
    y: (90 - lat) / 180,
  };
}
