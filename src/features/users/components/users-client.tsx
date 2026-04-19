'use client';

import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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
import { updateUser, deleteUser, getUsersPage } from '@/app/actions/users';

type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'AUTHOR'
  | 'CUSTOMER'
  | 'VIEWER';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersClientProps {
  initialData: AdminUser[];
}

export function UsersClient({ initialData }: UsersClientProps) {
  const router = useRouter();
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<AdminUser[]>(initialData);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(initialData.length);
  const [loadingPage, setLoadingPage] = useState(false);

  const onAdd = () => {
    router.push('/dashboard/users/new');
  };

  const onEdit = (user: AdminUser) => {
    router.push(`/dashboard/users/${user.id}`);
  };

  const toggleActiveInline = async (user: AdminUser) => {
    try {
      const result = await updateUser(user.id, { isActive: !user.isActive });
      if (result.success) {
        toast.success(!user.isActive ? 'User activated' : 'User deactivated');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const fetchPage = async (nextPage = page, nextLimit = limit) => {
    setLoadingPage(true);
    try {
      const res = await getUsersPage({
        page: nextPage,
        limit: nextLimit,
        q: search,
        role: roleFilter === 'ALL' ? 'ALL' : (roleFilter as any)
      });
      setItems(res.items as any);
      setTotal(res.total);
      setPage(res.page);
      setLimit(res.limit);
      setSelected({});
    } finally {
      setLoadingPage(false);
    }
  };

  const filtered = items;

  const allSelected =
    filtered.length > 0 && filtered.every((u) => selected[u.id]);
  const toggleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = { ...selected };
    filtered.forEach((u) => {
      next[u.id] = checked;
    });
    setSelected(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
  };

  const bulkDelete = async () => {
    const ids = filtered
      .filter((u) => selected[u.id] && u.role !== 'SUPER_ADMIN')
      .map((u) => u.id);
    if (ids.length === 0) {
      toast.error('No eligible users selected');
      return;
    }
    try {
      setBulkDeleting(true);
      for (const id of ids) {
        const res = await deleteUser(id);
        if (!res.success) {
          toast.error(res.error || 'Failed to delete some users');
          setBulkDeleting(false);
          return;
        }
      }
      toast.success(`Deleted ${ids.length} users`);
      setSelected({});
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteUser(id);
      if (result.success) {
        toast.success('User deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    if (role === 'SUPER_ADMIN') return 'destructive';
    if (role === 'ADMIN') return 'destructive';
    if (role === 'EDITOR') return 'default';
    if (role === 'AUTHOR') return 'secondary';
    if (role === 'CUSTOMER') return 'secondary';
    return 'outline';
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Users (${total})`}
          description='Manage admin users, roles, and access to the dashboard.'
        />
        <div className='flex gap-2'>
          <Input
            placeholder='Search by name or email'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-64'
          />
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as any)}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Roles</SelectItem>
              <SelectItem value='SUPER_ADMIN'>Super Admin</SelectItem>
              <SelectItem value='ADMIN'>Admin</SelectItem>
              <SelectItem value='EDITOR'>Editor</SelectItem>
              <SelectItem value='AUTHOR'>Author</SelectItem>
              <SelectItem value='CUSTOMER'>Customer</SelectItem>
              <SelectItem value='VIEWER'>Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' onClick={() => fetchPage(1, limit)}>
            Apply
          </Button>
          <Button onClick={onAdd}>
            <Plus className='mr-2 h-4 w-4' />
            Add User
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' disabled={bulkDeleting}>
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete selected users?</AlertDialogTitle>
                <AlertDialogDescription>
                  Super Admin cannot be deleted. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={bulkDelete}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(v) => toggleSelectAll(Boolean(v))}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  {loadingPage ? 'Loading...' : 'No users found.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={Boolean(selected[user.id])}
                      onCheckedChange={(v) =>
                        toggleSelectOne(user.id, Boolean(v))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span>{user.name || 'No name'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={user.isActive ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => toggleActiveInline(user)}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell className='text-xs'>
                    {format(new Date(user.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      {user.role !== 'SUPER_ADMIN' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <Trash2 className='text-destructive h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this user?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The user will lose
                                access to the admin panel.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id)}
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-muted-foreground text-sm'>
          Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total
        </div>
        <div className='flex items-center gap-2'>
          <Select
            value={String(limit)}
            onValueChange={(v) => fetchPage(1, Number(v))}
          >
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='Per page' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            disabled={page <= 1}
            onClick={() => fetchPage(page - 1, limit)}
          >
            Prev
          </Button>
          <Button
            variant='outline'
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => fetchPage(page + 1, limit)}
          >
            Next
          </Button>
          <Button onClick={() => fetchPage(page, limit)} disabled={loadingPage}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
