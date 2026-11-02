import { HeartIcon } from '@sanity/icons'

export default {
  name: 'testimonial',
  title: 'Client Review',
  type: 'document',
  icon: HeartIcon,
  fields: [
    {
      name: 'clientRef',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      description: 'Select the client who gave this review.',
      validation: (Rule) => Rule.required().error('Please select a client profile.'),
    },
    {
      name: 'quote',
      title: 'Review Quote',
      type: 'text',
      rows: 4,
      description: 'The testimonial quote from the client.',
      validation: (Rule) => Rule.required().error('Review quote is required.'),
    },
    {
      name: 'clientTitle',
      title: 'Commission Tag / Badge',
      type: 'string',
      description: 'e.g., Manga, Original Character, OC Design, Character Trio',
    },
    {
      name: 'projectRef',
      title: 'Associated Project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Optional. Link this review to a portfolio artwork.',
    },
    {
      name: 'mangaRef',
      title: 'Associated Manga',
      type: 'reference',
      to: [{ type: 'manga' }],
      description: 'Optional. Link this review to a published manga.',
    },
    {
      name: 'cardImage',
      title: 'Custom Display Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. If left blank, automatically displays the image from the linked project or manga.',
    },
    {
      name: 'reviewDate',
      title: 'Review Date',
      type: 'date',
      options: {
        dateFormat: 'MMMM YYYY',
      },
      description: 'Optional. Date the review was received.',
    },
  ],
  preview: {
    select: {
      clientName: 'clientRef.name',
      quote: 'quote',
      tag: 'clientTitle',
      projectTitle: 'projectRef.title',
      mangaTitle: 'mangaRef.title',
      cardImage: 'cardImage',
      projectMainImage: 'projectRef.mainImage',
      mangaCoverImage: 'mangaRef.coverImage',
    },
    prepare(selection) {
      const { 
        clientName, 
        quote, 
        tag,
        projectTitle, 
        mangaTitle,
        cardImage,
        projectMainImage,
        mangaCoverImage
      } = selection
      const title = clientName || 'Anonymous Client'
      const work = projectTitle || mangaTitle || tag || 'Commission'
      const media = cardImage || projectMainImage || mangaCoverImage || HeartIcon
      return {
        title: `${title} — ${work}`,
        subtitle: quote ? `"${quote.slice(0, 50)}..."` : '',
        media,
      }
    }
  }
}