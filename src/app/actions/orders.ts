'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout } from '@/lib/utils';

export async function getOrders() {
  try {
    return await withTimeout(
      prisma.order.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      }),
      10000
    );
  } catch (error) {
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    return await withTimeout(
      prisma.order.findUnique({
        where: { id }
      }),
      10000
    );
  } catch (error) {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await withTimeout(
      prisma.order.update({
        where: { id },
        data: { status }
      }),
      10000
    );
    revalidatePath('/dashboard/orders');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status' };
  }
}

export async function updateOrder(
  id: string,
  data: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    service: string;
    plan: string;
    currency: string;
    monthlyTotal: number;
    termMonths: number;
    contractTotal: number;
    status: string;
    details?: any;
  }
) {
  try {
    await withTimeout(
      prisma.order.update({
        where: { id },
        data: {
          ...data,
          details: data.details ? JSON.stringify(data.details) : undefined
        }
      }),
      10000
    );
    revalidatePath('/dashboard/orders');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update order' };
  }
}

export async function deleteOrder(id: string) {
  try {
    await withTimeout(
      prisma.order.delete({
        where: { id }
      }),
      10000
    );
    revalidatePath('/dashboard/orders');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete order' };
  }
}
