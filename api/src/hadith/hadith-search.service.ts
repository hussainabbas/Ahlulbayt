import { Injectable } from '@nestjs/common';

export interface HadithSearchHit {
  id: string;
  title: string;
  snippet: string;
  source: string;
  grading?: string;
  score: number;
  matchType: 'keyword' | 'reference' | 'topic' | 'semantic' | 'hybrid';
}

export interface HadithSearchResponse {
  query: string;
  page: number;
  total: number;
  tookMs: number;
  results: HadithSearchHit[];
  source: 'postgres' | 'elasticsearch' | 'stub';
}

/** Server-side search — wired to Postgres FTS / Elasticsearch in phase 2. */
@Injectable()
export class HadithSearchService {
  async search(params: {
    q: string;
    source?: string;
    topic?: string;
    grading?: string;
    locale?: string;
    page?: number;
    limit?: number;
    mode?: 'keyword' | 'semantic' | 'hybrid';
  }): Promise<HadithSearchResponse> {
    const start = Date.now();
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    // Stub until corpus ingest completes — returns empty with timing metadata
    return {
      query: params.q,
      page,
      total: 0,
      tookMs: Date.now() - start,
      results: [],
      source: 'stub',
    };
  }

  async getRelated(id: string, limit = 6): Promise<HadithSearchHit[]> {
    void id;
    void limit;
    return [];
  }

  async getDaily(dateKey?: string) {
    void dateKey;
    return null;
  }
}
