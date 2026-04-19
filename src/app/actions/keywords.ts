'use server';

import axios from 'axios';

export interface KeywordData {
  keyword: string;
  volume: number; // Estimated
  cpc: number; // Estimated
  difficulty: number; // Estimated
  currency: string;
}

function getCurrencySymbol(countryCode: string): string {
  const code = countryCode.toLowerCase();
  const map: Record<string, string> = {
    us: '$',
    gb: '£',
    eu: '€',
    de: '€',
    fr: '€',
    it: '€',
    es: '€',
    nl: '€',
    be: '€',
    at: '€',
    ie: '€',
    fi: '€',
    pt: '€',
    gr: '€',
    in: '₹',
    jp: '¥',
    cn: '¥',
    kr: '₩',
    ru: '₽',
    br: 'R$',
    ca: 'C$',
    au: 'A$',
    ch: 'Fr',
    se: 'kr',
    no: 'kr',
    dk: 'kr',
    pl: 'zł',
    th: '฿',
    id: 'Rp',
    tr: '₺',
    vn: '₫',
    za: 'R',
    mx: 'Mex$',
    my: 'RM',
    ph: '₱',
    sg: 'S$',
    hk: 'HK$',
    nz: 'NZ$',
    il: '₪',
    np: 'Rs',
    pk: 'Rs',
    lk: 'Rs',
    bd: '৳'
  };
  return map[code] || '$';
}

export async function getKeywordSuggestions(
  query: string,
  country: string = 'us'
): Promise<{ success: boolean; data?: KeywordData[]; error?: string }> {
  if (!query.trim()) {
    return { success: false, error: 'Keyword is required' };
  }

  try {
    const response = await axios.get('http://google.com/complete/search', {
      params: {
        client: 'chrome',
        q: query,
        hl: 'en',
        gl: country
      }
    });

    // Response format: [query, [suggestion1, suggestion2, ...], ...]
    const suggestions: string[] = response.data[1] || [];
    const currency = getCurrencySymbol(country);

    const data: KeywordData[] = suggestions.map((keyword) => ({
      keyword,
      volume: Math.floor(Math.random() * 10000) + 100, // Mock data
      cpc: Number((Math.random() * 5 + 0.5).toFixed(2)), // Mock data
      difficulty: Math.floor(Math.random() * 100), // Mock data
      currency
    }));

    // Add the original query if not present and if there are no results or just to ensure it's there
    if (!data.find((d) => d.keyword.toLowerCase() === query.toLowerCase())) {
      data.unshift({
        keyword: query,
        volume: Math.floor(Math.random() * 20000) + 500,
        cpc: Number((Math.random() * 10 + 1).toFixed(2)),
        difficulty: Math.floor(Math.random() * 100),
        currency
      });
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch suggestions' };
  }
}
