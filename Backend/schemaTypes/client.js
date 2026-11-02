import { UserIcon } from '@sanity/icons'

export default {
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: UserIcon,
  fields: [
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      description: 'e.g., VStrife, rin_draws',
      validation: (Rule) => Rule.required().error('Client Name is required.'),
    },
    {
      name: 'avatar',
      title: 'Client Avatar',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Upload an avatar image for this client. If empty, the website will use the client\'s initials.',
    },
    {
      name: 'clientSince',
      title: 'Client Since',
      type: 'string',
      description: 'e.g., April 2026 (leave empty to automatically compute from oldest review).',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'clientSince',
      media: 'avatar',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Unnamed Client',
        subtitle: subtitle ? `Client since ${subtitle}` : 'Active Client',
        media: media || UserIcon,
      }
    },
  },
}
