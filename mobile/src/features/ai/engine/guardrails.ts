const BLOCK_PATTERNS = [
  /\b(kill|attack|bomb|terror)\b/i,
  /\b(insult|curse|hate)\s+(sunni|shia|christian|jew)/i,
  /\b(fake\s+hadith|fabricate)\b/i,
];

const FATWA_PATTERNS = [
  /\b(is it wajib|is it haram|is it halal|am i allowed|fatwa|ruling on)\b/i,
  /\b(هل\s+يجب|هل\s+حرام|فتوى)\b/,
];

export function checkGuardrails(message: string): {
  blocked: boolean;
  isFatwaRequest: boolean;
  reasonKey?: string;
} {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { blocked: true, isFatwaRequest: false, reasonKey: 'ai.guardrails.empty' };
  }

  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { blocked: true, isFatwaRequest: false, reasonKey: 'ai.guardrails.blocked' };
    }
  }

  for (const pattern of FATWA_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { blocked: false, isFatwaRequest: true };
    }
  }

  return { blocked: false, isFatwaRequest: false };
}
