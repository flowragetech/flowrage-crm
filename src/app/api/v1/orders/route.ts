import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SESSION_COOKIE_NAME, createSession, hashPassword } from '@/lib/auth';
import { Role } from '@prisma/client';

function applyCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      service,
      plan,
      currency,
      monthlyTotal,
      termMonths,
      contractTotal,
      status,
      details
    } = body;

    const parsedMonthlyTotal = Number(monthlyTotal);
    const parsedTermMonths = termMonths ? Number(termMonths) : 0;
    const parsedContractTotal = contractTotal ? Number(contractTotal) : 0;

    if (
      !service ||
      !plan ||
      !currency ||
      !Number.isFinite(parsedMonthlyTotal)
    ) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'service, plan, currency and monthlyTotal are required'
          },
          { status: 400 }
        )
      );
    }

    let user: any = null;
    let generatedPassword: string | null = null;

    try {
      if (email) {
        user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          const randomPassword =
            Math.random().toString(36).slice(2, 10) +
            Math.random().toString(36).slice(2, 10);
          const passwordHash = await hashPassword(randomPassword);

          user = await prisma.user.create({
            data: {
              email,
              name: name || null,
              passwordHash,
              role: Role.CUSTOMER,
              isActive: true
            }
          });

          generatedPassword = randomPassword;
        }
      }
    } catch (userError) {
      // If user creation fails for any reason, continue with order creation only
      user = null;
      generatedPassword = null;
      void userError;
    }

    const order = await prisma.order.create({
      data: {
        name: name || null,
        email: email || null,
        phone: phone || null,
        service,
        plan,
        currency,
        monthlyTotal: parsedMonthlyTotal,
        termMonths: Number.isFinite(parsedTermMonths) ? parsedTermMonths : 0,
        contractTotal: Number.isFinite(parsedContractTotal)
          ? parsedContractTotal
          : 0,
        status: status || 'new',
        details: details ? JSON.stringify(details) : JSON.stringify(body)
      }
    });

    try {
      const settings = await prisma.siteSettings.findFirst();
      const smtp = (settings as any)?.smtpSettings as any;
      if (smtp && smtp.host && smtp.user && smtp.password) {
        const transport = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port || 587,
          secure: smtp.port === 465,
          auth: {
            user: smtp.user,
            pass: smtp.password
          }
        });

        const toAddress =
          (settings as any)?.contactInfo?.email || smtp.fromEmail || smtp.user;

        const subject = `New order: ${service} - ${plan}`;
        const textLines = [
          `Service: ${service}`,
          `Plan: ${plan}`,
          `Customer: ${name || 'N/A'} (${email || 'no email'})`,
          `Phone: ${phone || 'N/A'}`,
          `Currency: ${currency}`,
          `Monthly Total: ${parsedMonthlyTotal}`,
          `Term Months: ${parsedTermMonths || 0}`,
          `Contract Total: ${parsedContractTotal || 0}`
        ];

        await transport.sendMail({
          from: smtp.fromEmail || smtp.user,
          to: toAddress,
          subject,
          text: textLines.join('\n')
        });

        if (email && generatedPassword) {
          const customerSubject = 'Your CRM Core portal access';
          const customerLines = [
            `Hi ${name || 'there'},`,
            '',
            `Thank you for your order for ${service} - ${plan}.`,
            '',
            'We have created your client portal account with the following credentials:',
            `Email: ${email}`,
            `Temporary password: ${generatedPassword}`,
            '',
            'You can sign in from the client portal and change your password after your first login.',
            '',
            'If you did not request this, please contact our support team.'
          ];

          await transport.sendMail({
            from: smtp.fromEmail || smtp.user,
            to: email,
            subject: customerSubject,
            text: customerLines.join('\n')
          });
        }
      }
    } catch (error) {
      void error;
    }

    const baseResponse = NextResponse.json(
      {
        order,
        user: user
          ? {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          : null,
        createdUser: !!generatedPassword
      },
      { status: 201 }
    );

    if (user) {
      try {
        const { sessionToken, expires } = await createSession(user.id);

        baseResponse.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          expires
        });
      } catch (sessionError) {
        void sessionError;
      }
    }

    return applyCors(request, baseResponse);
  } catch (error) {
    let message = 'Internal Server Error';

    if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
