'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface CompetitorData {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  domainAuthority?: number;
  pageAuthority?: number;
  backlinks?: number;
}

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

function containsNonEnglish(text: string): boolean {
  if (!text) return false;
  // Detect CJK Unified Ideographs, Hiragana/Katakana, and Hangul
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af]/;
  return cjkRegex.test(text);
}

function isValidResult(url: string, title: string): boolean {
  if (!url || !title) return false;

  // Filter out Google domains
  if (
    url.includes('google.com') ||
    url.includes('google.co') ||
    url.includes('youtube.com') ||
    url.includes('blogger.com') ||
    url.includes('microsoft.com') ||
    url.includes('bing.com')
  ) {
    return false;
  }

  // Filter out obvious noise titles
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes('google search') ||
    lowerTitle.includes('bing search') ||
    lowerTitle.includes('robot check') ||
    lowerTitle.includes('captcha') ||
    lowerTitle.includes('privacy policy') ||
    lowerTitle.includes('terms of service')
  ) {
    return false;
  }

  return true;
}

function decodeBingUrl(bingUrl: string): string {
  try {
    const urlObj = new URL(bingUrl);
    const u = urlObj.searchParams.get('u');
    if (u) {
      // Bing 'u' parameter is often Base64Url encoded.
      // Sometimes it has a prefix like 'a1'.
      let encoded = u;
      if (encoded.startsWith('a1')) {
        encoded = encoded.substring(2);
      }

      // Replace - with + and _ with / for standard Base64
      encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed
      while (encoded.length % 4) {
        encoded += '=';
      }

      return Buffer.from(encoded, 'base64').toString('utf-8');
    }
  } catch (e) {
    // console.error('Failed to decode Bing URL:', e);
  }
  return bingUrl;
}

async function scrapeBing(keyword: string): Promise<CompetitorData[]> {
  try {
    const response = await axios.get('https://www.bing.com/search', {
      params: {
        q: keyword,
        mkt: 'en-US',
        ensearch: '1',
        cc: 'US'
      },
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    const results: CompetitorData[] = [];

    $('.b_algo').each((i, element) => {
      const title = $(element).find('h2').text().trim();
      const linkTag = $(element).find('a').first();
      let url = linkTag.attr('href');
      const snippet = $(element).find('.b_caption p').text().trim();

      if (url && url.includes('bing.com/ck/a')) {
        url = decodeBingUrl(url);
      }

      if (title && url && url.startsWith('http')) {
        try {
          const domain = new URL(url).hostname.replace('www.', '');

          if (isValidResult(url, title)) {
            const candidate: CompetitorData = {
              title,
              url,
              domain,
              snippet: snippet || 'No snippet available'
            };
            if (
              !containsNonEnglish(candidate.title) &&
              !containsNonEnglish(candidate.snippet)
            ) {
              results.push(candidate);
            }
          }
        } catch (e) {
          // Invalid URL
        }
      }
    });

    return results;
  } catch (error) {
    return [];
  }
}

async function scrapeGoogle(keyword: string): Promise<CompetitorData[]> {
  try {
    const response = await axios.get('https://www.google.com/search', {
      params: {
        q: keyword,
        num: 10,
        gl: 'us',
        hl: 'en',
        lr: 'lang_en',
        gbv: '1'
      }, // gbv=1 for basic HTML
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en-US,en;q=0.9',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        Cookie: 'CONSENT=YES+Cb.20210720-07-p0.en+FX+410;'
      }
    });

    const $ = cheerio.load(response.data);
    const results: CompetitorData[] = [];

    // Selectors for Google Basic View (gbv=1) and Standard
    // .g is standard, but in basic view structure differs.
    // Try standard first
    $('.g').each((i, element) => {
      if ($(element).find('.related-question-pair').length > 0) return;

      const title = $(element).find('h3').first().text().trim();
      const linkTag = $(element).find('a').first();
      const url = linkTag.attr('href');
      let snippet = $(element)
        .find('div[style*="-webkit-line-clamp"]')
        .text()
        .trim();
      if (!snippet) snippet = $(element).find('.VwiC3b').text().trim();

      if (title && url && url.startsWith('http')) {
        try {
          const domain = new URL(url).hostname.replace('www.', '');

          if (isValidResult(url, title)) {
            const candidate: CompetitorData = {
              title,
              url,
              domain,
              snippet: snippet || 'No snippet available'
            };
            if (
              !containsNonEnglish(candidate.title) &&
              !containsNonEnglish(candidate.snippet)
            ) {
              results.push(candidate);
            }
          }
        } catch (e) {
          // Invalid URL
        }
      }
    });

    // Fallback for Basic HTML View if standard selectors fail
    if (results.length === 0) {
      // In GBV=1, results are often in plain structure or different classes like .kCrYT
      // Or generic 'h3' > 'a'
      $('h3').each((i, element) => {
        const title = $(element).text().trim();
        const parent = $(element).parent(); // usually 'a'
        let url = parent.attr('href');

        if (title && url) {
          if (url.startsWith('/url?q=')) {
            url = url.split('/url?q=')[1].split('&')[0];
            url = decodeURIComponent(url);
          }

          if (url.startsWith('http')) {
            try {
              const domain = new URL(url).hostname.replace('www.', '');

              if (isValidResult(url, title)) {
                const candidate: CompetitorData = {
                  title,
                  url,
                  domain,
                  snippet: 'No snippet available'
                };
                if (
                  !containsNonEnglish(candidate.title) &&
                  !containsNonEnglish(candidate.snippet)
                ) {
                  results.push(candidate);
                }
              }
            } catch (e) {
              // Invalid URL
            }
          }
        }
      });
    }

    return results;
  } catch (error) {
    return [];
  }
}

async function scrapeBrave(keyword: string): Promise<CompetitorData[]> {
  try {
    const response = await axios.get('https://search.brave.com/search', {
      params: { q: keyword },
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    const results: CompetitorData[] = [];

    $('.snippet').each((i, element) => {
      const title = $(element).find('.title').text().trim();
      const url = $(element).find('a').attr('href');
      const snippet = $(element).find('.snippet-description').text().trim();

      if (title && url && url.startsWith('http')) {
        try {
          const domain = new URL(url).hostname.replace('www.', '');

          if (isValidResult(url, title)) {
            const candidate: CompetitorData = {
              title,
              url,
              domain,
              snippet: snippet || 'No snippet available'
            };
            if (
              !containsNonEnglish(candidate.title) &&
              !containsNonEnglish(candidate.snippet)
            ) {
              results.push(candidate);
            }
          }
        } catch (e) {
          // Invalid URL
        }
      }
    });

    return results;
  } catch (error) {
    return [];
  }
}

export async function analyzeCompetitors(
  keyword: string
): Promise<{ success: boolean; data?: CompetitorData[]; error?: string }> {
  if (!keyword.trim()) {
    return { success: false, error: 'Keyword is required' };
  }

  // Strategy: Try Brave first (most reliable currently), then Google, then Bing
  let results = await scrapeBrave(keyword);

  if (results.length === 0) {
    results = await scrapeGoogle(keyword);
  }

  if (results.length === 0) {
    results = await scrapeBing(keyword);
  }

  if (results.length === 0) {
    return {
      success: false,
      error: 'Failed to retrieve competitors from search engines.'
    };
  }

  return { success: true, data: results };
}

export async function saveCompetitor(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: CompetitorData & { targetKeyword: string }
): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement saving to database
  // Currently no Competitor model in schema.prisma

  return { success: true };
}
