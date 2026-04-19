'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconSearch } from '@tabler/icons-react';
import * as LucideIcons from 'lucide-react';

const ICON_LIST = Object.keys(LucideIcons).filter((key) => {
  if (key === 'default' || key === 'createLucideIcon' || key === 'icons')
    return false;

  // Filter out duplicate "Icon" suffixed names if the base name exists
  if (key.endsWith('Icon') && key.slice(0, -4) in LucideIcons) {
    return false;
  }

  return true;
});

export const IconPicker = ({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const filteredIcons = ICON_LIST.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 100);

  const SelectedIcon =
    value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full justify-start gap-2'>
          {SelectedIcon ? <SelectedIcon size={18} /> : <IconSearch size={18} />}
          {value || 'Select an icon'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0' align='start'>
        <div className='flex items-center border-b p-2'>
          <IconSearch className='mr-2 h-4 w-4 shrink-0 opacity-50' />
          <Input
            placeholder='Search icons...'
            className='h-8 border-none focus-visible:ring-0'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className='h-[300px] p-2'>
          <div className='grid grid-cols-4 gap-2'>
            {filteredIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName];
              return (
                <Button
                  key={iconName}
                  variant='ghost'
                  className='h-12 w-12 p-0'
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  title={iconName}
                >
                  <Icon size={20} />
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
