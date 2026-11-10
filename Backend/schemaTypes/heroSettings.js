import { PlayIcon } from '@sanity/icons'

export default {
  name: 'heroSettings',
  title: 'Homepage Hero',
  type: 'document',
  icon: PlayIcon,
  fields: [
    {
      name: 'title',
      title: 'Config Label',
      type: 'string',
      initialValue: 'Homepage Hero Media',
      description: 'Internal label for this hero configuration.',
    },
    {
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      description: 'Choose whether the hero plays a looping animated video or displays a static image.',
      options: {
        list: [
          { title: 'Video (Looping Animation)', value: 'video' },
          { title: 'Static Image', value: 'image' },
        ],
        layout: 'radio',
      },
      initialValue: 'video',
    },
    {
      name: 'videoFile',
      title: 'Hero Video (Direct Upload)',
      type: 'file',
      description: 'Upload your looping animated video (e.g. 29-30s MP4/WebM). Plays smoothly on loop in the hero background.',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.mediaType === 'image',
    },
    {
      name: 'videoUrl',
      title: 'External Video URL (Optional Alternative)',
      type: 'url',
      description: 'Direct link to an MP4 video file hosted on a CDN or cloud storage. Used if no direct file is uploaded above.',
      hidden: ({ parent }) => parent?.mediaType === 'image',
    },
    {
      name: 'imageFile',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a high-resolution hero image (used when Media Type is set to Static Image or as a video poster).',
    },
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'imageFile',
    },
    prepare({ mediaType, image }) {
      return {
        title: 'Homepage Hero Media',
        subtitle: mediaType === 'image' ? 'Static Image' : 'Looping Video',
        media: image || PlayIcon,
      }
    },
  },
}

