import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const backupPath = path.join(process.cwd(), 'prisma', 'backup.json');
  const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

  // Helper to import simple tables
  const importTable = async (modelName: string, records: any[]) => {
    if (!records || records.length === 0) return;
    // Use createMany if possible, but for tables with JSON or complex types, create loop is safer
    // Also createMany is not supported for SQLite, but here we are on Postgres.
    // However, createMany doesn't support nested writes.
    // We are doing simple writes for most.

    // Using transaction for speed? Or just loop.
    for (const record of records) {
      // Clean up any fields that might cause issues (like Date strings if not automatically handled)
      // Prisma Client handles ISO strings for DateTime fields automatically.
      try {
        await (prisma as any)[modelName].create({
          data: record
        });
      } catch (e: any) {
        void e;
      }
    }
  };

  // 1. Independent or Base tables
  await importTable('seoMetadata', data.seoMetadata);
  await importTable('serviceCategory', data.serviceCategory);
  await importTable('user', data.user);
  await importTable('expertSupportOption', data.expertSupportOption);
  await importTable('reportingOption', data.reportingOption);
  await importTable('siteSettings', data.siteSettings);
  await importTable('notFoundLog', data.notFoundLog);
  await importTable('inquiry', data.inquiry);
  await importTable('globalSeo', data.globalSeo);
  await importTable('redirect', data.redirect);
  await importTable('media', data.media);
  await importTable('order', data.order);
  await importTable('teamMember', data.teamMember);

  // 2. Dependent tables
  await importTable('session', data.session); // Depends on User
  await importTable('category', data.category); // Depends on SeoMetadata
  await importTable('tag', data.tag); // Depends on SeoMetadata
  await importTable('teamPage', data.teamPage); // Depends on SeoMetadata
  await importTable('staticPage', data.staticPage); // Depends on SeoMetadata
  await importTable('portfolio', data.portfolio); // Depends on SeoMetadata
  await importTable('homepage', data.homepage); // Depends on SeoMetadata

  // 3. Service (Depends on ServiceCategory and SeoMetadata)
  await importTable('service', data.service);

  // 4. BlogPost (Complex relations)
  if (data.blogPost && data.blogPost.length > 0) {
    for (const post of data.blogPost) {
      const { categories, tags, ...postData } = post;

      try {
        await prisma.blogPost.create({
          data: {
            ...postData,
            categories: {
              connect: categories
                ? categories.map((c: any) => ({ id: c.id }))
                : []
            },
            tags: {
              connect: tags ? tags.map((t: any) => ({ id: t.id })) : []
            }
          }
        });
      } catch (e: any) {
        void e;
      }
    }
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
