'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  analyzeCompetitors,
  type CompetitorData
} from '@/app/actions/competitors';

export default function CompetitorAnalysisPage() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<CompetitorData[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!keyword.trim()) return;

    startTransition(async () => {
      const response = await analyzeCompetitors(keyword);
      if (response.success && response.data) {
        setResults(response.data);
        if (response.data.length === 0) {
          toast.warning(
            'No competitors found. Google might be blocking requests.'
          );
        } else {
          toast.success(`Found ${response.data.length} competitors`);
        }
      } else {
        toast.error(response.error || 'Failed to analyze competitors');
      }
    });
  };

  return (
    <ScrollArea className='h-[calc(100vh-4rem)]'>
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Competitor Analysis
          </h1>
          <p className='text-muted-foreground'>
            Analyze organic search competitors directly from Google SERPs.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Research Competitors</CardTitle>
            <CardDescription>
              Enter a target keyword to find top ranking pages and analyze their
              content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex gap-4'>
              <Input
                placeholder="Enter target keyword (e.g. 'seo services')"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className='max-w-md'
              />
              <Button
                onClick={handleSearch}
                disabled={isPending || !keyword.trim()}
              >
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className='mr-2 h-4 w-4' />
                    Analyze SERP
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Organic Results for "{keyword}"</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[50px]'>Rank</TableHead>
                    <TableHead>Competitor</TableHead>
                    <TableHead>Snippet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        #{index + 1}
                      </TableCell>
                      <TableCell className='min-w-[200px] whitespace-normal'>
                        <div className='flex flex-col'>
                          <span className='flex items-start gap-2 text-sm font-semibold'>
                            {result.title}
                            <a
                              href={result.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-muted-foreground hover:text-primary'
                            >
                              <ExternalLink className='h-3 w-3' />
                            </a>
                          </span>
                          <span className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=128`}
                              alt='favicon'
                              className='h-4 w-4 rounded-sm'
                            />
                            {result.domain}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-md whitespace-normal'>
                        <p className='text-muted-foreground line-clamp-2 text-sm'>
                          {result.snippet || 'No snippet available'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
