import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiCheckCircle,
  FiClock,
  FiZap,
  FiRefreshCw,
} from 'react-icons/fi'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { Project, Task, TaskStatus, TaskPriority, ProjectMember } from '../types'
import ProjectMembers from '../components/ProjectMembers'
import { useAuthStore } from '../stores/authStore'

// AI Suggestion interface
interface AISuggestion {
  title: string
  description: string
  priority: TaskPriority
  emoji: string
}

const ProjectDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'tasks' | 'members'>('tasks')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    emoji: '📋',
  })

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await api.get<Project>(`/projects/${id}`)
      return data
    },
  })

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data } = await api.get<Task[]>(`/tasks?projectId=${id}`)
      return data
    },
    enabled: !!id,
  })

  const createTaskMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      const { data } = await api.post('/tasks', {
        ...task,
        projectId: id,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] })
      setIsModalOpen(false)
      setNewTask({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        emoji: '📋',
      })
      toast.success('Task created successfully!')
    },
    onError: () => {
      toast.error('Failed to create task')
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] })
      toast.success('Task deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete task')
    },
  })

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const { data } = await api.patch(`/tasks/${taskId}`, { status })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTaskMutation.mutate(newTask)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewTask({ ...newTask, emoji: emojiData.emoji })
    setShowEmojiPicker(false)
  }

  // AI Functions
  const generateAISuggestions = async () => {
    if (!project) return

    setIsLoadingAI(true)
    try {
      const { data } = await api.post('/ai/suggest-tasks', {
        projectName: project.name,
        projectDescription: project.description,
      })
      setAiSuggestions(data.suggestions || [])
      setShowAISuggestions(true)
      toast.success('AI suggestions generated!')
    } catch (error) {
      toast.error('Failed to generate AI suggestions')
      console.error('AI Error:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const enhanceWithAI = async () => {
    if (!newTask.title) {
      toast.error('Please enter a task title first')
      return
    }

    setIsLoadingAI(true)
    try {
      const [descResponse, priorityResponse] = await Promise.all([
        api.post('/ai/enhance-description', { title: newTask.title }),
        api.post('/ai/suggest-priority', { title: newTask.title }),
      ])

      setNewTask({
        ...newTask,
        description: descResponse.data.description,
        priority: priorityResponse.data.priority,
      })
      toast.success('✨ Enhanced with AI!')
    } catch (error) {
      toast.error('Failed to enhance with AI')
      console.error('AI Error:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const applyAISuggestion = (suggestion: AISuggestion) => {
    setNewTask({
      ...newTask,
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      emoji: suggestion.emoji,
    })
    setShowAISuggestions(false)
    toast.success('AI suggestion applied!')
  }

  const groupTasksByStatus = (): Record<TaskStatus, Task[]> => {
    if (!tasks) {
      return {
        [TaskStatus.TODO]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.IN_REVIEW]: [],
        [TaskStatus.DONE]: [],
      }
    }
    return tasks.reduce(
      (acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = []
        }
        acc[task.status].push(task)
        return acc
      },
      {
        [TaskStatus.TODO]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.IN_REVIEW]: [],
        [TaskStatus.DONE]: [],
      } as Record<TaskStatus, Task[]>
    )
  }

  if (projectLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!project) {
    return <div className="p-8">Project not found</div>
  }

  const groupedTasks = groupTasksByStatus()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          {project.description && <p className="text-gray-600 mt-2">{project.description}</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateAISuggestions}
            disabled={isLoadingAI}
            className="btn btn-secondary flex items-center gap-2"
          >
            {isLoadingAI ? (
              <>
                <FiRefreshCw className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <FiZap /> AI Suggestions
              </>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Team
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' ? (
        <>
          {/* Task Board - Kanban Style */}
          {tasksLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : tasks && tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* TODO Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiClock className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">To Do</h3>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {groupedTasks[TaskStatus.TODO]?.length || 0}
                  </span>
                </div>
                {groupedTasks[TaskStatus.TODO]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTaskMutation.mutate}
                    onStatusChange={updateTaskStatusMutation.mutate}
                  />
                ))}
              </div>

              {/* IN PROGRESS Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiEdit className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">In Progress</h3>
                  <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                    {groupedTasks[TaskStatus.IN_PROGRESS]?.length || 0}
                  </span>
                </div>
                {groupedTasks[TaskStatus.IN_PROGRESS]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTaskMutation.mutate}
                    onStatusChange={updateTaskStatusMutation.mutate}
                  />
                ))}
              </div>

              {/* IN REVIEW Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiClock className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-900">In Review</h3>
                  <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full">
                    {groupedTasks[TaskStatus.IN_REVIEW]?.length || 0}
                  </span>
                </div>
                {groupedTasks[TaskStatus.IN_REVIEW]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTaskMutation.mutate}
                    onStatusChange={updateTaskStatusMutation.mutate}
                  />
                ))}
              </div>

              {/* DONE Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Done</h3>
                  <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                    {groupedTasks[TaskStatus.DONE]?.length || 0}
                  </span>
                </div>
                {groupedTasks[TaskStatus.DONE]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTaskMutation.mutate}
                    onStatusChange={updateTaskStatusMutation.mutate}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first task</p>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                Create Task
              </button>
            </div>
          )}
        </>
      ) : (
        <ProjectMembers
          projectId={id!}
          members={project.members || []}
          isOwner={project.owner?.id === user?.id || project.ownerId === user?.id}
          isAdmin={
            project.members?.some(
              (m: ProjectMember) => m.userId === user?.id && m.role === 'ADMIN'
            ) || false
          }
          onMembersUpdate={() => queryClient.invalidateQueries({ queryKey: ['project', id] })}
        />
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji (Urgency Indicator)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 flex items-center gap-2"
                  >
                    <span className="text-2xl">{newTask.emoji}</span>
                    <span className="text-gray-600">Click to change emoji</span>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-full mt-2 z-50">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Enhance Button */}
              {newTask.title && (
                <button
                  type="button"
                  onClick={enhanceWithAI}
                  disabled={isLoadingAI}
                  className="w-full btn btn-secondary flex items-center justify-center gap-2"
                >
                  {isLoadingAI ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Enhancing with AI...
                    </>
                  ) : (
                    <>
                      <FiZap /> ✨ Enhance with AI
                    </>
                  )}
                </button>
              )}

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  className="input"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value as TaskPriority })
                  }
                >
                  <option value={TaskPriority.LOW}>🟢 Low</option>
                  <option value={TaskPriority.MEDIUM}>🟡 Medium</option>
                  <option value={TaskPriority.HIGH}>🟠 High</option>
                  <option value={TaskPriority.URGENT}>🔴 Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="input"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                >
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.IN_REVIEW}>In Review</option>
                  <option value={TaskStatus.DONE}>Done</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={createTaskMutation.isPending}
                >
                  {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setShowEmojiPicker(false)
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Suggestions Modal */}
      {showAISuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">🤖 AI Task Suggestions</h2>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Click on any suggestion to use it as a starting point for your task
            </p>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applyAISuggestion(suggestion)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{suggestion.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            suggestion.priority === 'URGENT'
                              ? 'bg-red-100 text-red-800'
                              : suggestion.priority === 'HIGH'
                              ? 'bg-orange-100 text-orange-800'
                              : suggestion.priority === 'MEDIUM'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAISuggestions(false)}
              className="w-full mt-4 btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Task Card Component
interface TaskCardProps {
  task: Task & { emoji?: string }
  onDelete: (taskId: string) => void
  onStatusChange: (data: { taskId: string; status: TaskStatus }) => void
}

const TaskCard = ({ task, onDelete, onStatusChange }: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false)

  const getPriorityEmoji = (priority: TaskPriority) => {
    const emojis = {
      [TaskPriority.LOW]: '🟢',
      [TaskPriority.MEDIUM]: '🟡',
      [TaskPriority.HIGH]: '🟠',
      [TaskPriority.URGENT]: '🔴',
    }
    return emojis[priority]
  }

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    const flow = {
      [TaskStatus.TODO]: TaskStatus.IN_PROGRESS,
      [TaskStatus.IN_PROGRESS]: TaskStatus.IN_REVIEW,
      [TaskStatus.IN_REVIEW]: TaskStatus.DONE,
      [TaskStatus.DONE]: null,
    }
    return flow[currentStatus]
  }

  const nextStatus = getNextStatus(task.status)

  return (
    <div
      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{task.emoji || '📋'}</span>
          <span className="text-lg">{getPriorityEmoji(task.priority)}</span>
        </div>
        {showActions && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Delete task"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {nextStatus && (
        <button
          onClick={() => onStatusChange({ taskId: task.id, status: nextStatus })}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Move to {nextStatus.replace('_', ' ')} →
        </button>
      )}
    </div>
  )
}

export default ProjectDetail
