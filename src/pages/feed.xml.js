import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET({ site }) {
  const blog = await getCollection('blog');
  const items = blog
    .map((post) => ({
      title: post.data.title.trim(),
      pubDate: post.data.pubDate,
      description: post.data.description.trim(),
      link: `/blog/${post.id}/`,
    }))


  return rss({
    title: 'Valerio Como',
    description: 'Software engineer born and bread in Puglia',
    stylesheet: false,
    site,
    items,
    customData: '<language>en-us</language>',
    canonicalUrl: 'https://valeriocomo.dev',
  });
}
