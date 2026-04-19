'use client';

import { useEffect, useState, useTransition } from 'react';
import { useKBar, useRegisterActions } from 'kbar';
import { useRouter } from 'next/navigation';
import { searchWorkspace, type SearchResultItem } from '@/app/actions/search';

export function DynamicSearchActions() {
  const router = useRouter();
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const { searchQuery } = useKBar((state) => ({
    searchQuery: state.searchQuery
  }));

  useEffect(() => {
    const term = searchQuery.trim();

    if (term.length < 2) {
      setResults([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        const nextResults = await searchWorkspace(term);
        setResults(nextResults);
      });
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useRegisterActions(
    [
      ...results.map((result) => ({
        id: result.id,
        name: result.title,
        subtitle: result.subtitle,
        keywords: `${result.title} ${result.subtitle}`.toLowerCase(),
        section: result.section,
        perform: () => router.push(result.url)
      })),
      ...(isPending
        ? [
            {
              id: 'search-loading',
              name: 'Searching...',
              subtitle: 'Looking across CRM, blog, pages, and media',
              section: 'Search'
            }
          ]
        : [])
    ],
    [isPending, results, router]
  );

  return null;
}
