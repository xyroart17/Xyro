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
      type: 'date',
      options: {
        dateFormat: 'MMMM YYYY',
      },
      description: 'Optional. When did this client start commissioning your work? (Falls back to the date of their oldest review if left blank).',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title || 'Unnamed Client',
        media: media || UserIcon,
      }
    },
  },
}
