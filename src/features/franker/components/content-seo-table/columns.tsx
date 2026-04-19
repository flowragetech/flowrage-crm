'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SeoContentItem } from '@/app/actions/franker-content-seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

export const columns: ColumnDef<SeoContentItem>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='max-w-[200px] truncate font-medium'>
            {row.getValue('title')}
          </span>
          <span className='text-muted-foreground max-w-[200px] truncate text-xs'>
            /{row.original.slug}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <Badge variant='outline'>{type}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    id: 'seoStatus',
    header: 'SEO Status',
    cell: ({ row }) => {
      const seo = row.original.seoMetadata;
      const hasTitle = !!seo?.metaTitle;
      const hasDesc = !!seo?.metaDescription;
      const hasImage = !!seo?.ogImage;
      const hasKeywords = !!seo?.keywords;

      const score = [hasTitle, hasDesc, hasImage, hasKeywords].filter(
        Boolean
      ).length;

      let variant: 'default' | 'destructive' | 'secondary' | 'outline' =
        'outline';
      let label = 'Unknown';

      if (score === 4) {
        variant = 'default'; // Using default instead of success since success might not exist
        label = 'Good';
      } else if (score >= 2) {
        variant = 'secondary'; // Warning-like
        label = 'Fair';
      } else {
        variant = 'destructive';
        label = 'Poor';
      }

      return (
        <div className='flex items-center gap-2'>
          <Badge
            variant={variant}
            className={
              variant === 'default' ? 'bg-green-600 hover:bg-green-700' : ''
            }
          >
            {label}
          </Badge>
          <div className='flex gap-1'>
            <span
              title='Meta Title'
              className={hasTitle ? 'text-green-500' : 'text-red-500'}
            >
              <CheckCircle size={12} className={!hasTitle ? 'hidden' : ''} />
              <XCircle size={12} className={hasTitle ? 'hidden' : ''} />
            </span>
            <span
              title='Meta Description'
              className={hasDesc ? 'text-green-500' : 'text-red-500'}
            >
              <CheckCircle size={12} className={!hasDesc ? 'hidden' : ''} />
              <XCircle size={12} className={hasDesc ? 'hidden' : ''} />
            </span>
            <span
              title='OG Image'
              className={hasImage ? 'text-green-500' : 'text-red-500'}
            >
              <CheckCircle size={12} className={!hasImage ? 'hidden' : ''} />
              <XCircle size={12} className={hasImage ? 'hidden' : ''} />
            </span>
          </div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original;
      let editUrl = '#';

      switch (item.type) {
        case 'Page':
          editUrl = `/dashboard/cms/pages/${item.id}`;
          break;
        case 'Blog':
          editUrl = `/dashboard/blog/posts/${item.id}`;
          break;
        case 'Service':
          editUrl = `/dashboard/cms/services/${item.id}`;
          break;
        case 'Portfolio':
          editUrl = `/dashboard/cms/portfolio/${item.id}`;
          break;
      }

      return (
        <div className='flex items-center justify-end gap-2'>
          <Button variant='ghost' size='icon' asChild>
            <Link href={editUrl}>
              <Edit className='h-4 w-4' />
            </Link>
          </Button>
          <Button variant='ghost' size='icon' asChild>
            <Link href={`/${item.slug}`} target='_blank'>
              <ExternalLink className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      );
    }
  }
];
