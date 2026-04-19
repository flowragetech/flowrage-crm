'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { addMediaEntry } from '@/app/actions/media';
import { toast } from 'sonner';
import { IconUpload } from '@tabler/icons-react';

export function MediaUploader({
  onComplete,
  category
}: {
  onComplete?: () => void;
  category?: string;
}) {
  const [loading, setLoading] = useState(false);

  const onUpload = async (files: File[]) => {
    setLoading(true);
    const toastId = toast.loading(`Uploading ${files.length} files...`);

    try {
      for (const file of files) {
        // Upload the file to our local API
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload to server');
        }

        const uploadData = await uploadResponse.json();

        // Simulate image dimensions for images
        let width: number | undefined = undefined;
        let height: number | undefined = undefined;
        if (file.type.startsWith('image/')) {
          width = 1200; // Mock dimensions
          height = 800;
        }

        const result = await addMediaEntry({
          name: uploadData.name,
          url: uploadData.url,
          key: `media-${Date.now()}-${uploadData.name.replace(/\s+/g, '-')}`,
          size: uploadData.size,
          type: uploadData.type,
          width,
          height,
          category
        });

        if (!result.success) {
          throw new Error(result.error);
        }
      }
      toast.success('Files uploaded successfully', { id: toastId });
      onComplete?.();
    } catch (error) {
      toast.error('Failed to upload files', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-muted/30 animate-in fade-in zoom-in flex flex-col items-center justify-center gap-4 rounded-none border-2 border-dashed p-8 duration-300'>
      <div className='bg-background rounded-none border p-4 shadow-sm'>
        <IconUpload size={32} className='text-muted-foreground' />
      </div>
      <div className='text-center'>
        <h3 className='text-lg font-semibold'>Upload New Media</h3>
        <p className='text-muted-foreground text-sm'>
          Drag and drop files here, or click to select files
        </p>
      </div>
      <FileUploader
        onUpload={onUpload}
        maxFiles={10}
        multiple
        maxSize={10 * 1024 * 1024} // 10MB
        disabled={loading}
      />
      <p className='text-muted-foreground text-xs'>
        Maximum upload file size: 10 MB.
      </p>
    </div>
  );
}
