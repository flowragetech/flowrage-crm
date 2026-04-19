'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WordPressMediaLibrary } from './wp-media-library';
import { getMediaItems } from '@/app/actions/media';
import { IconPhotoPlus } from '@tabler/icons-react';

interface MediaPickerProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
  title?: string;
  category?: string;
}

export function MediaPicker({
  onSelect,
  trigger,
  title = 'Select Media',
  category
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getMediaItems()
        .then((data) => {
          setItems(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' className='flex items-center gap-2'>
            <IconPhotoPlus size={18} />
            {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='flex h-[90vh] w-[90vw] max-w-7xl flex-col p-0 sm:max-w-[95vw]'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='flex-1 overflow-y-auto p-6'>
          {isLoading ? (
            <div className='flex h-full items-center justify-center'>
              <p>Loading media library...</p>
            </div>
          ) : (
            <WordPressMediaLibrary
              initialItems={items}
              mode='picker'
              initialCategory={category}
              onSelect={(item) => {
                onSelect(item.url);
                setOpen(false);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
