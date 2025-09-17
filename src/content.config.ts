import { glob } from 'astro/loaders';
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      tags: z.array(z.string()),
      description: z.string(),
      pubDate: z.string().transform((str) => new Date(str)),
      imgUrl: image(),
      draft: z.boolean().optional().default(false),
    }),
});

const talksCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/data/talks" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      abstract: z.string(),
      date: z.date().or(z.string().transform((str) => new Date(str))),
      link: z.string(),
      name: z.string(),
      img: image(),
    }),
});

export const collections = {
  blog: blogCollection,
  talks: talksCollection
};
