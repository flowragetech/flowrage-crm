import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SystemUpdatesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Updates</CardTitle>
        <CardDescription>
          Review available releases, backup status, and update job progress for
          this self-hosted instance.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex items-center justify-between gap-4'>
        <p className='text-muted-foreground text-sm'>
          One-click updates are designed for Git-based installs and can be
          adapted for other environments with custom commands.
        </p>
        <Button asChild>
          <Link href='/dashboard/settings/updates'>Open Updates</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
