/** Splits stored `Spanish | English` text. */
export function splitBilingualText(text: string): { es: string; en: string } {
  if (!text) return { es: '', en: '' };
  if (!text.includes('|')) {
    return { es: text.trim(), en: '' };
  }
  const parts = text.split('|').map((p) => p.trim());
  return { es: parts[0] || '', en: parts[1] || '' };
}

export function joinBilingualText(es: string, en: string): string {
  const a = (es || '').trim();
  const b = (en || '').trim();
  if (!a && !b) return '';
  if (a && !b) return a;
  if (!a && b) return b;
  return `${a} | ${b}`;
}

export function parseBilingualText(text: string, language: 'es' | 'en'): string {
  if (!text || !text.includes('|')) {
    return text || '';
  }
  
  const parts = text.split('|');
  if (parts.length < 2) {
    return text;
  }
  
  // First part is Spanish, second part is English
  return language === 'es' ? parts[0].trim() : parts[1].trim();
}
