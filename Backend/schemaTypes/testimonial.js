import { HeartIcon } from '@sanity/icons'

export default {
  name: 'testimonial',
  title: 'Client Review',
  type: 'document',
  icon: HeartIcon,
  fields: [
    {
      name: 'quote',
      title: 'Review Quote',
      type: 'text',
      description: 'The actual review from the client.',
    },
    {
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      description: 'e.g., VStrife',
    },
    {
      name: 'clientTitle',
      title: 'Client Role',
      type: 'string',
      description: 'e.g., Art Director, Indie Dev, or leave blank',
    },
    // NEW FIELD: Adds a clean date picker for the review
    {
      name: 'reviewDate',
      title: 'Review Date',
      type: 'date',
      description: 'When did the client leave this review?',
      options: {
        dateFormat: 'MMMM YYYY', // Formats it cleanly in the studio
      }
    },
    {
      name: 'projectRef',
      title: 'Associated Project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Select the project this review is for to display a "Preview Work" link.',
    },
    {
      name: 'mangaRef',
      title: 'Associated Manga',
      type: 'reference',
      to: [{ type: 'manga' }],
      description: 'Select the manga this review is for to display a "Preview Work" link.',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Determines the sorting order of reviews (ascending).',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'quote',
      projectTitle: 'projectRef.title',
      mangaTitle: 'mangaRef.title',
    },
    prepare(selection) {
      const { title, subtitle, projectTitle, mangaTitle } = selection
      const ref = projectTitle || mangaTitle || 'General Feedback'
      return {
        title: title || 'Anonymous Client',
        subtitle: `${ref} — "${subtitle || ''}"`,
      }
    }
  }
}