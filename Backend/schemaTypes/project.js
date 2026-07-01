import AltTextInput from '../components/AltTextInput'
import { CaseIcon } from '@sanity/icons'

export default {
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {
      name: 'core',
      title: 'Core Info',
      default: true,
    },
    {
      name: 'story',
      title: 'Story & Process',
    },
    {
      name: 'media',
      title: 'Gallery & Media',
    },
    {
      name: 'social',
      title: 'Links & Social',
    },
  ],
  fields: [
    // CORE INFO (Homepage)
    { 
      name: 'title', 
      title: 'Project Title', 
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required().error('Title is required for the project.'),
    },
    { 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      group: 'core',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required().error('Slug is required to generate the page URL.'),
    },
    { 
      name: 'tag', 
      title: 'Role / Service', 
      type: 'string',
      group: 'core',
      description: 'e.g., 3D Blender, Illustration, Environment Design',
      validation: (Rule) => Rule.required().error('Role/Service tag is required.'),
    },
    { 
      name: 'subtitle', 
      title: 'Client / Category', 
      type: 'string',
      group: 'core',
      description: 'e.g., Commission Work, Personal Project, Xyro'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'core',
      description: 'Determines the sorting order of projects on the homepage (ascending).',
      initialValue: 0,
    },
    
    // DEEP DIVE (The project page)
    { 
      name: 'description', 
      title: 'Story / Process Text', 
      type: 'text',
      group: 'story',
      rows: 10,
      description: 'Describe the design process, concept, challenges, and details of this project.'
    },
    
    // GALLERY & MEDIA
    { 
      name: 'mainImage', 
      title: 'Thumbnail (Main Poster Image)', 
      type: 'image', 
      group: 'media',
      options: { hotspot: true },
      fields: [{ 
        name: 'alt', 
        type: 'string', 
        title: 'Alt text (For SEO)',
        components: { input: AltTextInput }
      }],
      validation: (Rule) => Rule.required().error('Thumbnail image is required.'),
    },
    { 
      name: 'finalImages', 
      title: 'Final Artwork', 
      type: 'array', 
      group: 'media',
      options: { 
        layout: 'grid' 
      },
      of: [{ 
        type: 'image', 
        options: { hotspot: true },
        fields: [{ 
          name: 'alt', 
          type: 'string', 
          title: 'Alt text (For SEO)',
          components: { input: AltTextInput }
        }]
      }] 
    },
    { 
      name: 'wipImages', 
      title: 'WIP (Work In Progress) Images', 
      type: 'array', 
      group: 'media',
      options: { 
        layout: 'grid' 
      },
      of: [{ 
        type: 'image', 
        options: { hotspot: true },
        fields: [{ 
          name: 'alt', 
          type: 'string', 
          title: 'Alt text (For SEO)',
          components: { input: AltTextInput }
        }]
      }] 
    },
    { 
      name: 'shortVideo', 
      title: 'Cinematic Video (MP4)', 
      type: 'file', 
      group: 'media',
      options: { accept: 'video/*' } 
    },
    { 
      name: 'videoUrl', 
      title: 'YouTube/Vimeo Embed URL', 
      type: 'url',
      group: 'media',
      description: 'Link to a full YouTube or Vimeo video for high-fidelity embed.'
    },
    
    // SOCIAL LINKS
    { 
      name: 'socialLinks', 
      title: 'Where is this hosted?', 
      type: 'array', 
      group: 'social',
      description: 'Add external links where viewers can find or buy this project.',
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
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tag',
      media: 'mainImage',
    },
  },
}