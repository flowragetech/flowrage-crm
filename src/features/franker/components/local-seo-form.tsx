'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateLocalSeoConfig } from '@/app/actions/franker';

const localSeoFormSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  type: z.string().min(2, 'Business type is required'),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  priceRange: z.string().optional(),
  openingHours: z.string().optional(),
  mapUrl: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type LocalSeoFormValues = z.infer<typeof localSeoFormSchema>;

interface LocalSeoFormProps {
  initialConfig?: any;
}

export function LocalSeoForm({ initialConfig }: LocalSeoFormProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  const defaultValues: LocalSeoFormValues = {
    businessName: initialConfig?.businessName || '',
    type: initialConfig?.type || 'LocalBusiness',
    streetAddress: initialConfig?.streetAddress || '',
    city: initialConfig?.city || '',
    state: initialConfig?.state || '',
    zipCode: initialConfig?.zipCode || '',
    country: initialConfig?.country || '',
    phone: initialConfig?.phone || '',
    priceRange: initialConfig?.priceRange || '$$',
    openingHours: initialConfig?.openingHours || 'Mo-Fr 09:00-17:00',
    mapUrl: initialConfig?.mapUrl || ''
  };

  const form = useForm<LocalSeoFormValues>({
    resolver: zodResolver(localSeoFormSchema),
    defaultValues
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: LocalSeoFormValues) {
    try {
      const result = await updateLocalSeoConfig(values);

      if (result.success) {
        toast.success('Local SEO configuration updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update configuration');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  if (isMounting) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='businessName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder='My Local Business' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='LocalBusiness'>
                          LocalBusiness
                        </SelectItem>
                        <SelectItem value='Restaurant'>Restaurant</SelectItem>
                        <SelectItem value='Store'>Store</SelectItem>
                        <SelectItem value='ProfessionalService'>
                          ProfessionalService
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='+1-555-0100' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='priceRange'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select price range' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='$'>$ (Cheap)</SelectItem>
                        <SelectItem value='$$'>$$ (Moderate)</SelectItem>
                        <SelectItem value='$$$'>$$$ (Expensive)</SelectItem>
                        <SelectItem value='$$$$'>$$$$ (Luxury)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-sm font-medium'>Address</h3>
              <div className='grid gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='streetAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder='123 Main St' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder='New York' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder='NY' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='zipCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip/Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder='10001' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder='USA' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='openingHours'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Hours (Schema.org format)</FormLabel>
                  <FormControl>
                    <Input placeholder='Mo-Fr 09:00-17:00' {...field} />
                  </FormControl>
                  <FormDescription>Example: Mo-Fr 09:00-17:00</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='mapUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://maps.google.com/...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
