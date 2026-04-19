'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { billingInfoContent } from '@/config/infoconfig';
import * as React from 'react';

export default function BillingPage() {
  const [crmPlans, setCrmPlans] = React.useState<
    Array<{
      id: string;
      name: string;
      priceMonthly: number;
      priceYearly?: number;
      description?: string;
      features: string[];
      ctaLabel?: string;
      ctaLink?: string;
    }>
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch('/api/v1/seo', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const rawSchema = data?.schemaMarkup as unknown;
        let schema: any = rawSchema;

        if (typeof rawSchema === 'string') {
          try {
            schema = JSON.parse(rawSchema);
          } catch {
            schema = null;
          }
        }

        const override = schema?.pricingTable ?? [
          {
            id: 'free',
            name: 'Free',
            priceMonthly: 0,
            description: 'Starter features for small teams',
            features: [
              'Basic analytics',
              'Email support',
              'Up to 3 members',
              'Community access'
            ],
            ctaLabel: 'Get Started',
            ctaLink: '/dashboard/workspaces'
          },
          {
            id: 'pro',
            name: 'Pro',
            priceMonthly: 29,
            description: 'Advanced features for growing teams',
            features: [
              'All Free features',
              'Priority support',
              'Unlimited members',
              'Advanced reporting'
            ],
            ctaLabel: 'Upgrade',
            ctaLink: '/dashboard/billing'
          },
          {
            id: 'team',
            name: 'Team',
            priceMonthly: 99,
            description: 'Full suite for organizations',
            features: [
              'All Pro features',
              'SSO & RBAC',
              'Audit logs',
              'SLA & onboarding'
            ],
            ctaLabel: 'Contact Sales',
            ctaLink: '/dashboard/profile'
          }
        ];
        setCrmPlans(override);
      } catch {
        // ignore network errors; defaults will apply
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  return (
    <PageContainer
      isloading={loading}
      access={true}
      accessFallback={null}
      infoContent={billingInfoContent}
      pageTitle='Billing & Plans'
      pageDescription='Manage your subscription and usage limits'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>
              Choose a plan that fits your organization's needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mx-auto max-w-4xl space-y-4'>
              <div className='grid gap-4 md:grid-cols-3'>
                {crmPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <CardTitle className='flex items-center justify-between'>
                        <span>{plan.name}</span>
                        <span className='text-muted-foreground text-sm font-normal'>
                          {plan.description}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-3xl font-bold'>
                          {plan.priceMonthly === 0
                            ? 'Free'
                            : `$${plan.priceMonthly}`}
                        </span>
                        {plan.priceMonthly > 0 && (
                          <span className='text-muted-foreground'>/mo</span>
                        )}
                      </div>
                      <ul className='space-y-2'>
                        {plan.features.map((f, i) => (
                          <li key={i} className='text-sm'>
                            • {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
