import { apiGet } from '@/core/api/client';

import type { SemanticSearchResponse } from '../types';

export async function searchQuranSemanticRemote(query: string): Promise<SemanticSearchResponse> {
  return apiGet<SemanticSearchResponse>('/quran/search', {
    params: { q: query, mode: 'semantic', limit: 25 },
  });
}
