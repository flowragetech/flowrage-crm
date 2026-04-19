'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout, sanitizeAndParseSchema } from '@/lib/utils';

// Blog Posts Actions
export async function getBlogPosts() {
  try {
    return await withTimeout(
      prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          faq: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          seoMetadata: {
            select: {
              id: true
            }
          },
          categories: true,
          tags: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      10000
    );
  } catch {
    return [];
  }
}

export async function getBlogPostById(id: string) {
  try {
    return await withTimeout(
      prisma.blogPost.findUnique({
        where: { id },
        include: {
          seoMetadata: true,
          categories: true,
          tags: true
        }
      }),
      10000
    );
  } catch {
    return null;
  }
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  faq?: string;
  published: boolean;
  categoryIds?: string[];
  tagIds?: string[];
  seoMetadata: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
    schemaMarkup?: any;
  };
}) {
  try {
    const existingPost = await withTimeout(
      prisma.blogPost.findUnique({
        where: { slug: data.slug }
      }),
      10000
    );

    if (existingPost) {
      return {
        success: false,
        error:
          'A blog post with this slug already exists. Please use a different slug.'
      };
    }

    const post = await withTimeout(
      prisma.blogPost.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          featuredImage: data.featuredImage,
          faq: data.faq,
          authorId: 'system', // Default for now
          published: data.published,
          categories: {
            connect: data.categoryIds?.map((id) => ({ id })) || []
          },
          tags: {
            connect: data.tagIds?.map((id) => ({ id })) || []
          },
          seoMetadata: {
            create: {
              metaTitle: data.seoMetadata.metaTitle,
              metaDescription: data.seoMetadata.metaDescription,
              keywords: data.seoMetadata.keywords,
              ogImage: data.seoMetadata.ogImage,
              canonical: data.seoMetadata.canonical,
              schemaMarkup: sanitizeAndParseSchema(
                data.seoMetadata.schemaMarkup
              )
            }
          }
        }
      }),
      10000
    );

    revalidatePath('/dashboard/blog/posts');
    return { success: true, post };
  } catch {
    return { success: false, error: 'Failed to create blog post' };
  }
}

export async function updateBlogPost(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    faq?: string;
    published: boolean;
    categoryIds?: string[];
    tagIds?: string[];
    seoMetadata: {
      id: string;
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      ogImage?: string;
      canonical?: string;
      schemaMarkup?: any;
    };
  }
) {
  try {
    const post = await withTimeout(
      prisma.blogPost.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          featuredImage: data.featuredImage,
          faq: data.faq,
          published: data.published,
          categories: {
            set: data.categoryIds?.map((id) => ({ id })) || []
          },
          tags: {
            set: data.tagIds?.map((id) => ({ id })) || []
          },
          seoMetadata: {
            update: {
              where: { id: data.seoMetadata.id },
              data: {
                metaTitle: data.seoMetadata.metaTitle,
                metaDescription: data.seoMetadata.metaDescription,
                keywords: data.seoMetadata.keywords,
                ogImage: data.seoMetadata.ogImage,
                canonical: data.seoMetadata.canonical,
                schemaMarkup: sanitizeAndParseSchema(
                  data.seoMetadata.schemaMarkup
                )
              }
            }
          }
        }
      }),
      10000
    );

    revalidatePath('/dashboard/blog/posts');
    return { success: true, post };
  } catch {
    return { success: false, error: 'Failed to update blog post' };
  }
}

export async function deleteBlogPost(id: string, seoMetadataId: string) {
  try {
    await withTimeout(
      prisma.blogPost.delete({
        where: { id }
      }),
      10000
    );

    await withTimeout(
      prisma.seoMetadata.delete({
        where: { id: seoMetadataId }
      }),
      10000
    );

    revalidatePath('/dashboard/blog/posts');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete blog post' };
  }
}

export async function updateBlogPostPublished(id: string, published: boolean) {
  try {
    await withTimeout(
      prisma.blogPost.update({
        where: { id },
        data: { published }
      }),
      10000
    );

    revalidatePath('/dashboard/blog/posts');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update publish status' };
  }
}

// Category Actions
export async function getCategoryById(id: string) {
  try {
    return await withTimeout(
      prisma.category.findUnique({
        where: { id },
        include: {
          seoMetadata: true
        }
      }),
      10000
    );
  } catch {
    return null;
  }
}

