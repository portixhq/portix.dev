export const KNOWLEDGE_TYPES = {
  guides: {
    label: 'Guides',
    description: 'Step-by-step implementation guides for printing from web applications and frameworks.',
  },
  concepts: {
    label: 'Concepts',
    description: 'Definitions and fundamentals behind web and thermal printing.',
  },
  comparisons: {
    label: 'Comparisons',
    description: 'Portix.One compared against other printing approaches and tools.',
  },
  troubleshooting: {
    label: 'Troubleshooting',
    description: 'Diagnosis and fixes for real printing errors.',
  },
  examples: {
    label: 'Examples',
    description: 'Complete, working implementations you can reference end to end.',
  },
} as const;

export type KnowledgeTypeSlug = keyof typeof KNOWLEDGE_TYPES;

/** Strips the source file extension so a content entry id routes as `/knowledge/<id>`. */
export function knowledgeEntryHref(id: string) {
  return `/knowledge/${id.replace(/\.md$/, '')}`;
}
