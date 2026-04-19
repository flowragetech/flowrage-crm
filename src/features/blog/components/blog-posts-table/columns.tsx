'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BlogPost, Category, Tag } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export type BlogPostWithCategoryAndSeo = BlogPost & {
  categories: Category[];
  tags: Tag[];
  seoMetadata: {
    id: string;
  };
};

export const getColumns = (
  onEdit: (post: BlogPostWithCategoryAndSeo) => void,
  onDelete: (post: BlogPostWithCategoryAndSeo) => void,
  onTogglePublished: (post: BlogPostWithCategoryAndSeo) => void
): ColumnDef<BlogPostWithCategoryAndSeo>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.getValue('title')}</span>
          <span className='text-muted-foreground text-xs italic'>
            /{row.original.slug}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'categories',
    header: 'Categories',
    cell: ({ row }) => {
      const categories = row.original.categories;
      return (
        <div className='flex flex-wrap gap-1'>
          {categories.length > 0
            ? categories.map((c) => (
                <Badge key={c.id} variant='secondary' className='text-[10px]'>
                  {c.name}
                </Badge>
              ))
            : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags;
      return (
        <div className='flex flex-wrap gap-1'>
          {tags.length > 0
            ? tags.map((t) => (
                <Badge key={t.id} variant='outline' className='text-[10px]'>
                  #{t.name}
                </Badge>
              ))
            : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'published',
    header: 'Status',
    cell: ({ row }) => {
      const published = row.getValue('published') as boolean;
      return (
        <button
          type='button'
          onClick={() => onTogglePublished(row.original)}
          className='focus-visible:outline-none'
        >
          <Badge variant={published ? 'default' : 'outline'}>
            {published ? 'Published' : 'Draft'}
          </Badge>
        </button>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Created',
    cell: ({ row }) => {
      return format(new Date(row.getValue('createdAt')), 'MMM d, yyyy');
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(post)}>
              <Pencil className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(post)}
              className='text-destructive'
            >
              <Trash className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
