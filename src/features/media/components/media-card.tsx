'use client';

import { useState } from 'react';
import {
  IconTrash,
  IconDownload,
  IconCopy,
  IconCheck
} from '@tabler/icons-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils';
import { deleteMedia } from '@/app/actions/media';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: Date;
}

export function MediaCard({ item }: { item: MediaItem }) {
  const [copied, setCopied] = useState(false);
  const isImage = item.type.startsWith('image/');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    const result = await deleteMedia(item.id);
    if (result.success) {
      toast.success('Media deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete media');
    }
  };

  return (
    <Card className='group overflow-hidden'>
      <CardContent className='bg-muted relative aspect-square p-0'>
        {isImage ? (
          <Image
            src={item.url}
            alt={item.name}
            fill
            className='object-cover transition-transform group-hover:scale-105'
          />
        ) : (
          <div className='text-muted-foreground flex h-full items-center justify-center'>
            {item.type.split('/')[1]?.toUpperCase() || 'FILE'}
          </div>
        )}
        <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
          <Button size='icon' variant='secondary' onClick={copyToClipboard}>
            {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
          </Button>
          <Button size='icon' variant='secondary' asChild>
            <a href={item.url} target='_blank' rel='noopener noreferrer'>
              <IconDownload size={18} />
            </a>
          </Button>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col items-start gap-1 p-3'>
        <p className='w-full truncate text-sm font-medium' title={item.name}>
          {item.name}
        </p>
        <div className='flex w-full items-center justify-between'>
          <p className='text-muted-foreground text-xs'>
            {formatBytes(item.size)}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size='icon'
                variant='ghost'
                className='text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8'
              >
                <IconTrash size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  file from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
