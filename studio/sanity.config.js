import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Studio-A4',

  projectId: 'pfnvy1zn',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
