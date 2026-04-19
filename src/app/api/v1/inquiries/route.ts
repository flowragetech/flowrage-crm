import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'unread'
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

        const subjectText = subject || 'New website inquiry';
        const textLines = [
          `Name: ${name}`,
          `Email: ${email}`,
          subjectText ? `Subject: ${subjectText}` : '',
          '',
          message
        ].filter(Boolean);

        await transport.sendMail({
          from: smtp.fromEmail || smtp.user,
          to: toAddress,
          subject: subjectText,
          text: textLines.join('\n')
        });
      }
    } catch (error) {
      void error;
    }

    return NextResponse.json(inquiry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
