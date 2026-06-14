-- Seed: Shia Islamic calendar events (idempotent)
INSERT INTO calendar_events (slug, event_type, hijri_month, hijri_day, imam_ref, priority)
VALUES
  ('muharram_1', 'occasion', 1, 1, NULL, 100),
  ('ashura', 'shahadat', 1, 10, 'imam_husayn', 100),
  ('arbaeen', 'occasion', 2, 20, 'imam_husayn', 90),
  ('wiladat_imam_ali', 'wiladat', 7, 13, 'imam_ali', 85),
  ('wiladat_imam_mahdi', 'wiladat', 8, 15, 'imam_mahdi', 90),
  ('ghadeer', 'holiday', 12, 18, 'imam_ali', 95),
  ('mubahila', 'occasion', 12, 24, NULL, 80),
  ('wiladat_prophet', 'wiladat', 3, 17, 'prophet', 95),
  ('wiladat_fatima', 'wiladat', 5, 5, 'fatima', 85),
  ('shahadat_fatima', 'shahadat', 3, 3, 'fatima', 85)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO calendar_event_translations (event_id, locale, title, description)
SELECT e.id, t.locale, t.title, t.description
FROM calendar_events e
CROSS JOIN (VALUES
  ('muharram_1', 'en', 'Start of Muharram', 'Beginning of the sacred month'),
  ('muharram_1', 'ar', 'بداية محرم', 'بداية الشهر الحرام'),
  ('muharram_1', 'ur', 'محرم کا آغاز', 'مقدس مہینے کا آغاز'),
  ('ashura', 'en', 'Day of Ashura', 'Martyrdom of Imam Husayn (a.s.) at Karbala'),
  ('ashura', 'ar', 'يوم عاشوراء', 'استشهاد الإمام الحسين (ع)'),
  ('ashura', 'ur', 'یوم عاشور', 'امام حسینؑ کی شہادت'),
  ('ghadeer', 'en', 'Eid al-Ghadeer', 'Appointment of Imam Ali (a.s.) at Ghadeer Khumm'),
  ('ghadeer', 'ar', 'عيد الغدير', 'ولاية أمير المؤمنين علي (ع)'),
  ('ghadeer', 'ur', 'عید غدیر', 'امام علیؑ کی ولایت')
) AS t(slug, locale, title, description)
WHERE e.slug = t.slug
ON CONFLICT (event_id, locale) DO NOTHING;
