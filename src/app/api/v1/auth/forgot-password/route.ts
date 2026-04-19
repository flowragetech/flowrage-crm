import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import nodemailer from 'nodemailer';

const forgotSchema = z.object({
  email: z.string().email()
});

function parseJson(data: any) {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
}

function applyCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotSchema.safeParse(body);

    if (!result.success) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'Invalid data',
            details: result.error.flatten()
          },
          { status: 400 }
        )
      );
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      return applyCors(request, NextResponse.json({ success: true }));
    }

    const tempPassword =
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10);
    const passwordHash = await hashPassword(tempPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    try {
      const settings = await prisma.siteSettings.findFirst();
      const rawSmtp = (settings as any)?.smtpSettings as any;
      const smtp = parseJson(rawSmtp) as any;
      if (smtp && smtp.host && smtp.user && smtp.password) {
        const port =
          typeof smtp.port === 'string'
            ? parseInt(smtp.port, 10) || 587
            : smtp.port || 587;
        const secure = String(port) === '465';

        const transport = nodemailer.createTransport({
          host: smtp.host,
          port,
          secure,
          auth: {
            user: smtp.user,
            pass: smtp.password
          }
        });

        const fromAddress = smtp.fromEmail || smtp.user;

        const subject = 'Your CRM Core password reset';
        const lines = [
          `Hi ${user.name || 'there'},`,
          '',
          'You requested a password reset for your CRM Core account.',
          '',
          'Here is your new temporary password:',
          '',
          `Email: ${email}`,
          `Temporary password: ${tempPassword}`,
          '',
          'Please sign in and change your password from your profile as soon as possible.',
          '',
          'If you did not request this reset, please contact our support team immediately.'
        ];

        await transport.sendMail({
          from: fromAddress,
          to: email,
          subject,
          text: lines.join('\n')
        });
      }
    } catch (mailError) {
      void mailError;
    }

    return applyCors(request, NextResponse.json({ success: true }));
  } catch {
    return NextResponse.json(
      {
        error: 'Unable to process password reset'
      },
      { status: 500 }
    );
  }
}
