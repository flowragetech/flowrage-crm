'use client';

import { useMemo, useState } from 'react';
import type { DealRecord } from '@/features/crm/schema/deal';

export function useDealFilters(deals: DealRecord[]) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesQuery =
        !query ||
        `${deal.name ?? ''} ${deal.email ?? ''} ${deal.pipelineStage}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || deal.status.toLowerCase() === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [deals, query, statusFilter]);

  return {
    filteredDeals,
    query,
    setQuery,
    statusFilter,
    setStatusFilter
  };
}
