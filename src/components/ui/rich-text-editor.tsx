'use client';

import * as React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className
}: RichTextEditorProps) {
  return (
    <div
      className={cn(
        'bg-background focus-within:ring-ring flex flex-col rounded-md border shadow-sm focus-within:ring-1',
        className
      )}
    >
      <Editor
        tinymceScriptSrc='/assets/libs/tinymce/tinymce.min.js'
        licenseKey='gpl'
        value={value}
        init={
          {
            base_url: '/assets/libs/tinymce',
            suffix: '.min',
            license_key: 'gpl',
            height: 300,
            menubar: false,
            plugins: [
              'advlist',
              'anchor',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'help',
              'wordcount'
            ],
            toolbar:
              'undo redo | blocks fontfamily fontsize | ' +
              'bold italic underline strikethrough forecolor backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | ' +
              'link image media table insertdatetime charmap | ' +
              'searchreplace visualblocks | ' +
              'code preview fullscreen | removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            placeholder: placeholder || 'Write your content here...'
          } as any
        }
        onEditorChange={onChange}
      />
    </div>
  );
}
