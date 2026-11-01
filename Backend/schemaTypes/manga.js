import AltTextInput from '../components/AltTextInput'
import { BookIcon } from '@sanity/icons'

export default {
  name: 'manga',
  title: 'Manga',
  type: 'document',
  icon: BookIcon,
  groups: [
    {
      name: 'core',
      title: 'Core Info',
      default: true,
    },
    {
      name: 'pages',
      title: 'Manga Pages',
    },
    {
      name: 'wip',
      title: 'WIP (Work In Progress)',
    },
    {
      name: 'social',
      title: 'Links & Social',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'core',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'core',
      description: 'e.g., Chapter 1: The Beginning, Vol. 1, etc.',
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      group: 'core',
      description: 'e.g., Commission, Personal Project, Fanart',
    },
    {
      name: 'genre',
      title: 'Genre',
      type: 'string',
      group: 'core',
      description: 'e.g., Action, Sci-Fi, Dark Fantasy',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'core',
      options: {
        list: [
          { title: 'Ongoing', value: 'Ongoing' },
          { title: 'Completed', value: 'Completed' },
        ],
      },
      initialValue: 'Ongoing',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'core',
      description: 'Toggle to display this manga in the Featured Manga section on the homepage.',
      initialValue: false,
    },
    {
      name: 'publishDate',
      title: 'Publish Date & Time',
      type: 'datetime',
      group: 'core',
      description: 'Determines the sorting order of manga on the website (latest first).',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'tags',
      title: 'Tags / Categories (Vault Filters)',
      type: 'array',
      group: 'core',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: 'Manga', value: 'manga' },
          { title: 'Commission', value: 'commission' },
          { title: 'Original', value: 'original' },
          { title: 'Fan Art', value: 'fanart' },
          { title: 'Traditional', value: 'traditional' },
          { title: 'Digital', value: 'digital' },
        ],
      },
      description: 'Select categories/tags for the Vault gallery display and filtering. Defaults to ["manga"].',
    },
    {
      name: 'year',
      title: 'Manga Year',
      type: 'string',
      group: 'core',
      description: 'e.g., 2026, 2025. Defaults to the year of the Publish Date if left blank.',
    },
    {
      name: 'hue',
      title: 'Manga-Punk Card Hue (0–360)',
      type: 'number',
      group: 'core',
      description: 'Optional neon background tint hue (0=red, 45=yellow, 180=cyan, 270=purple). Automatically calculated from the cover image if left blank.',
      validation: (Rule) => Rule.min(0).max(360),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'pages',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text (For SEO)',
          components: { input: AltTextInput },
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'gridImage',
      title: 'Grid Showcase Image (Optional)',
      type: 'image',
      group: 'pages',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text (For SEO)',
          components: { input: AltTextInput },
        },
      ],
      description: 'Optional. Upload/crop a custom display image specifically for portfolio grids and testimonial cards. If empty, defaults to the Cover Image.',
    },
    {
      name: 'pages',
      title: 'Manga Pages',
      type: 'array',
      group: 'pages',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text (For SEO)',
              components: { input: AltTextInput },
              initialValue: 'Manga Page',
            },
          ],
        },
      ],
      description: 'Upload all manga pages here in order (Right-to-Left sequence). Supports any number of pages.',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'wip',
      title: 'Work in Progress (WIP) Images',
      type: 'array',
      group: 'wip',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              components: { input: AltTextInput },
              initialValue: 'WIP Image',
            },
          ],
        },
      ],
      description: 'Upload work-in-progress sketches or draft pages of this manga (optional).',
    },
    {
      name: 'socialLinks',
      title: 'Where is this hosted?',
      type: 'array',
      group: 'social',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', type: 'string', title: 'Platform (e.g., Instagram, Reddit, DeviantArt, ArtStation)' },
          { name: 'url', type: 'url', title: 'URL' }
        ],
        preview: {
          select: {
            title: 'platform',
            subtitle: 'url'
          }
        }
      }]
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'coverImage',
    },
  },
}
