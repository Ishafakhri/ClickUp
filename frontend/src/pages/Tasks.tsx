import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiPlus, FiCheckSquare } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { Task, TaskStatus, TaskPriority } from '../types'

const Tasks = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    projectId: '',
  })

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get<Task[]>('/tasks')
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      const { data } = await api.post('/tasks', task)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setIsModalOpen(false)
      setNewTask({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        projectId: '',
      })
      toast.success('Task created successfully!')
    },
    onError: () => {
      toast.error('Failed to create task')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newTask)
  }

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
      [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
      [TaskStatus.IN_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [TaskStatus.DONE]: 'bg-green-100 text-green-800',
    }
    return colors[status]
  }

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
      [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
      [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [TaskPriority.URGENT]: 'bg-red-100 text-red-800',
    }
    return colors[priority]
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage all your tasks in one place</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus /> New Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks?.map((task) => (
          <div key={task.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks?.length === 0 && (
        <div className="text-center py-12">
          <FiCheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Create your first task to get started</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            Create Task
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Create Task
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

export default Tasks
