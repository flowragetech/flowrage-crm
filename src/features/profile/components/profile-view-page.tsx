'use client';

import { useEffect, useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export default function ProfileViewPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!cancelled && data.user) {
          setUser(data.user);
          setName(data.user.name ?? '');
          setEmail(data.user.email ?? '');
        }
      } catch {
        return;
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileSave = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    try {
      setSavingProfile(true);

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name || null,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to update profile');
        return;
      }

      if (data.user) {
        setUser(data.user);
        toast.success('Profile updated');
      } else {
        toast.success('Profile saved');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error(data.error || 'Failed to change password');
        return;
      }

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className='flex w-full flex-col space-y-6 p-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title='Profile'
          description='Manage your account details and password.'
        />
      </div>
      <Separator />

      {isLoading && (
        <p className='text-muted-foreground text-sm'>Loading profile...</p>
      )}

      {!isLoading && !user && (
        <p className='text-muted-foreground text-sm'>
          Unable to load your profile.
        </p>
      )}

      {user && (
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <p className='text-muted-foreground text-xs font-medium'>
                  Role
                </p>
                <p className='bg-muted inline-flex items-center rounded-md px-2 py-1 text-xs font-medium tracking-wide uppercase'>
                  {user.role}
                </p>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Name</label>
                <Input
                  placeholder='Your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Email</label>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  type='button'
                  onClick={handleProfileSave}
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Current password</label>
                <Input
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>New password</label>
                <Input
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Confirm new password
                </label>
                <Input
                  type='password'
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Updating...' : 'Update password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
