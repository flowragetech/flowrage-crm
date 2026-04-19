import { redirect } from 'next/navigation';

export const metadata = {
  title: 'CRM Core'
};

export default function LegacyReportingRedirect() {
  redirect('/dashboard/crm/deals');
}
