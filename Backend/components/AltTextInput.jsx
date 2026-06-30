import React from 'react'
import { useFormValue, set, unset } from 'sanity'

export default function AltTextInput(props) {
  const { elementProps, onChange, value = '' } = props

  // Retrieve current form values dynamically
  const title = useFormValue(['title']) || ''
  const tag = useFormValue(['tag']) || ''
  const subtitle = useFormValue(['subtitle']) || ''
  const genre = useFormValue(['genre']) || ''

  // Build automatic, highly optimized SEO suggestions
  const suggestions = []
  if (title) {
    const base = `Artwork of ${title}`
    const parts = [base]
    const details = tag || subtitle || genre
    if (details) {
      parts.push(tag || subtitle || genre)
    }
    parts.push('by Xyro')
    suggestions.push(parts.join(' — '))
  }

  // Pre-defined, search-relevant keywords
  const tags = [
    '3D Blender Art',
    '2D Illustration',
    'Character Design (OC)',
    'Anime Style',
    'Concept Art',
    'Comic / Manga Art'
  ]

  const handleSuggestionClick = (suggestion) => {
    onChange(set(suggestion))
  }

  const handleTagClick = (tagVal) => {
    const newValue = value ? `${value}, ${tagVal}` : tagVal
    onChange(set(newValue))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '6px' }}>
      <input
        {...elementProps}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: '#0d0d0f',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px',
          fontSize: '14px',
          outline: 'none'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {suggestions.length > 0 && (
          <div style={{ marginTop: '4px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
              ⚡ Auto-Generated SEO Suggestion:
            </div>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(sug)}
                style={{
                  background: 'rgba(255, 77, 77, 0.1)',
                  color: '#ff4d4d',
                  border: '1px dashed rgba(255, 77, 77, 0.35)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  fontWeight: 500,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.18)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
              >
                Use: "{sug}"
              </button>
            ))}
          </div>
        )}

        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', marginTop: '4px' }}>
            ➕ Click to Append SEO Keywords:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tags.map((tagVal, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTagClick(tagVal)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                }}
              >
                + {tagVal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
