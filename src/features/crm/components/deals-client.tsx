'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { DealRecord } from '@/features/crm/schema/deal';
import { useDealFilters } from '@/features/crm/hooks/use-deal-filters';
import { updateDealStage } from '@/features/crm/actions/deals';

const stageOptions = ['new-business', 'qualified', 'proposal', 'won', 'lost'];

export function DealsClient({ initialData }: { initialData: DealRecord[] }) {
  const router = useRouter();
  const { filteredDeals, query, setQuery, statusFilter, setStatusFilter } =
    useDealFilters(initialData);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);

  async function handleStageChange(id: string, pipelineStage: string) {
    const result = await updateDealStage(id, pipelineStage);

    if (result.success) {
      toast.success('Deal stage updated.');
      router.refresh();
      return;
    }

    toast.error(result.error || 'Unable to update deal stage.');
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Deals (${initialData.length})`}
          description='Track a generic sales pipeline that works across clients and industries.'
        />
      </div>
      <Separator />

      <div className='grid gap-3 md:grid-cols-[1fr_200px_auto]'>
        <Input
          placeholder='Search deals by name, email, or stage'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            <SelectItem value='new'>New</SelectItem>
            <SelectItem value='contacted'>Contacted</SelectItem>
            <SelectItem value='won'>Won</SelectItem>
            <SelectItem value='lost'>Lost</SelectItem>
          </SelectContent>
        </Select>
        <div className='text-muted-foreground flex items-center text-sm'>
          Pipeline value: {totalValue.toLocaleString()}
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Custom Fields</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No deals matched the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span>{deal.name || 'Unnamed contact'}</span>
                      <span className='text-muted-foreground text-xs'>
                        {deal.email || 'No email'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{deal.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={deal.pipelineStage}
                      onValueChange={(value) =>
                        handleStageChange(deal.id, value)
                      }
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-2'>
                      {Object.entries(deal.customFields)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <Badge key={key} variant='secondary'>
                            {key}: {String(value)}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex justify-end'>
        <Button variant='outline' disabled>
          Deal creation will move here after the database migration.
        </Button>
      </div>
    </div>
  );
}
