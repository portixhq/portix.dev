import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { knowledgeEntryHref } from '../../lib/knowledge-types';

export async function GET(context: APIContext) {
  const entries = await getCollection('knowledge', ({ data }) => data.status === 'published' && !data.noindex);
  entries.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  return rss({
    title: 'Portix.One Knowledge Base',
    description:
      'Technical guides, concepts, comparisons and troubleshooting resources for printing receipts and thermal documents from web applications.',
    site: context.site ?? 'https://portix.one',
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: knowledgeEntryHref(entry.id),
    })),
  });
}
