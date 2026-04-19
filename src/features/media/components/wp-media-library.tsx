'use client';

import { useState, useEffect } from 'react';
import {
  IconLayoutGrid,
  IconList,
  IconSearch,
  IconX,
  IconLoader2,
  IconCheck,
  IconPlus
} from '@tabler/icons-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { format, isSameMonth, startOfMonth } from 'date-fns';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { formatBytes, cn } from '@/lib/utils';
import {
  updateMediaDetails,
  deleteMedia,
  getMediaItems
} from '@/app/actions/media';
import { MediaUploader } from './media-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  description: string | null;
  category: string | null;
  createdAt: Date;
}

export function WordPressMediaLibrary({
  initialItems,
  mode = 'library',
  onSelect,
  initialCategory = 'all'
}: {
  initialItems: MediaItem[];
  mode?: 'library' | 'picker';
  onSelect?: (item: MediaItem) => void;
  initialCategory?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<'grid' | 'list'>(
    mode === 'picker' ? 'grid' : 'grid'
  );
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [showUploader, setShowUploader] = useState(false);

  const refreshItems = async () => {
    const newItems = await getMediaItems();
    setItems(newItems);
  };

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Extract unique months for date filter
  const months = Array.from(
    new Set(
      items.map((item) => startOfMonth(new Date(item.createdAt)).toISOString())
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const categories = Array.from(
    new Set(items.map((item) => item.category || 'uncategorized'))
  ).sort();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.altText?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'image' && item.type.startsWith('image/')) ||
      (typeFilter === 'video' && item.type.startsWith('video/')) ||
      (typeFilter === 'audio' && item.type.startsWith('audio/'));

    const matchesDate =
      dateFilter === 'all' ||
      isSameMonth(new Date(item.createdAt), new Date(dateFilter));

    const matchesCategory =
      categoryFilter === 'all' ||
      (item.category || 'uncategorized') === categoryFilter;

    return matchesSearch && matchesType && matchesDate && matchesCategory;
  });

  const handleUpdate = async (formData: {
    name?: string;
    altText?: string;
    caption?: string;
    description?: string;
    category?: string;
  }) => {
    if (!selectedItem) return;
    setIsUpdating(true);
    try {
      const result = await updateMediaDetails(selectedItem.id, formData);
      if (result.success) {
        toast.success('Details saved');
        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id ? { ...item, ...formData } : item
          )
        );
      } else {
        toast.error('Failed to save');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteMedia(id);
      if (result.success) {
        toast.success('Deleted');
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedItem(null);
      } else {
        toast.error('Failed to delete');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      let successCount = 0;
      for (const id of selectedIds) {
        const result = await deleteMedia(id);
        if (result.success) successCount++;
      }
      toast.success(`Deleted ${successCount} items`);
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setIsBulkMode(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <h2 className='text-2xl font-bold tracking-tight'>Media Library</h2>
        <Button
          variant='outline'
          size='sm'
          className='h-8 gap-1'
          onClick={() => setShowUploader(!showUploader)}
        >
          {showUploader ? (
            <>
              <IconX size={16} />
              Cancel Upload
            </>
          ) : (
            <>
              <IconPlus size={16} />
              Add New
            </>
          )}
        </Button>
      </div>

      {showUploader && (
        <div className='mb-8'>
          <MediaUploader
            onComplete={() => {
              setShowUploader(false);
              refreshItems();
            }}
            category={categoryFilter === 'all' ? undefined : categoryFilter}
          />
        </div>
      )}

      {/* WP Style Toolbar */}
      <div className='bg-muted/50 flex flex-wrap items-center justify-between gap-4 rounded-lg border p-2'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size='icon'
              onClick={() => setView('grid')}
              className='h-8 w-8'
            >
              <IconLayoutGrid size={18} />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              onClick={() => setView('list')}
              className='h-8 w-8'
            >
              <IconList size={18} />
            </Button>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className='h-8 w-[130px]'>
              <SelectValue placeholder='All media items' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All media items</SelectItem>
              <SelectItem value='image'>Images</SelectItem>
              <SelectItem value='audio'>Audio</SelectItem>
              <SelectItem value='video'>Video</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className='h-8 w-[150px]'>
              <SelectValue placeholder='All dates' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All dates</SelectItem>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {format(new Date(month), 'MMMM yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='h-8 w-[140px]'>
              <SelectValue placeholder='All categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mode === 'library' && (
            <div className='flex items-center gap-2'>
              <Button
                variant={isBulkMode ? 'secondary' : 'outline'}
                size='sm'
                className='h-8'
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  setSelectedIds([]);
                }}
              >
                {isBulkMode ? 'Cancel Bulk Select' : 'Bulk Select'}
              </Button>
              {isBulkMode && selectedIds.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='destructive'
                      size='sm'
                      className='h-8'
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <IconLoader2 className='mr-2 animate-spin' size={14} />
                      ) : null}
                      Delete ({selectedIds.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Multiple Items?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to permanently delete {selectedIds.length}{' '}
                        items. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
                        className='bg-destructive text-destructive-foreground'
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>

        <div className='relative w-full max-w-xs'>
          <IconSearch
            className='text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2'
            size={16}
          />
          <Input
            placeholder='Search media items...'
            className='h-8 pl-8'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Media Content */}
      {view === 'grid' ? (
        <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12'>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (isBulkMode) {
                  toggleSelect(item.id);
                } else {
                  setSelectedItem(item);
                }
              }}
              className={cn(
                'group relative aspect-square cursor-pointer border-2 transition-all hover:opacity-80',
                selectedItem?.id === item.id || selectedIds.includes(item.id)
                  ? 'border-primary ring-primary/20 ring-2'
                  : 'border-transparent'
              )}
            >
              <Image
                src={item.url}
                alt={item.name}
                fill
                className='object-cover'
              />
              {isBulkMode && (
                <div
                  className={cn(
                    'absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded border bg-white transition-opacity',
                    selectedIds.includes(item.id)
                      ? 'border-primary bg-primary text-white opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {selectedIds.includes(item.id) && <IconCheck size={14} />}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg border'>
          <table className='w-full text-sm'>
            <thead className='bg-muted'>
              <tr>
                <th className='p-2 text-left'>File</th>
                <th className='p-2 text-left'>Author</th>
                <th className='p-2 text-left'>Uploaded to</th>
                <th className='p-2 text-left'>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-muted/50 cursor-pointer border-t',
                    selectedIds.includes(item.id) ? 'bg-primary/5' : ''
                  )}
                  onClick={() => {
                    if (isBulkMode) {
                      toggleSelect(item.id);
                    } else {
                      setSelectedItem(item);
                    }
                  }}
                >
                  <td className='p-2'>
                    <div className='flex items-center gap-3'>
                      {isBulkMode && (
                        <div
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                            selectedIds.includes(item.id)
                              ? 'bg-primary border-primary text-white'
                              : 'border-muted-foreground bg-white'
                          )}
                        >
                          {selectedIds.includes(item.id) && (
                            <IconCheck size={12} />
                          )}
                        </div>
                      )}
                      <div className='relative h-10 w-10 shrink-0'>
                        <Image
                          src={item.url}
                          alt=''
                          fill
                          className='rounded object-cover'
                        />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-medium text-blue-600 hover:underline'>
                          {item.name}
                        </span>
                        <span className='text-muted-foreground text-[10px]'>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='text-muted-foreground p-2'>Admin</td>
                  <td className='text-muted-foreground p-2'>(Unattached)</td>
                  <td className='text-muted-foreground p-2'>
                    <div className='flex flex-col'>
                      <span>
                        {format(new Date(item.createdAt), 'yyyy/MM/dd')}
                      </span>
                      <span className='text-[10px]'>
                        {format(new Date(item.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WP Style Details Sidebar (Drawer) */}
      <Drawer open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DrawerContent className='max-h-[85vh]'>
          <div className='mx-auto w-full max-w-2xl overflow-y-auto'>
            <DrawerHeader className='mb-6 pt-2'>
              <DrawerTitle>Attachment Details</DrawerTitle>
            </DrawerHeader>

            {selectedItem && (
              <div className='space-y-6 px-6 pb-10'>
                <div className='flex gap-4'>
                  <div className='bg-muted relative h-32 w-32 shrink-0 overflow-hidden rounded border'>
                    <Image
                      src={selectedItem.url}
                      alt=''
                      fill
                      className='object-contain'
                    />
                  </div>
                  <div className='space-y-1 overflow-hidden text-sm'>
                    <p className='truncate font-bold'>{selectedItem.name}</p>
                    <p className='text-muted-foreground'>
                      {format(new Date(selectedItem.createdAt), 'MMMM d, yyyy')}
                    </p>
                    <p className='text-muted-foreground'>
                      {formatBytes(selectedItem.size)}
                    </p>
                    {selectedItem.width && (
                      <p className='text-muted-foreground'>
                        {selectedItem.width} by {selectedItem.height} pixels
                      </p>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='link'
                          className='text-destructive h-auto p-0 text-xs'
                        >
                          Delete Permanently
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the file from the server.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(selectedItem.id)}
                            className='bg-destructive text-destructive-foreground'
                          >
                            Delete Permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='alt'>Alternative Text</Label>
                      <Input
                        id='alt'
                        defaultValue={selectedItem.altText || ''}
                        onBlur={(e) =>
                          handleUpdate({ altText: e.target.value || undefined })
                        }
                      />
                      <p className='text-muted-foreground text-[10px]'>
                        Describe the purpose of the image. Leave empty if purely
                        decorative.
                      </p>
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='title'>Title</Label>
                      <Input
                        id='title'
                        defaultValue={selectedItem.name}
                        onBlur={(e) => handleUpdate({ name: e.target.value })}
                      />
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='category'>Category</Label>
                      <Input
                        id='category'
                        defaultValue={selectedItem.category || ''}
                        onBlur={(e) =>
                          handleUpdate({
                            category: e.target.value || 'uncategorized'
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='caption'>Caption</Label>
                      <Textarea
                        id='caption'
                        className='h-20'
                        defaultValue={selectedItem.caption || ''}
                        onBlur={(e) =>
                          handleUpdate({ caption: e.target.value || undefined })
                        }
                      />
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='desc'>Description</Label>
                      <Textarea
                        id='desc'
                        className='h-20'
                        defaultValue={selectedItem.description || ''}
                        onBlur={(e) =>
                          handleUpdate({
                            description: e.target.value || undefined
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className='grid gap-2'>
                  <Label>File URL:</Label>
                  <div className='flex gap-2'>
                    <Input
                      readOnly
                      value={selectedItem.url}
                      className='bg-muted h-8 text-xs'
                    />
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-8'
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.url);
                        toast.success('URL copied');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {isUpdating && (
                  <div className='text-muted-foreground flex items-center gap-2 text-sm italic'>
                    <IconLoader2 className='animate-spin' size={14} />
                    Saving changes...
                  </div>
                )}

                <Separator />

                <div className='flex items-center justify-between'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='link'
                        className='text-destructive h-auto p-0'
                      >
                        Delete Permanently
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This file will be gone forever.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(selectedItem.id)}
                          className='bg-destructive text-destructive-foreground'
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant='outline' size='sm' asChild>
                    <a href={selectedItem.url} target='_blank'>
                      View attachment page
                    </a>
                  </Button>
                </div>

                {mode === 'picker' && (
                  <div className='pt-4'>
                    <Button
                      className='w-full'
                      onClick={() => {
                        onSelect?.(selectedItem);
                        setSelectedItem(null);
                      }}
                    >
                      Select Media
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
