export default {
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    // CORE INFO (Homepage)
    { name: 'title', title: 'Project Title', type: 'string' },
    { name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { 
      name: 'mainImage', 
      title: 'Thumbnail', 
      type: 'image', 
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text (For SEO)' }] 
    },
    { 
      name: 'tag', 
      title: 'Role / Service', 
      type: 'string',
      description: 'e.g., 3D Blender, Illustration, Environment Design'
    },
    { 
      name: 'subtitle', 
      title: 'Client / Category', 
      type: 'string',
      description: 'e.g., Commission Work, Personal Project, Xyro'
    },
    { name: 'projectNumber', title: 'Project Number', type: 'string', description: 'e.g., 01, 02, 03' },
    
    // DEEP DIVE (The project page)
    { name: 'description', title: 'Story / Process Text', type: 'text' },
    
    // UPDATED: Split Gallery into WIP and Final Work with Alt Text fields
    { 
      name: 'wipImages', 
      title: 'WIP (Work In Progress) Images', 
      type: 'array', 
      of: [{ 
        type: 'image', 
        options: { hotspot: true },
        fields: [{ name: 'alt', type: 'string', title: 'Alt text (For SEO)' }]
      }] 
    },
    { 
      name: 'finalImages', 
      title: 'Final Artwork', 
      type: 'array', 
      of: [{ 
        type: 'image', 
        options: { hotspot: true },
        fields: [{ name: 'alt', type: 'string', title: 'Alt text (For SEO)' }]
      }] 
    },
    
    { name: 'shortVideo', title: 'Cinematic Video (MP4)', type: 'file', options: { accept: 'video/*' } },
    { name: 'videoUrl', title: 'YouTube/Vimeo Embed URL', type: 'url' },
    
    // SOCIAL LINKS
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
    }
  ],
}