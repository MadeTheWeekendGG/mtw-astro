import { defineCollection, z } from 'astro:content';

const guide = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    region: z.string(),
    standfirst: z.string().optional(),
    metaDescription: z.string().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    driveMinsFromLondon: z.number().optional(),
    readTime: z.string().optional(),
    published: z.boolean().default(false),
    quickFacts: z.object({
      bestBase: z.string().optional(),
      bestBasePrice: z.string().optional(),
      bestBaseLink: z.string().optional(),
      idealFor: z.string().optional(),
      getThere: z.string().optional(),
    }).optional(),
    faq: z.array(z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    })).optional(),
    author: z.string().optional(),
    authorNote: z.string().optional(),
  }),
});

export const collections = { guide };
