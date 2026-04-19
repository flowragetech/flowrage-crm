'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createUser, updateUser } from '@/app/actions/users';

type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'AUTHOR'
  | 'CUSTOMER'
  | 'VIEWER';

interface UserFormProps {
  initialData?: any | null;
  onSuccess?: () => void;
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(initialData?.email || '');
  const [name, setName] = useState(initialData?.name || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialData?.role || 'VIEWER');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (!initialData && !password) {
      toast.error('Password is required for new users');
      return;
    }

    try {
      setIsSubmitting(true);

      if (initialData) {
        const result = await updateUser(initialData.id, {
          email,
          name: name || undefined,
          role,
          isActive,
          password: password || undefined
        });

        if (result.success) {
          toast.success('User updated');
          router.push('/dashboard/users');
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(result.error || 'Failed to update user');
        }
      } else {
        const result = await createUser({
          email,
          name: name || undefined,
          password,
          role,
          isActive
        });

        if (result.success) {
          toast.success('User created');
          router.push('/dashboard/users');
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(result.error || 'Failed to create user');
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Email</label>
        <Input
          type='email'
          placeholder='user@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Name</label>
        <Input
          placeholder='User name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>
          {initialData ? 'New Password (optional)' : 'Password'}
        </label>
        <Input
          type='password'
          placeholder={initialData ? 'Leave blank to keep unchanged' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Role</label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='SUPER_ADMIN'>Super Admin</SelectItem>
              <SelectItem value='ADMIN'>Admin</SelectItem>
              <SelectItem value='EDITOR'>Editor</SelectItem>
              <SelectItem value='AUTHOR'>Author</SelectItem>
              <SelectItem value='CUSTOMER'>Customer</SelectItem>
              <SelectItem value='VIEWER'>Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div className='space-y-0.5'>
            <p className='text-sm font-medium'>Active</p>
            <p className='text-muted-foreground text-xs'>
              Controls whether the user can sign in.
            </p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>
      <div className='flex justify-end gap-4 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : initialData
              ? 'Save Changes'
              : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
