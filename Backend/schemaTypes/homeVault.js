import { StarIcon } from '@sanity/icons'

export default {
  name: 'homeVault',
  title: 'Homepage Top 4 Artworks',
  type: 'document',
  icon: StarIcon,
  fields: [
    {
      name: 'title',
      title: 'Section Label',
      type: 'string',
      initialValue: 'Homepage Vault (Top 4 Artworks)',
      description: 'Internal label for this showcase picker.',
    },
    {
      name: 'featuredArtworks',
      title: 'Select 4 Artworks for Homepage',
      type: 'array',
      description: 'Pick up to 4 artworks (projects or manga) to feature in The Vault section on the homepage. Drag to reorder slots 1 through 4.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }, { type: 'manga' }],
        },
      ],
      validation: (Rule) => Rule.max(4).warning('Only the first 4 artworks will be shown on the homepage.'),
    },
  ],
  preview: {
    select: {
      items: 'featuredArtworks',
    },
    prepare({ items }) {
      const count = items ? items.length : 0
      return {
        title: 'Homepage Top 4 Artworks',
        subtitle: count > 0 ? `${count} of 4 slots selected` : 'Using newest artworks (default)',
        media: StarIcon,
      }
    },
  },
}
