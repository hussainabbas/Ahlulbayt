import { useEffect, useMemo, useState } from 'react';

import { useLocationStore } from '@/stores/locationStore';

import { calculateQibla, normalizeAngle } from '../engine/qiblaCalculator';
import { mapAccuracy, startCompass, stopCompass } from '../services/compassService';
import { useQiblaStore } from '../stores/qiblaStore';
import type { QiblaCompassState, QiblaResult } from '../types';

export function useQibla() {
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const cityName = useLocationStore((s) => s.cityName);
  const headingOffset = useQiblaStore((s) => s.headingOffset);
  const setLastQibla = useQiblaStore((s) => s.setLastQibla);

  const [deviceHeading, setDeviceHeading] = useState(0);
  const [accuracyRaw, setAccuracyRaw] = useState(-1);

  const qibla: QiblaResult = useMemo(
    () => calculateQibla({ latitude, longitude }),
    [latitude, longitude],
  );

  useEffect(() => {
    setLastQibla(qibla.bearing, qibla.distanceKm);
  }, [qibla.bearing, qibla.distanceKm, setLastQibla]);

  useEffect(() => {
    const stop = startCompass((heading, accuracy) => {
      setDeviceHeading(heading);
      setAccuracyRaw(accuracy);
    });
    return stop;
  }, []);

  const calibratedHeading = normalizeAngle(deviceHeading + headingOffset);
  const qiblaRelative = normalizeAngle(qibla.bearing - calibratedHeading);

  const compass: QiblaCompassState = {
    deviceHeading,
    qiblaBearing: qibla.bearing,
    qiblaRelative,
    calibratedHeading,
    accuracy: mapAccuracy(accuracyRaw),
  };

  return {
    qibla,
    compass,
    cityName,
    coordinates: { latitude, longitude },
    isAligned: Math.abs(((qiblaRelative + 180) % 360) - 180) < 5,
  };
}
