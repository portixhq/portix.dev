import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const knowledge = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/knowledge',
  }),
  schema: z.object({
    // A. Core content
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    quickAnswer: z.string(),
    contentType: z.enum(['guide', 'concept', 'comparison', 'troubleshooting', 'example', 'pillar']),
    category: z.string(),
    primaryTopic: z.string(),
    searchIntent: z.enum(['how-to', 'informational', 'comparison', 'troubleshooting']),
    audience: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),

    // B. Multimedia
    cover: z.object({
      src: z.string(),
      alt: z.string(),
    }),

    // C. Discovery
    entities: z.array(z.string()),
    tags: z.array(z.string()),
    relatedArticles: z.array(z.string()).default([]),

    // D. Evidence
    references: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          publisher: z.string(),
          accessedAt: z.coerce.date(),
        })
      )
      .default([]),

    // E. Publication
    status: z.enum(['draft', 'published', 'archived']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.object({
      name: z.string(),
      type: z.enum(['Organization', 'Person']),
    }),
    featured: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { knowledge };
