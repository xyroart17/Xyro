import React from 'react'

export default function IframePreview(props) {
  const { document: sanityDoc } = props
  const displayed = sanityDoc?.displayed

  if (!displayed || !displayed.slug?.current) {
    return (
      <div style={{ padding: '24px', color: '#6e7683', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>
        Please enter a Title and generate a **URL Slug** first to view the live preview.
      </div>
    )
  }

  const type = displayed._type
  const slug = displayed.slug.current

  const path = type === 'project' ? `project/${slug}` : `manga/${slug}`
  const liveUrl = `https://xyroart.pages.dev/${path}`

  const reloadIframe = () => {
    const iframe = window.document.getElementById('sanity-preview-iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Control bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '8px 16px', 
        background: '#121214', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '600', color: '#22c55e' }}>🟢 Live Preview</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <code style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: '#ff4d4d' }}>
            /{path}
          </code>
          <button 
            type="button" 
            onClick={reloadIframe}
            style={{ 
              background: 'transparent', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.15)', 
              borderRadius: '4px', 
              padding: '4px 10px', 
              fontSize: '12px', 
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            🔄 Reload
          </button>
        </div>
      </div>

      {/* Embedded website preview */}
      <div style={{ flex: 1, position: 'relative', background: '#f5f5f7' }}>
        <iframe
          id="sanity-preview-iframe"
          src={liveUrl}
          style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
          title="Website Preview Pane"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
