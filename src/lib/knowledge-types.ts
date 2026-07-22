export const KNOWLEDGE_TYPES = {
  guides: {
    label: 'Guides',
    description: 'Step-by-step implementation guides for printing from web applications and frameworks.',
    contentType: 'guide',
  },
  concepts: {
    label: 'Concepts',
    description: 'Definitions and fundamentals behind web and thermal printing.',
    contentType: 'concept',
  },
  comparisons: {
    label: 'Comparisons',
    description: 'Portix.One compared against other printing approaches and tools.',
    contentType: 'comparison',
  },
  troubleshooting: {
    label: 'Troubleshooting',
    description: 'Diagnosis and fixes for real printing errors.',
    contentType: 'troubleshooting',
  },
  examples: {
    label: 'Examples',
    description: 'Complete, working implementations you can reference end to end.',
    contentType: 'example',
  },
} as const;

export type KnowledgeTypeSlug = keyof typeof KNOWLEDGE_TYPES;

/** Reverse lookup from a content entry's singular contentType to its plural URL slug. */
export function knowledgeTypeSlugForContentType(contentType: string): KnowledgeTypeSlug {
  const match = (Object.entries(KNOWLEDGE_TYPES) as [KnowledgeTypeSlug, (typeof KNOWLEDGE_TYPES)[KnowledgeTypeSlug]][])
    .find(([, meta]) => meta.contentType === contentType);
  if (!match) throw new Error(`No knowledge type slug registered for contentType "${contentType}"`);
  return match[0];
}

/** Strips the source file extension so a content entry id routes as `/knowledge/<id>`. */
export function knowledgeEntryHref(id: string) {
  return `/knowledge/${id.replace(/\.md$/, '')}`;
}
