'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function DbHealth() {
  const [status, setStatus] = useState<'ok' | 'error' | 'loading'>('loading');

  async function check() {
    try {
      const res = await fetch('/api/v1/health', { cache: 'no-store' });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  const label =
    status === 'loading'
      ? 'Checking DB…'
      : status === 'ok'
        ? 'DB Connected'
        : 'DB Unavailable';
  const variant =
    status === 'ok'
      ? 'default'
      : status === 'loading'
        ? 'secondary'
        : 'destructive';

  return (
    <Badge variant={variant} className='text-xs'>
      {label}
    </Badge>
  );
}
