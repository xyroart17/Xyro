import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import IframePreview from './components/IframePreview'
import {CaseIcon, BookIcon, HeartIcon} from '@sanity/icons'
import React from 'react'

const Logo = () => {
  return React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 'bold',
        fontSize: '18px',
        letterSpacing: '-0.02em',
        color: '#fff',
        padding: '0 12px'
      }
    },
    React.createElement('span', null, 'XYRO'),
    React.createElement('span', { style: { color: '#ff4d4d' } }, 'STUDIO'),
    React.createElement('span', {
      style: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#ff4d4d',
        display: 'inline-block'
      }
    })
  )
}

export default defineConfig({
  name: 'default',
  title: 'Xyro',

  projectId: 'pfnvy1zn',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Xyro Studio')
          .items([
            S.listItem()
              .title('Portfolio Projects')
              .icon(CaseIcon)
              .child(
                S.documentTypeList('project')
                  .title('Portfolio Projects')
              ),
            S.listItem()
              .title('Manga & Comics')
              .icon(BookIcon)
              .child(
                S.documentTypeList('manga')
                  .title('Manga Chapters')
              ),
            S.listItem()
              .title('Client Reviews')
              .icon(HeartIcon)
              .child(
                S.documentTypeList('testimonial')
                  .title('Client Reviews')
              ),
          ]),
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

  studio: {
    components: {
      logo: Logo
    }
  }
})
