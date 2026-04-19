import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional()
});

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid data',
          details: result.error.flatten()
        },
        { status: 400 }
      );
    }

    const data = result.data;

    if (!data.name && !data.email) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const updateData: {
      name?: string;
      email?: string;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existing && existing.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }

      updateData.email = data.email;
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role
      }
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update profile' },
      { status: 500 }
    );
  }
}
