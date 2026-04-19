import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { MonitorClient } from './client';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function Franker404Monitor() {
  const logsData = await prisma.notFoundLog.findMany({
    orderBy: { lastAccessed: 'desc' }
  });

  const logs = logsData.map((log) => ({
    id: log.id,
    url: log.url,
    hits: log.hits,
    lastAccessed: format(log.lastAccessed, 'yyyy-MM-dd hh:mm a'),
    userAgent: log.userAgent || undefined,
    referer: log.referer || undefined
  }));

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='404 Monitor'
            description='Track and manage 404 errors on your site.'
          />
        </div>
        <Separator />
        <MonitorClient data={logs} />
      </div>
    </PageContainer>
  );
}
