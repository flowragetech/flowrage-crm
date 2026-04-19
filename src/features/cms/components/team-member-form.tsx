'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { TeamMember } from '@prisma/client';
import { createTeamMember, updateTeamMember } from '@/app/actions/cms';
import { MediaPicker } from '@/features/media/components/media-picker';
import Image from 'next/image';
import { IconPhoto } from '@tabler/icons-react';
import { Switch } from '@/components/ui/switch';

const teamMemberSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  role: z.string().min(2, {
    message: 'Role must be at least 2 characters.'
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.'
  }),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  photo: z.string().optional(),
  expertise: z.string().optional(),
  experience: z.string().optional(),
  ordering: z.coerce.number().int().nonnegative().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
      instagram: z.string().optional()
    })
    .optional(),
  isFeatured: z.boolean().optional()
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  initialData?: TeamMember | null;
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const defaultSocialLinks = (() => {
    if (!initialData?.socialLinks) return {};
    if (typeof initialData.socialLinks === 'string') {
      try {
        return JSON.parse(initialData.socialLinks);
      } catch {
        return {};
      }
    }
    return initialData.socialLinks;
  })();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      role: initialData?.role || '',
      slug: initialData?.slug || '',
      shortBio: initialData?.shortBio || '',
      fullBio: initialData?.fullBio || '',
      photo: initialData?.photo || '',
      expertise: initialData?.expertise || '',
      experience: initialData?.experience || '',
      ordering: initialData?.ordering ?? 0,
      socialLinks: {
        linkedin: defaultSocialLinks.linkedin || '',
        twitter: defaultSocialLinks.twitter || '',
        github: defaultSocialLinks.github || '',
        website: defaultSocialLinks.website || '',
        instagram: defaultSocialLinks.instagram || ''
      },
      isFeatured: initialData?.isFeatured ?? false
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: TeamMemberFormValues) {
    try {
      const payload = {
        name: values.name,
        role: values.role,
        slug: values.slug,
        shortBio: values.shortBio,
        fullBio: values.fullBio,
        photo: values.photo,
        expertise: values.expertise,
        experience: values.experience,
        ordering: values.ordering ?? 0,
        socialLinks: values.socialLinks,
        isFeatured: values.isFeatured ?? false
      };

      let result;
      if (isEditing && initialData) {
        result = await updateTeamMember(initialData.id, payload);
      } else {
        result = await createTeamMember(payload);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Team member updated successfully!'
            : 'Team member created successfully!'
        );
        router.push('/dashboard/cms/team');
        router.refresh();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch {
      toast.error('Failed to parse social links JSON.');
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!isEditing) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Full name'
                          {...field}
                          onChange={handleNameChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. SEO Lead' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder='seo-lead' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ordering'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='shortBio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='One or two lines about this team member.'
                        className='min-h-[60px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fullBio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Longer story, experience, achievements.'
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile & Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='photo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <div className='flex flex-col gap-4'>
                        {field.value && (
                          <div className='relative h-32 w-32 overflow-hidden rounded-full border'>
                            <Image
                              src={field.value}
                              alt={form.watch('name') || 'Team member'}
                              fill
                              className='object-cover'
                            />
                          </div>
                        )}
                        <MediaPicker
                          onSelect={(url) => field.onChange(url)}
                          title='Select Profile Photo'
                          trigger={
                            <Button
                              variant='outline'
                              type='button'
                              className='w-fit gap-2'
                            >
                              <IconPhoto size={18} />
                              {field.value ? 'Change Photo' : 'Select Photo'}
                            </Button>
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='expertise'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expertise</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Technical SEO, Content Strategy, Analytics'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='experience'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Highlight</FormLabel>
                    <FormControl>
                      <Input placeholder='8+ years in SEO' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='space-y-4 rounded-md border p-4'>
                <h4 className='text-sm font-medium'>Social Links</h4>
                <FormField
                  control={form.control}
                  name='socialLinks.linkedin'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://linkedin.com/in/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='socialLinks.twitter'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Twitter / X</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://twitter.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='socialLinks.github'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>GitHub</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://github.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='socialLinks.website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Website</FormLabel>
                      <FormControl>
                        <Input placeholder='https://...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='socialLinks.instagram'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://instagram.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-md border p-3'>
                    <FormLabel>Show as featured</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Member'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