export async function getCategories() {
  try {
    return await withTimeout(
      prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      }),
      10000
    );
  } catch {
    return [];
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
    schemaMarkup?: any;
  };
}) {
  try {
    const category = await withTimeout(
      prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          seoMetadata: data.seoMetadata
            ? {
                create: {
                  metaTitle: data.seoMetadata.metaTitle,
                  metaDescription: data.seoMetadata.metaDescription,
                  keywords: data.seoMetadata.keywords,
                  ogImage: data.seoMetadata.ogImage,
                  canonical: data.seoMetadata.canonical,
                  schemaMarkup: sanitizeAndParseSchema(
                    data.seoMetadata.schemaMarkup
                  )
                }
              }
            : undefined
        }
      }),
      10000
    );
    revalidatePath('/dashboard/blog/posts');
    revalidatePath('/dashboard/blog/categories');
    return { success: true, category };
  } catch {
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    seoMetadata?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      ogImage?: string;
      canonical?: string;
      schemaMarkup?: any;
    };
  }
) {
  try {
    const category = await withTimeout(
      prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          seoMetadata: data.seoMetadata
            ? {
                upsert: {
                  create: {
                    metaTitle: data.seoMetadata.metaTitle,
                    metaDescription: data.seoMetadata.metaDescription,
                    keywords: data.seoMetadata.keywords,
                    ogImage: data.seoMetadata.ogImage,
                    canonical: data.seoMetadata.canonical,
                    schemaMarkup: sanitizeAndParseSchema(
                      data.seoMetadata.schemaMarkup
                    )
                  },
                  update: {
                    metaTitle: data.seoMetadata.metaTitle,
                    metaDescription: data.seoMetadata.metaDescription,
                    keywords: data.seoMetadata.keywords,
                    ogImage: data.seoMetadata.ogImage,
                    canonical: data.seoMetadata.canonical,
                    schemaMarkup: sanitizeAndParseSchema(
                      data.seoMetadata.schemaMarkup
                    )
                  }
                }
              }
            : undefined
        }
      }),
      10000
    );
    revalidatePath('/dashboard/blog/posts');
    return { success: true, category };
  } catch {
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await withTimeout(
      prisma.category.delete({
        where: { id }
      }),
      10000
    );
    revalidatePath('/dashboard/blog/posts');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete category' };
  }
}

// Tag Actions
export async function getTagById(id: string) {
  try {
    return await withTimeout(
      prisma.tag.findUnique({
        where: { id },
        include: {
          seoMetadata: true
        }
      }),
      10000
    );
  } catch {
    return null;
  }
}

export async function getTags() {
  try {
    return await withTimeout(
      prisma.tag.findMany({
        include: {
          seoMetadata: true
        },
        orderBy: {
          name: 'asc'
        }
      }),
      10000
    );
  } catch {
    return [];
  }
}

export async function createTag(data: {
  name: string;
  slug: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
    schemaMarkup?: any;
  };
}) {
  try {
    const tag = await withTimeout(
      prisma.tag.create({
        data: {
          name: data.name,
          slug: data.slug,
          seoMetadata: data.seoMetadata
            ? {
                create: {
                  metaTitle: data.seoMetadata.metaTitle,
                  metaDescription: data.seoMetadata.metaDescription,
                  keywords: data.seoMetadata.keywords,
                  ogImage: data.seoMetadata.ogImage,
                  canonical: data.seoMetadata.canonical,
                  schemaMarkup: sanitizeAndParseSchema(
                    data.seoMetadata.schemaMarkup
                  )
                }
              }
            : undefined
        }
      }),
      10000
    );
    revalidatePath('/dashboard/blog/posts');
    revalidatePath('/dashboard/blog/tags');
    return { success: true, tag };
  } catch {
    return { success: false, error: 'Failed to create tag' };
  }
}

export async function updateTag(
  id: string,
  data: {
    name: string;
    slug: string;
    seoMetadata?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      ogImage?: string;
      canonical?: string;
      schemaMarkup?: any;
    };
  }
) {
  try {
    const tag = await withTimeout(
      prisma.tag.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          seoMetadata: data.seoMetadata
            ? {
                upsert: {
                  create: {
                    metaTitle: data.seoMetadata.metaTitle,
                    metaDescription: data.seoMetadata.metaDescription,
                    keywords: data.seoMetadata.keywords,
                    ogImage: data.seoMetadata.ogImage,
                    canonical: data.seoMetadata.canonical,
                    schemaMarkup: sanitizeAndParseSchema(
                      data.seoMetadata.schemaMarkup
                    )
                  },
                  update: {
                    metaTitle: data.seoMetadata.metaTitle,
                    metaDescription: data.seoMetadata.metaDescription,
                    keywords: data.seoMetadata.keywords,
                    ogImage: data.seoMetadata.ogImage,
                    canonical: data.seoMetadata.canonical,
                    schemaMarkup: sanitizeAndParseSchema(
                      data.seoMetadata.schemaMarkup
                    )
                  }
                }
              }
            : undefined
        }
      }),
      10000
    );
    revalidatePath('/dashboard/blog/posts');
    revalidatePath('/dashboard/blog/tags');
    return { success: true, tag };
  } catch {
    return { success: false, error: 'Failed to update tag' };
  }
}

export async function deleteTag(id: string) {
  try {
    await withTimeout(
      prisma.tag.delete({
        where: { id }
      }),
      10000
    );
    revalidatePath('/dashboard/blog/posts');
    revalidatePath('/dashboard/blog/tags');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete tag' };
  }
}
