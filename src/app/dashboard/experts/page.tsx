import { redirect } from 'next/navigation';

export const metadata = {
  title: 'CRM Core'
};

export default function LegacyExpertsRedirect() {
  redirect('/dashboard/crm/deals');
}
