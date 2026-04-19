'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import { Search, Loader2, TrendingUp, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import {
  getKeywordSuggestions,
  type KeywordData
} from '@/app/actions/keywords';
import { COUNTRIES } from '@/lib/countries';

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('us');
  const [results, setResults] = useState<KeywordData[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!keyword.trim()) return;

    startTransition(async () => {
      const response = await getKeywordSuggestions(keyword, country);
      if (response.success && response.data) {
        setResults(response.data);
        if (response.data.length === 0) {
          toast.warning('No keyword suggestions found.');
        } else {
          toast.success(`Found ${response.data.length} keyword suggestions`);
        }
      } else {
        toast.error(response.error || 'Failed to fetch keywords');
      }
    });
  };

  return (
    <ScrollArea className='h-[calc(100vh-4rem)]'>
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Keyword Research
          </h1>
          <p className='text-muted-foreground'>
            Discover new keyword opportunities using Google Autocomplete data.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find Keywords</CardTitle>
            <CardDescription>
              Enter a seed keyword to generate suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex gap-4'>
              <div className='w-[180px]'>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select country' />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Enter seed keyword (e.g. 'best seo tools')"
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
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className='mr-2 h-4 w-4' />
                    Get Suggestions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Keyword Suggestions for "{keyword}"</CardTitle>
              <CardDescription>
                Note: Volume and CPC are estimated/mocked as they are not
                available from Autocomplete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Est. Volume</TableHead>
                    <TableHead>Est. CPC</TableHead>
                    <TableHead>Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {result.keyword}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <BarChart className='text-muted-foreground h-4 w-4' />
                          {result.volume.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <span className='text-muted-foreground w-4 text-center text-sm'>
                            {result.currency}
                          </span>
                          {result.cpc.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <TrendingUp className='text-muted-foreground h-4 w-4' />
                          {result.difficulty}/100
                        </div>
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
