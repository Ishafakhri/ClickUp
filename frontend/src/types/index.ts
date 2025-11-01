export interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
  createdAt: string
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  user?: User
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  ownerId: string
  owner?: User
  members?: ProjectMember[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  emoji: string
  projectId: string
  assigneeId?: string
  creatorId: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface ChatMessage {
  id: string
  content: string
  senderId: string
  sender: User
  projectId?: string
  createdAt: string
}

export interface Document {
  id: string
  title: string
  content: string
  projectId: string
  creatorId: string
  creator?: User
  project?: {
    id: string
    name: string
    color: string
  }
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}
