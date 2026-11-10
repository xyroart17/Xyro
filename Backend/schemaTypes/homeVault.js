import { StarIcon } from '@sanity/icons'

export default {
  name: 'homeVault',
  title: 'Homepage Vault Showcase',
  type: 'document',
  icon: StarIcon,
  fields: [
    {
      name: 'title',
      title: 'Section Label',
      type: 'string',
      initialValue: 'Homepage Vault Reel',
      description: 'Internal label for this showcase picker.',
    },
    {
      name: 'featuredArtworks',
      title: 'Select Artworks for Homepage Reel',
      type: 'array',
      description: 'Pick artworks (projects or manga) to feature in The Vault marquee on the homepage. You can add as many as you want and drag to reorder them. If empty, the newest artworks will be displayed automatically.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }, { type: 'manga' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      items: 'featuredArtworks',
    },
    prepare({ items }) {
      const count = items ? items.length : 0
      return {
        title: 'Homepage Vault Showcase',
        subtitle: count > 0 ? `${count} artworks selected for reel` : 'Using newest artworks (default)',
        media: StarIcon,
      }
    },
  },
}
