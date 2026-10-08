import { BadRequestException, Injectable } from '@nestjs/common';

import { ValidatePrayerDto } from './dto/prayer.dto';

const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

function parseTime(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) throw new BadRequestException(`Invalid time format: ${value}`);
  const hours = parseInt(match[1]!, 10);
  const minutes = parseInt(match[2]!, 10);
  if (hours > 23 || minutes > 59) throw new BadRequestException(`Invalid time: ${value}`);
  return hours * 60 + minutes;
}

@Injectable()
export class PrayerValidationService {
  validate(dto: ValidatePrayerDto) {
    const issues: string[] = [];
    const times = dto.times;

    const ordered = PRAYER_ORDER.map((name) => ({
      name,
      minutes: parseTime(times[name]),
    }));

    for (let i = 1; i < ordered.length; i++) {
      const prev = ordered[i - 1]!;
      const curr = ordered[i]!;
      if (curr.minutes <= prev.minutes) {
        issues.push(`${curr.name} must be after ${prev.name}`);
      }
    }

    const fajrToSunrise = ordered[1]!.minutes - ordered[0]!.minutes;
    if (fajrToSunrise < 30) issues.push('Sunrise appears too close to Fajr (< 30 min)');

    const maghribToIsha = ordered[5]!.minutes - ordered[4]!.minutes;
    if (maghribToIsha < 15) issues.push('Isha appears too close to Maghrib (< 15 min)');

    return {
      valid: issues.length === 0,
      date: dto.date,
      method: dto.method ?? 'leva',
      latitude: dto.latitude,
      longitude: dto.longitude,
      issues,
      validatedAt: new Date().toISOString(),
    };
  }
}
