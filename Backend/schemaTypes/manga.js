import AltTextInput from '../components/AltTextInput'

export default {
  name: 'manga',
  title: 'Manga',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
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
      description: 'e.g., Chapter 1: The Beginning, Vol. 1, etc.',
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'e.g., Commission, Personal Project, Fanart',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
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
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'pages',
      title: 'Manga Pages',
      type: 'array',
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
      name: 'genre',
      title: 'Genre',
      type: 'string',
      description: 'e.g., Action, Sci-Fi, Dark Fantasy',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
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
      description: 'Toggle to display this manga in the Featured Manga section on the homepage.',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Determines the sorting order of manga on the homepage (ascending).',
      initialValue: 0,
    },
    {
      name: 'socialLinks',
      title: 'Where is this hosted?',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', type: 'string', title: 'Platform (e.g., Instagram, Reddit, DeviantArt, ArtStation)' },
          { name: 'url', type: 'url', title: 'URL' }
        ]
      }]
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
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
