'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TeamMembersTable } from '@/features/cms/components/team-members-table';
import { TeamMember } from '@prisma/client';
import { deleteTeamMember } from '@/app/actions/cms';
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
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface TeamMembersClientProps {
  initialData: TeamMember[];
}

export function TeamMembersClient({ initialData }: TeamMembersClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [memberToDelete, setMemberToDelete] = React.useState<TeamMember | null>(
    null
  );

  const onAdd = () => {
    router.push('/dashboard/cms/team/members/new');
  };

  const onEdit = (member: TeamMember) => {
    router.push(`/dashboard/cms/team/members/${member.id}`);
  };

  const onDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      const result = await deleteTeamMember(memberToDelete.id);
      if (result.success) {
        toast.success('Team member deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete team member');
      }
    } catch {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };

  return (
    <>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Team Members (${initialData.length})`}
            description='Manage the experts displayed on your team page.'
          />
        </div>
        <Separator />
        <TeamMembersTable
          data={initialData}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team member</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className='text-foreground font-bold'>
                {memberToDelete?.name}
              </span>{' '}
              from your team listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
