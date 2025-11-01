import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiPlus, FiFolder, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { Project } from '../types'

const Projects = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#0ea5e9',
  })

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/projects')
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (project: typeof newProject) => {
      const { data } = await api.post('/projects', project)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsModalOpen(false)
      setNewProject({ name: '', description: '', color: '#0ea5e9' })
      toast.success('Project created successfully!')
    },
    onError: () => {
      toast.error('Failed to create project')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof newProject }) => {
      await api.put(`/projects/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsModalOpen(false)
      setIsEditMode(false)
      setEditingProject(null)
      setNewProject({ name: '', description: '', color: '#0ea5e9' })
      toast.success('Project updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update project')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: newProject })
    } else {
      createMutation.mutate(newProject)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setNewProject({
      name: project.name,
      description: project.description || '',
      color: project.color,
    })
    setIsEditMode(true)
    setIsModalOpen(true)
    setShowMenu(null)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteMutation.mutate(id)
    }
    setShowMenu(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingProject(null)
    setNewProject({ name: '', description: '', color: '#0ea5e9' })
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your projects and workspaces</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project.id} className="card hover:shadow-md transition-shadow relative">
            <Link to={`/projects/${project.id}`} className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: project.color }}
              >
                <FiFolder className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
            </Link>
            
            {/* Action Menu */}
            <div className="absolute top-4 right-4">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setShowMenu(showMenu === project.id ? null : project.id)
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              
              {showMenu === project.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleEdit(project)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Project
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(project.id)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects?.length === 0 && (
        <div className="text-center py-12">
          <FiFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first project</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            Create Project
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What's this project about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded-lg cursor-pointer"
                  value={newProject.color}
                  onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {isEditMode ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
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

export default Projects
