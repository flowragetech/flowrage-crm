'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/utils';
import { dealSchema, type DealRecord } from '@/features/crm/schema/deal';

function normalizeDeal(order: any): DealRecord {
  const details =
    typeof order.details === 'string'
      ? JSON.parse(order.details || '{}')
      : order.details || {};

  return dealSchema.parse({
    id: order.id,
    name: order.name,
    email: order.email,
    status: order.status ?? 'new',
    value:
      typeof order.contractTotal === 'number'
        ? order.contractTotal
        : typeof order.monthlyTotal === 'number'
          ? order.monthlyTotal
          : 0,
    pipelineStage:
      details.pipelineStage || details.stage || order.plan || 'new-business',
    customFields: {
      phone: order.phone,
      currency: order.currency,
      plan: order.plan,
      service: order.service,
      termMonths: order.termMonths,
      monthlyTotal: order.monthlyTotal,
      ...details
    }
  });
}

export async function getDeals() {
  try {
    const orders = await withTimeout(
      prisma.order.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      }),
      10000
    );

    return orders.map(normalizeDeal);
  } catch {
    return [];
  }
}

export async function updateDealStage(id: string, pipelineStage: string) {
  try {
    const order = await prisma.order.findUnique({ where: { id } });
    const details =
      typeof order?.details === 'string'
        ? JSON.parse(order.details || '{}')
        : order?.details || {};

    await withTimeout(
      prisma.order.update({
        where: { id },
        data: {
          details: JSON.stringify({
            ...details,
            pipelineStage
          })
        }
      }),
      10000
    );

    revalidatePath('/dashboard/crm/deals');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update deal stage' };
  }
}
