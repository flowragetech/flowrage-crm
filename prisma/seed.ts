/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

const defaultFeatures = JSON.stringify([
  { title: 'Data-Driven Approach', icon: 'BarChart3' },
  { title: 'Global Standards', icon: 'Globe' },
  { title: 'High Performance', icon: 'Zap' },
  { title: 'Security First', icon: 'ShieldCheck' }
]);

const categories = [
  {
    id: 'digital-engineering',
    title: 'Digital Engineering & Development',
    description:
      'Building robust, scalable, and high-performance digital products that drive business value.',
    icon: 'Code2',
    items: [
      {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        description:
          'Custom iOS and Android applications built with cutting-edge technologies for seamless user experiences.',
        icon: 'Smartphone',
        content: `
          <p>Our mobile app development services focus on creating intuitive, high-performance applications for both iOS and Android platforms. We leverage the latest frameworks like React Native and Flutter to deliver native-quality experiences with cross-platform efficiency.</p>
          <h3>Our Approach</h3>
          <ul>
            <li><strong>User-Centric Design:</strong> We prioritize the user journey to ensure high engagement and retention.</li>
            <li><strong>Performance First:</strong> Optimized code and efficient data handling for smooth operation.</li>
            <li><strong>Security:</strong> Robust implementation of security protocols to protect user data.</li>
            <li><strong>Scalability:</strong> Apps built to grow alongside your user base.</li>
          </ul>
          <p>From initial concept to App Store launch and ongoing maintenance, we provide end-to-end support for your mobile strategy.</p>
        `
      },
      {
        title: 'Web Development',
        slug: 'web-development',
        description:
          'High-performance, responsive websites and web applications tailored to your business objectives.',
        icon: 'Globe',
        content: `
          <p>We build modern web experiences using the latest technologies like Next.js, React, and Tailwind CSS. Our websites are not just visually stunning but are built for speed, SEO, and conversion.</p>
          <h3>Core Capabilities</h3>
          <ul>
            <li><strong>Next-Gen Performance:</strong> Server-side rendering and static site generation for lightning-fast speeds.</li>
            <li><strong>Responsive Design:</strong> Perfect experiences across mobile, tablet, and desktop.</li>
            <li><strong>SEO Optimization:</strong> Built-in technical SEO to help you rank higher from day one.</li>
            <li><strong>Custom CMS:</strong> Easy-to-manage content systems tailored to your workflow.</li>
          </ul>
          <p>Whether you need a high-converting landing page or a complex web portal, we have the expertise to deliver.</p>
        `
      },
      {
        title: 'SaaS Development',
        slug: 'saas-development',
        description:
          'End-to-end development of scalable Software-as-a-Service platforms with robust architectures.',
        icon: 'Cloud',
        content: `
          <p>Building a SaaS product requires a deep understanding of multi-tenancy, security, and scalability. We help startups and enterprises build robust SaaS platforms that solve real-world problems.</p>
          <h3>SaaS Expertise</h3>
          <ul>
            <li><strong>Multi-tenant Architecture:</strong> Secure and isolated data management for multiple clients.</li>
            <li><strong>Subscription Management:</strong> Integration with Stripe and other billing platforms.</li>
            <li><strong>API-First Design:</strong> Building for integration and future-proofing.</li>
            <li><strong>Cloud Native:</strong> Optimized for AWS, Azure, or GCP for maximum reliability.</li>
          </ul>
          <p>We guide you from MVP development to full-scale enterprise software.</p>
        `
      },
      {
        title: 'eCommerce Solutions',
        slug: 'ecommerce-solutions',
        description:
          'Scalable online stores and marketplaces designed to maximize sales and customer loyalty.',
        icon: 'ShoppingCart',
        content: `
          <p>Our eCommerce solutions are designed to drive revenue. We specialize in Shopify, Headless Commerce, and custom marketplaces that provide seamless shopping experiences.</p>
          <h3>E-commerce Focus</h3>
          <ul>
            <li><strong>Conversion Optimization:</strong> Streamlined checkout processes and persuasive UI.</li>
            <li><strong>Inventory Management:</strong> Robust backends for tracking stock across channels.</li>
            <li><strong>Payment Integration:</strong> Secure and varied payment gateway implementations.</li>
            <li><strong>Marketing Integration:</strong> Built-in tools for tracking, email marketing, and upsells.</li>
          </ul>
          <p>Grow your online presence and increase your bottom line with our tailored eCommerce strategies.</p>
        `
      },
      {
        title: 'API Integration',
        slug: 'api-integration',
        description:
          'Seamlessly connecting your digital ecosystem through robust and secure API integrations.',
        icon: 'Layers',
        content: `
          <p>Modern businesses run on multiple software platforms. We provide expert API integration services to ensure your systems communicate effectively and share data seamlessly.</p>
          <h3>Integration Services</h3>
          <ul>
            <li><strong>Third-party APIs:</strong> Connecting with CRMs, ERPs, and Marketing tools.</li>
            <li><strong>Custom API Development:</strong> Building secure endpoints for your own products.</li>
            <li><strong>Webhook Implementation:</strong> Real-time data synchronization across platforms.</li>
            <li><strong>Legacy System Integration:</strong> Bringing modern connectivity to older software.</li>
          </ul>
          <p>Reduce manual data entry and improve efficiency with automated system connectivity.</p>
        `
      }
    ]
  },
  {
    id: 'strategic-solutions',
    title: 'Strategic Digital Solutions',
    description:
      'Navigating the digital landscape with expert strategy, design, and growth-focused initiatives.',
    icon: 'Sparkles',
    items: [
      {
        title: 'Digital Transformation',
        slug: 'digital-transformation',
        description:
          'Modernizing your business processes and customer experiences through strategic technology adoption.',
        icon: 'Sparkles',
        content: `
          <p>Digital transformation is about more than just technology; it's about reimagining your business for the digital age. We help you modernize workflows and customer touchpoints.</p>
          <h3>Transformation Pillars</h3>
          <ul>
            <li><strong>Strategy Consulting:</strong> Identifying opportunities for digital growth.</li>
            <li><strong>Process Automation:</strong> Eliminating bottlenecks with smart software solutions.</li>
            <li><strong>Data Analytics:</strong> Turning your data into actionable business intelligence.</li>
            <li><strong>Change Management:</strong> Helping your team adapt to new digital tools.</li>
          </ul>
        `
      },
      {
        title: 'Software Product Engineering',
        slug: 'software-product-engineering',
        description:
          'Full-lifecycle product development from ideation and prototyping to full-scale engineering.',
        icon: 'Code2',
        content: `
          <p>We take your product from idea to reality. Our product engineering services cover the entire lifecycle, ensuring technical excellence and market fit.</p>
          <h3>Engineering Excellence</h3>
          <ul>
            <li><strong>Prototyping & MVPs:</strong> Rapid development to test your core assumptions.</li>
            <li><strong>Full-stack Engineering:</strong> Robust frontend and backend development.</li>
            <li><strong>Quality Assurance:</strong> Rigorous testing for reliability and performance.</li>
            <li><strong>Deployment:</strong> Secure and automated release management.</li>
          </ul>
        `
      },
      {
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        description:
          'User-centric design that blends aesthetics with functionality to create engaging digital products.',
        icon: 'Palette',
        content: `
          <p>Great design is invisible. We create intuitive interfaces and engaging user experiences that make your digital products a joy to use.</p>
          <h3>Design Process</h3>
          <ul>
            <li><strong>User Research:</strong> Understanding your audience's needs and pain points.</li>
            <li><strong>Wireframing:</strong> Mapping out the user journey and information architecture.</li>
            <li><strong>Visual Design:</strong> Creating beautiful, brand-aligned interfaces.</li>
            <li><strong>Prototyping:</strong> Interactive models to test and refine the design.</li>
          </ul>
        `
      },
      {
        title: 'SEO',
        slug: 'seo',
        description:
          'Strategic search engine optimization to boost your organic visibility and drive qualified traffic.',
        icon: 'SearchCode',
        content: `
          <p>SEO is the foundation of digital growth. We use data-driven strategies to improve your rankings and drive high-intent traffic to your site.</p>
          <h3>SEO Services</h3>
          <ul>
            <li><strong>Technical SEO:</strong> Ensuring search engines can crawl and index your site.</li>
            <li><strong>Keyword Research:</strong> Targeting terms that drive revenue, not just traffic.</li>
            <li><strong>Content Strategy:</strong> Building authority through high-quality, relevant content.</li>
            <li><strong>Link Building:</strong> Earning high-quality backlinks to boost your domain authority.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'infrastructure-support',
    title: 'Infrastructure & Optimization',
    description:
      'Ensuring your digital platforms are secure, scalable, and consistently high-performing.',
    icon: 'Settings',
    items: [
      {
        title: 'Cloud Services',
        slug: 'cloud-services',
        description:
          'Scalable cloud infrastructure design, migration, and management for modern businesses.',
        icon: 'Server',
        content: `
          <p>Leverage the power of the cloud to scale your business. We provide expert cloud consulting and management services across all major platforms.</p>
          <h3>Cloud Expertise</h3>
          <ul>
            <li><strong>Cloud Migration:</strong> Moving your assets safely and efficiently to the cloud.</li>
            <li><strong>Infrastructure as Code:</strong> Managing your cloud environment with automation.</li>
            <li><strong>Cost Optimization:</strong> Reducing your cloud spend while maintaining performance.</li>
            <li><strong>Disaster Recovery:</strong> Ensuring your business stays online no matter what.</li>
          </ul>
        `
      },
      {
        title: 'DevOps Services',
        slug: 'devops-services',
        description:
          'Streamlining your development and operations through automation and modern CI/CD practices.',
        icon: 'Settings',
        content: `
          <p>DevOps is a culture of collaboration and automation. We help you speed up your release cycles and improve software quality through modern DevOps practices.</p>
          <h3>DevOps Pillars</h3>
          <ul>
            <li><strong>CI/CD Pipelines:</strong> Automating build, test, and deployment processes.</li>
            <li><strong>Containerization:</strong> Using Docker and Kubernetes for consistent environments.</li>
            <li><strong>Monitoring & Alerting:</strong> Real-time visibility into your system's health.</li>
            <li><strong>Security Integration:</strong> DevSecOps to build security into every stage.</li>
          </ul>
        `
      },
      {
        title: 'Quality Assurance',
        slug: 'quality-assurance',
        description:
          'Comprehensive testing and QA services to ensure your software is bug-free and reliable.',
        icon: 'ShieldCheck',
        content: `
          <p>Deliver software with confidence. Our QA services ensure your products meet the highest standards of quality, performance, and security.</p>
          <h3>QA Services</h3>
          <ul>
            <li><strong>Automated Testing:</strong> Scaling your testing efforts with smart automation.</li>
            <li><strong>Manual Testing:</strong> Human-led exploration to find complex issues.</li>
            <li><strong>Performance Testing:</strong> Ensuring your app stays fast under load.</li>
            <li><strong>Security Audits:</strong> Identifying and fixing vulnerabilities.</li>
          </ul>
        `
      },
      {
        title: 'Maintenance & Support',
        slug: 'maintenance-support',
        description:
          'Ongoing technical support and maintenance to keep your digital assets running smoothly.',
        icon: 'HelpCircle',
        content: `
          <p>Your digital products need ongoing care to stay competitive. We provide reliable maintenance and support services to keep your systems updated and secure.</p>
          <h3>Support Services</h3>
          <ul>
            <li><strong>Security Updates:</strong> Regular patching to protect against new threats.</li>
            <li><strong>Performance Monitoring:</strong> Proactive identification of bottlenecks.</li>
            <li><strong>Bug Fixing:</strong> Rapid response to any issues that arise.</li>
            <li><strong>Feature Enhancements:</strong> Keeping your product growing with your business.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'seo-digital-marketing',
    title: 'SEO & Digital Marketing',
    description:
      'Comprehensive SEO and digital marketing solutions to boost your online presence.',
    icon: 'BarChart3',
    items: [
      {
        title: 'Managed SEO Services',
        slug: 'managed-seo-services',
        description:
          'Complete hands-off SEO management to consistently improve your rankings and organic traffic.',
        icon: 'BarChart3',
        content: `
          <p>Our Managed SEO Services provide a complete, hands-off solution for businesses looking to dominate search results. We handle everything from strategy to execution.</p>
          <h3>What We Include</h3>
          <ul>
            <li><strong>Strategic Planning:</strong> Customized SEO roadmaps aligned with your business goals.</li>
            <li><strong>Continuous Optimization:</strong> Regular updates to on-page and off-page elements.</li>
            <li><strong>Monthly Reporting:</strong> Transparent reports showing your growth and ROI.</li>
            <li><strong>Competitor Analysis:</strong> Staying ahead of the competition with deep insights.</li>
          </ul>
        `
      },
      {
        title: 'AI SEO Services',
        slug: 'ai-seo-services',
        description:
          'Leveraging artificial intelligence to optimize your content and strategy at scale.',
        icon: 'Bot',
        content: `
          <p>Harness the power of AI to supercharge your SEO efforts. Our AI SEO Services use advanced algorithms to analyze data, predict trends, and optimize content faster than ever before.</p>
          <h3>AI-Driven Advantages</h3>
          <ul>
            <li><strong>Predictive Analytics:</strong> Forecasting trends to capture traffic before it peaks.</li>
            <li><strong>Content Optimization:</strong> AI-assisted writing and optimization for maximum relevance.</li>
            <li><strong>Data Processing:</strong> Analyzing vast amounts of search data to find hidden opportunities.</li>
          </ul>
        `
      },
      {
        title: 'Digital Marketing Services',
        slug: 'digital-marketing-services',
        description:
          'Holistic digital marketing strategies including PPC, Social Media, and more.',
        icon: 'Zap',
        content: `
          <p>Beyond SEO, our Digital Marketing Services cover the full spectrum of online promotion. We build integrated campaigns that drive brand awareness and conversions.</p>
          <h3>Our Channels</h3>
          <ul>
            <li><strong>Social Media Marketing:</strong> Engaging your audience on platforms where they spend time.</li>
            <li><strong>Email Marketing:</strong> Nurturing leads and building customer loyalty.</li>
            <li><strong>Display Advertising:</strong> Visual ads to capture attention across the web.</li>
          </ul>
        `
      },
      {
        title: 'Local SEO Services',
        slug: 'local-seo-services',
        description:
          'Dominate your local market and attract customers in your specific geographic area.',
        icon: 'Globe',
        content: `
          <p>For businesses serving specific locations, Local SEO is crucial. We help you appear in "Near Me" searches and Google Maps results to drive foot traffic and local leads.</p>
          <h3>Local Strategies</h3>
          <ul>
            <li><strong>GMB Optimization:</strong> Fully optimizing your Google My Business profile.</li>
            <li><strong>Local Citations:</strong> Building consistent NAP (Name, Address, Phone) mentions.</li>
            <li><strong>Reviews Management:</strong> Helping you generate and manage customer reviews.</li>
          </ul>
        `
      },
      {
        title: 'Enterprise SEO Services',
        slug: 'enterprise-seo-services',
        description:
          'Scalable SEO solutions for large websites and enterprise-level organizations.',
        icon: 'Building2',
        content: `
          <p>Large organizations face unique SEO challenges. Our Enterprise SEO Services are built to handle complex site architectures, thousands of pages, and multiple stakeholders.</p>
          <h3>Enterprise Solutions</h3>
          <ul>
            <li><strong>Scalable Architecture:</strong> optimizing site structure for massive crawling efficiency.</li>
            <li><strong>Governance:</strong> Establishing SEO guidelines across departments.</li>
            <li><strong>Global SEO:</strong> Managing multi-language and multi-regional implementations.</li>
          </ul>
        `
      },
      {
        title: 'PPC Services',
        slug: 'ppc-services',
        description:
          'Pay-Per-Click management to drive immediate, targeted traffic to your website.',
        icon: 'SearchCode',
        content: `
          <p>Get instant visibility with our expert PPC management. We create high-converting campaigns on Google Ads, Bing, and social media platforms.</p>
          <h3>PPC Focus</h3>
          <ul>
            <li><strong>Keyword Targeting:</strong> Identifying high-intent keywords for maximum ROI.</li>
            <li><strong>Ad Copywriting:</strong> Compelling ad text that drives clicks and conversions.</li>
            <li><strong>Landing Page Optimization:</strong> Ensuring your traffic turns into customers.</li>
          </ul>
        `
      },
      {
        title: 'SEO Audit',
        slug: 'seo-audit',
        description:
          "In-depth analysis of your website's health, identifying technical issues and growth opportunities.",
        icon: 'SearchCode',
        content: `
          <p>Know exactly where you stand with a comprehensive SEO Audit. We analyze every aspect of your site to uncover issues holding you back.</p>
          <h3>Audit Scope</h3>
          <ul>
            <li><strong>Technical Health:</strong> Checking for crawl errors, broken links, and speed issues.</li>
            <li><strong>On-Page Analysis:</strong> Reviewing content, meta tags, and internal linking.</li>
            <li><strong>Backlink Profile:</strong> Assessing the quality and toxicity of your inbound links.</li>
          </ul>
        `
      },
      {
        title: 'Content Marketing',
        slug: 'content-marketing',
        description:
          'Creating valuable content that attracts, engages, and converts your target audience.',
        icon: 'FileText',
        content: `
          <p>Content is king. Our Content Marketing services help you become a thought leader in your industry while driving organic traffic.</p>
          <h3>Content Types</h3>
          <ul>
            <li><strong>Blog Posts:</strong> Informative articles that answer customer questions.</li>
            <li><strong>Whitepapers:</strong> In-depth resources for lead generation.</li>
            <li><strong>Infographics:</strong> Visual content that earns shares and backlinks.</li>
          </ul>
        `
      },
      {
        title: 'Link Building',
        slug: 'link-building',
        description:
          'Acquiring high-quality backlinks to increase your domain authority and search rankings.',
        icon: 'Layers',
        content: `
          <p>Backlinks are a top ranking factor. Our ethical Link Building services help you earn authority from reputable websites in your niche.</p>
          <h3>Building Authority</h3>
          <ul>
            <li><strong>Outreach:</strong> Connecting with relevant publishers and bloggers.</li>
            <li><strong>Guest Posting:</strong> Contributing high-quality content to authoritative sites.</li>
            <li><strong>Broken Link Building:</strong> Turning broken links on other sites into opportunities.</li>
          </ul>
        `
      }
    ]
  }
];

const footerData = {
  description:
    'Flowrage is a premier digital agency in Nepal that empowers brands with data-driven marketing and innovative technology. We help local and global businesses scale their online presence and achieve measurable growth.',
  copyrightText: '© 2026 Flowrage. All rights reserved.',
  columns: [
    {
      title: 'Services',
      links: [
        { label: 'Website Development', href: '/services' },
        { label: 'Search Engine Optimization', href: '/services' },
        { label: 'Digital Marketing', href: '/services' },
        { label: 'Pay-Per-Click Advertising', href: '/services' },
        { label: 'Social Media Marketing', href: '/services' },
        { label: 'Email Marketing', href: '/services' }
      ]
    },
    {
      title: 'Training',
      links: [
        { label: 'SEO Training', href: '/training' },
        { label: 'Digital Marketing Training', href: '/training' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' }
      ]
    }
  ],
  bottomLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Return & Refund Policy', href: '/refund-policy' }
  ]
};

const contactInfo = {
  email: 'info@flowrage.com',
  phone: '+977 9708052941',
  whatsapp: '+977 9708052941',
  address: 'Imadole, Lalitpur 44705, Nepal'
};

const socialLinks = {
  twitter: 'https://twitter.com/flowrage',
  linkedin: 'https://linkedin.com/company/flowrage',
  instagram: 'https://instagram.com/flowrage',
  facebook: 'https://facebook.com/flowrage'
};

async function main() {
  console.log('Seeding categories and services...');

  let catOrder = 0;
  for (const cat of categories) {
    catOrder++;
    // Create/Update Category
    const category = await prisma.serviceCategory.upsert({
      where: { slug: cat.id },
      update: {
        name: cat.title,
        description: cat.description,
        icon: cat.icon,
        order: catOrder
      },
      create: {
        name: cat.title,
        slug: cat.id,
        description: cat.description,
        icon: cat.icon,
        order: catOrder
      }
    });

    console.log(`Processed category: ${cat.title}`);

    let itemOrder = 0;
    for (const item of cat.items) {
      itemOrder++;
      // Create/Update Service
      await prisma.service.upsert({
        where: { slug: item.slug },
        update: {
          name: item.title,
          description: item.description,
          icon: item.icon,
          content: item.content,
          category: {
            connect: { id: category.id }
          },
          features: defaultFeatures,
          order: itemOrder,
          seoMetadata: {
            upsert: {
              create: {
                metaTitle: `${item.title} | Flowrage Services`,
                metaDescription: item.description
              },
              update: {
                metaTitle: `${item.title} | Flowrage Services`,
                metaDescription: item.description
              }
            }
          }
        },
        create: {
          name: item.title,
          slug: item.slug,
          description: item.description,
          icon: item.icon,
          content: item.content,
          features: defaultFeatures,
          category: {
            connect: { id: category.id }
          },
          order: itemOrder,
          seoMetadata: {
            create: {
              metaTitle: `${item.title} | Flowrage Services`,
              metaDescription: item.description
            }
          }
        }
      });
      console.log(`Processed service: ${item.title}`); // eslint-disable-line no-console
    }
  }

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const password = 'Admin@123';
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email: 'admin@flowrage.local',
        name: 'Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN'
      }
    });
    console.log('Created super admin user');
  }

  // Seed Footer and Site Settings
  console.log('Seeding footer and site settings data...');
  const existingSettings = await prisma.siteSettings.findFirst();

  if (existingSettings) {
    await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: {
        footerData: JSON.stringify(footerData),
        contactInfo: JSON.stringify(contactInfo),
        socialLinks: JSON.stringify(socialLinks)
      }
    });
    console.log(
      'Updated existing settings with footer, contact, and social data.'
    );
  } else {
    await prisma.siteSettings.create({
      data: {
        siteName: 'Flowrage',
        footerData: JSON.stringify(footerData),
        contactInfo: JSON.stringify(contactInfo),
        socialLinks: JSON.stringify(socialLinks)
      }
    });
    console.log('Created new settings with footer, contact, and social data.');
  }

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {});
