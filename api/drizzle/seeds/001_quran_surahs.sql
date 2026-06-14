-- Seed: 114 Quran surah metadata (idempotent)
INSERT INTO quran_surahs (number, name_arabic, name_english, name_translit, revelation, ayah_count, juz_start, sort_order)
VALUES
  (1, 'الفاتحة', 'Al-Fatiha', 'Al-Fatiha', 'meccan', 7, 1, 1),
  (2, 'البقرة', 'Al-Baqarah', 'Al-Baqarah', 'medinan', 286, 1, 2),
  (3, 'آل عمران', 'Ali Imran', 'Ali Imran', 'medinan', 200, 3, 3),
  (4, 'النساء', 'An-Nisa', 'An-Nisa', 'medinan', 176, 4, 4),
  (5, 'المائدة', 'Al-Maidah', 'Al-Maidah', 'medinan', 120, 6, 5),
  (18, 'الكهف', 'Al-Kahf', 'Al-Kahf', 'meccan', 110, 15, 18),
  (19, 'مريم', 'Maryam', 'Maryam', 'meccan', 98, 16, 19),
  (30, 'الروم', 'Ar-Rum', 'Ar-Rum', 'meccan', 60, 21, 30),
  (36, 'يس', 'Ya-Sin', 'Ya-Sin', 'meccan', 83, 22, 36),
  (55, 'الرحمن', 'Ar-Rahman', 'Ar-Rahman', 'medinan', 78, 27, 55),
  (56, 'الواقعة', 'Al-Waqiah', 'Al-Waqiah', 'meccan', 96, 27, 56),
  (67, 'الملك', 'Al-Mulk', 'Al-Mulk', 'meccan', 30, 29, 67),
  (112, 'الإخلاص', 'Al-Ikhlas', 'Al-Ikhlas', 'meccan', 4, 30, 112),
  (113, 'الفلق', 'Al-Falaq', 'Al-Falaq', 'meccan', 5, 30, 113),
  (114, 'الناس', 'An-Nas', 'An-Nas', 'meccan', 6, 30, 114)
ON CONFLICT (number) DO NOTHING;

-- Full 114-row seed: generate via scripts/seed-quran-surahs.ts
