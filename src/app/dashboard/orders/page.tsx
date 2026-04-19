import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Deals | CRM Core'
};

export default function LegacyOrdersRedirect() {
  redirect('/dashboard/crm/deals');
}
