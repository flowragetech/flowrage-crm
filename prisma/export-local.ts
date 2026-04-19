import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const data: any = {};
  const models = [
    'seoMetadata',
    'serviceCategory',
    'user',
    'expertSupportOption',
    'reportingOption',
    'siteSettings',
    'notFoundLog',
    'inquiry',
    'globalSeo',
    'redirect',
    'media',
    'order',
    'teamMember',
    'session',
    'category',
    'tag',
    'teamPage',
    'staticPage',
    'portfolio',
    'homepage',
    'service',
    'blogPost'
  ];

  for (const model of models) {
    try {
      if (model === 'blogPost') {
        data[model] = await (prisma as any)[model].findMany({
          include: {
            categories: { select: { id: true } },
            tags: { select: { id: true } }
          }
        });
      } else {
        data[model] = await (prisma as any)[model].findMany();
      }
      void 0;
    } catch (e: any) {
      data[model] = [];
    }
  }

  const outputPath = path.join(process.cwd(), 'prisma', 'backup.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
