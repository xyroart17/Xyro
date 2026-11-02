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
      name: 'publishDate',
      title: 'Publish Date & Time',
      type: 'datetime',
      group: 'core',
      description: 'Determines the sorting order of projects on the website (latest first).',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'core',
      description: 'Toggle ON to feature this artwork in the top 4 Vault slots on the homepage.',
      initialValue: false,
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
          { title: 'Commission', value: 'commission' },
          { title: 'Original', value: 'original' },
          { title: 'Fan Art', value: 'fanart' },
          { title: 'Manga', value: 'manga' },
          { title: '3D', value: '3d' },
          { title: 'Digital', value: 'digital' },
          { title: 'Traditional', value: 'traditional' },
          { title: 'Mythology', value: 'mythology' },
          { title: 'Editorial', value: 'editorial' },
        ],
      },
      description: 'Select categories/tags for the Vault gallery display and filtering. (Falls back to Role/Category if empty).',
    },
    {
      name: 'year',
      title: 'Artwork Year',
      type: 'string',
      group: 'core',
      description: 'e.g., 2026, 2025. Defaults to the year of the Publish Date if left blank.',
    },
    {
      name: 'hue',
      title: 'Manga-Punk Card Hue (0–360)',
      type: 'number',
      group: 'core',
      description: 'Optional neon background tint hue (0=red, 45=yellow, 180=cyan, 270=purple). Automatically calculated from the artwork palette if left blank.',
      validation: (Rule) => Rule.min(0).max(360),
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
      name: 'gridImage', 
      title: 'Grid Showcase Image (Optional)', 
      type: 'image', 
      group: 'media',
      options: { hotspot: true },
      fields: [{ 
        name: 'alt', 
        type: 'string', 
        title: 'Alt text (For SEO)',
        components: { input: AltTextInput }
      }],
      description: 'Optional. Upload/crop a custom display image specifically for portfolio grids and testimonial cards. If empty, defaults to the Thumbnail (Main Poster Image).',
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
      featured: 'featured',
    },
    prepare(selection) {
      const { title, subtitle, media, featured } = selection
      return {
        title: (featured ? '★ ' : '') + (title || 'Untitled Project'),
        subtitle: subtitle || 'No category',
        media: media,
      }
    },
  },
}