import { useState } from 'react'
import { useDocumentOperation } from 'sanity'
import { ArrowUpIcon, ArrowDownIcon, ChevronUpIcon, ChevronDownIcon } from '@sanity/icons'

const cleanId = (id) => id.replace(/^drafts\./, '')

// Helper to query all documents of a type and build a clean sorted list, favoring drafts
const getOrderedDocs = async (client, type) => {
  const docs = await client.fetch(
    `*[_type == $type] | order(order asc, _createdAt asc) { _id, order }`,
    { type }
  )
  
  const uniqueDocsMap = {}
  for (const doc of docs) {
    const cid = cleanId(doc._id)
    const isDraft = doc._id.startsWith('drafts.')
    if (isDraft || !uniqueDocsMap[cid]) {
      uniqueDocsMap[cid] = doc
    }
  }
  
  return Object.values(uniqueDocsMap).sort((a, b) => {
    const aOrder = typeof a.order === 'number' ? a.order : 0
    const bOrder = typeof b.order === 'number' ? b.order : 0
    return aOrder - bOrder
  })
}

export function MoveToTopAction(props) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentDoc = props.draft || props.published || {}
  const hasOrderField = 'order' in currentDoc

  return {
    label: isProcessing ? 'Moving...' : 'Move to Top',
    icon: ArrowUpIcon,
    disabled: isProcessing || !hasOrderField,
    onHandle: async () => {
      setIsProcessing(true)
      try {
        const client = props.context.getClient({ apiVersion: '2023-01-01' })
        const orderedDocs = await getOrderedDocs(client, props.type)
        
        // Find current document in list
        const currentIndex = orderedDocs.findIndex(d => cleanId(d._id) === cleanId(props.id))
        if (currentIndex === 0) {
          // Already at top
          return
        }

        // Get minimum order
        const minOrder = orderedDocs[0] ? orderedDocs[0].order : 0
        const currentMin = typeof minOrder === 'number' ? minOrder : 0
        const newOrder = currentMin - 1

        await patch.execute([{ set: { order: newOrder } }])
      } catch (err) {
        console.error('Failed to move to top:', err)
      } finally {
        setIsProcessing(false)
        props.onComplete()
      }
    }
  }
}

export function MoveUpAction(props) {
  const [isProcessing, setIsProcessing] = useState(false)

  const currentDoc = props.draft || props.published || {}
  const hasOrderField = 'order' in currentDoc

  return {
    label: isProcessing ? 'Moving...' : 'Move Up',
    icon: ChevronUpIcon,
    disabled: isProcessing || !hasOrderField,
    onHandle: async () => {
      setIsProcessing(true)
      try {
        const client = props.context.getClient({ apiVersion: '2023-01-01' })
        const orderedDocs = await getOrderedDocs(client, props.type)
        
        const currentIndex = orderedDocs.findIndex(d => cleanId(d._id) === cleanId(props.id))
        if (currentIndex > 0) {
          const targetDoc = orderedDocs[currentIndex - 1]
          const currentDocInList = orderedDocs[currentIndex]
          
          const currentOrder = typeof currentDocInList.order === 'number' ? currentDocInList.order : 0
          const targetOrder = typeof targetDoc.order === 'number' ? targetDoc.order : 0
          
          if (currentOrder === targetOrder) {
            // Re-index all documents sequentially
            const tx = client.transaction()
            orderedDocs.forEach((doc, idx) => {
              let newOrder = idx
              if (idx === currentIndex) {
                newOrder = currentIndex - 1
              } else if (idx === currentIndex - 1) {
                newOrder = currentIndex
              }
              tx.patch(doc._id, { set: { order: newOrder } })
            })
            await tx.commit()
          } else {
            // Standard swap
            const tx = client.transaction()
            tx.patch(currentDocInList._id, { set: { order: targetOrder } })
            tx.patch(targetDoc._id, { set: { order: currentOrder } })
            await tx.commit()
          }
        }
      } catch (err) {
        console.error('Failed to move up:', err)
      } finally {
        setIsProcessing(false)
        props.onComplete()
      }
    }
  }
}

export function MoveDownAction(props) {
  const [isProcessing, setIsProcessing] = useState(false)

  const currentDoc = props.draft || props.published || {}
  const hasOrderField = 'order' in currentDoc

  return {
    label: isProcessing ? 'Moving...' : 'Move Down',
    icon: ChevronDownIcon,
    disabled: isProcessing || !hasOrderField,
    onHandle: async () => {
      setIsProcessing(true)
      try {
        const client = props.context.getClient({ apiVersion: '2023-01-01' })
        const orderedDocs = await getOrderedDocs(client, props.type)
        
        const currentIndex = orderedDocs.findIndex(d => cleanId(d._id) === cleanId(props.id))
        if (currentIndex !== -1 && currentIndex < orderedDocs.length - 1) {
          const targetDoc = orderedDocs[currentIndex + 1]
          const currentDocInList = orderedDocs[currentIndex]
          
          const currentOrder = typeof currentDocInList.order === 'number' ? currentDocInList.order : 0
          const targetOrder = typeof targetDoc.order === 'number' ? targetDoc.order : 0
          
          if (currentOrder === targetOrder) {
            // Re-index all documents sequentially
            const tx = client.transaction()
            orderedDocs.forEach((doc, idx) => {
              let newOrder = idx
              if (idx === currentIndex) {
                newOrder = currentIndex + 1
              } else if (idx === currentIndex + 1) {
                newOrder = currentIndex
              }
              tx.patch(doc._id, { set: { order: newOrder } })
            })
            await tx.commit()
          } else {
            // Standard swap
            const tx = client.transaction()
            tx.patch(currentDocInList._id, { set: { order: targetOrder } })
            tx.patch(targetDoc._id, { set: { order: currentOrder } })
            await tx.commit()
          }
        }
      } catch (err) {
        console.error('Failed to move down:', err)
      } finally {
        setIsProcessing(false)
        props.onComplete()
      }
    }
  }
}

export function MoveToBottomAction(props) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentDoc = props.draft || props.published || {}
  const hasOrderField = 'order' in currentDoc

  return {
    label: isProcessing ? 'Moving...' : 'Move to Bottom',
    icon: ArrowDownIcon,
    disabled: isProcessing || !hasOrderField,
    onHandle: async () => {
      setIsProcessing(true)
      try {
        const client = props.context.getClient({ apiVersion: '2023-01-01' })
        const orderedDocs = await getOrderedDocs(client, props.type)
        
        // Find current document in list
        const currentIndex = orderedDocs.findIndex(d => cleanId(d._id) === cleanId(props.id))
        if (currentIndex === orderedDocs.length - 1) {
          // Already at bottom
          return
        }

        // Get maximum order
        const maxOrder = orderedDocs[orderedDocs.length - 1] ? orderedDocs[orderedDocs.length - 1].order : 0
        const currentMax = typeof maxOrder === 'number' ? maxOrder : 0
        const newOrder = currentMax + 1

        await patch.execute([{ set: { order: newOrder } }])
      } catch (err) {
        console.error('Failed to move to bottom:', err)
      } finally {
        setIsProcessing(false)
        props.onComplete()
      }
    }
  }
}
