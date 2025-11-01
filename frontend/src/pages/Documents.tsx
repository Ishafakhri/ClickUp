import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiFileText, FiPlus, FiTrash2, FiEdit, FiFolder } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { Document, Project } from '../types'

const Documents = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    projectId: '',
  })

  // Fetch all documents
  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await api.get<Document[]>('/documents')
      return data
    },
  })

  // Fetch projects for dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/projects')
      return data
    },
  })

  // Create document mutation
  const createMutation = useMutation({
    mutationFn: async (doc: typeof newDocument) => {
      const { data } = await api.post('/documents', doc)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setIsModalOpen(false)
      setNewDocument({ title: '', content: '', projectId: '' })
      toast.success('Document created successfully!')
    },
    onError: () => {
      toast.error('Failed to create document')
    },
  })

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      await api.delete(`/documents/${docId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Document deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete document')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocument.projectId) {
      toast.error('Please select a project')
      return
    }
    createMutation.mutate(newDocument)
  }

  const handleDelete = (docId: string, docTitle: string) => {
    if (window.confirm(`Delete document "${docTitle}"?`)) {
      deleteMutation.mutate(docId)
    }
  }

  if (docsLoading) {
    return <div className="p-8">Loading documents...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-2">Collaborate on documents with your team</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus /> New Document
        </button>
      </div>

      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="card hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-5 h-5 text-primary-600" />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: doc.project?.color || '#0ea5e9' }}
                  />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Link to={`/documents/${doc.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600">
                  {doc.title}
                </h3>
              </Link>

              {doc.content && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {doc.content.substring(0, 100)}...
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiFolder className="w-3 h-3" />
                <span>{doc.project?.name || 'No Project'}</span>
                <span>•</span>
                <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-4">Create your first document to get started</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <FiPlus className="inline mr-2" /> Create Document
          </button>
        </div>
      )}

      {/* Create Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="Meeting Notes, Project Plan, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  required
                  className="input"
                  value={newDocument.projectId}
                  onChange={(e) => setNewDocument({ ...newDocument, projectId: e.target.value })}
                >
                  <option value="">Select a project</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Optional)
                </label>
                <textarea
                  className="input"
                  rows={5}
                  value={newDocument.content}
                  onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                  placeholder="Start writing your document..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Document'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Documents
