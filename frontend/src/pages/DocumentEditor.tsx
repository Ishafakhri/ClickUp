import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiSave, FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { Document } from '../types'

const DocumentEditor = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch document
  const { data: document, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const { data } = await api.get<Document>(`/documents/${id}`)
      return data
    },
    enabled: !!id,
  })

  // Set initial values
  useEffect(() => {
    if (document) {
      setTitle(document.title)
      setContent(document.content)
    }
  }, [document])

  // Track changes
  useEffect(() => {
    if (document) {
      setHasChanges(title !== document.title || content !== document.content)
    }
  }, [title, content, document])

  // Update document mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.put(`/documents/${id}`, {
        title,
        content,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setHasChanges(false)
      toast.success('Document saved!')
    },
    onError: () => {
      toast.error('Failed to save document')
    },
  })

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Document title is required')
      return
    }
    updateMutation.mutate()
  }

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    if (!hasChanges) return

    const autoSaveInterval = setInterval(() => {
      if (hasChanges && title.trim()) {
        updateMutation.mutate()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [hasChanges, title, updateMutation])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading document...</p>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Document not found</p>
        <Link to="/documents" className="btn btn-primary">
          Back to Documents
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/documents" className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
                placeholder="Document Title"
              />
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FiUser className="w-4 h-4" />
                  <span>{document.creator?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
                </div>
                {document.project && (
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: document.project.color }}
                    />
                    <span>{document.project.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && <span className="text-sm text-gray-600">Unsaved changes</span>}
            <button
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
              className="btn btn-primary flex items-center gap-2"
            >
              <FiSave />
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[600px] p-6 text-gray-900 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Start writing your document..."
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <span>
            {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
          </span>
          <span>Auto-saves every 30 seconds</span>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditor
