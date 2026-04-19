'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { scanLinkStats, LinkStats } from '@/app/actions/franker-analysis';
import { Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export function LinkCounterView() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<LinkStats | null>(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      // In a real app, we'd get the actual base URL from settings
      const result = await scanLinkStats();
      setStats(result);
    } catch (error) {
      // Handle error quietly or show a toast if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Link Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex items-center justify-between'>
            <p className='text-muted-foreground text-sm'>
              Scan your blog posts to count internal and external links.
            </p>
            <Button onClick={handleScan} disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Scanning...' : 'Scan Now'}
            </Button>
          </div>

          {stats && (
            <div className='mb-6 grid gap-4 md:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Posts Scanned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.totalPosts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Internal Links
                  </CardTitle>
                  <LinkIcon className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.totalInternalLinks}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    External Links
                  </CardTitle>
                  <ExternalLink className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.totalExternalLinks}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {stats && stats.posts.length > 0 && (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post Title</TableHead>
                    <TableHead className='text-right'>Internal</TableHead>
                    <TableHead className='text-right'>External</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className='font-medium'>
                        {post.title}
                      </TableCell>
                      <TableCell className='text-right'>
                        {post.internalLinks}
                      </TableCell>
                      <TableCell className='text-right'>
                        {post.externalLinks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
