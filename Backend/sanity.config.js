import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import IframePreview from './components/IframePreview'

export default defineConfig({
  name: 'default',
  title: 'Xyro',

  projectId: 'pfnvy1zn',
  dataset: 'production',

  plugins: [
    structureTool({
      defaultDocumentNode: (S, { schemaType }) => {
        if (['project', 'manga'].includes(schemaType)) {
          return S.document().views([
            S.view.form(),
            S.view
              .component(IframePreview)
              .title('Preview')
          ])
        }
        return S.document().views([S.view.form()])
      }
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
