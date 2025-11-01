import { useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { User, UserPlus, X, Shield, Eye, Crown } from 'lucide-react'

interface Member {
  id: string
  projectId: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  user?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
  createdAt: string
}

interface ProjectMembersProps {
  projectId: string
  members: Member[]
  isOwner: boolean
  isAdmin: boolean
  onMembersUpdate: () => void
}

const ProjectMembers = ({
  projectId,
  members,
  isOwner,
  isAdmin,
  onMembersUpdate,
}: ProjectMembersProps) => {
  const [showAddMember, setShowAddMember] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'MEMBER' | 'ADMIN' | 'VIEWER'>('MEMBER')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post(`/projects/${projectId}/members`, { email, role })
      toast.success('Member added successfully!')
      setEmail('')
      setRole('MEMBER')
      setShowAddMember(false)
      onMembersUpdate()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data?.message || 'Failed to add member'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await api.delete(`/projects/${projectId}/members/${userId}`)
      toast.success('Member removed successfully!')
      onMembersUpdate()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data?.message || 'Failed to remove member'
      toast.error(message)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/projects/${projectId}/members/${userId}`, { role: newRole })
      toast.success('Member role updated!')
      onMembersUpdate()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data?.message || 'Failed to update role'
      toast.error(message)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-blue-500" />
      case 'VIEWER':
        return <Eye className="w-4 h-4 text-gray-500" />
      default:
        return <User className="w-4 h-4 text-green-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      OWNER: 'bg-yellow-100 text-yellow-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      MEMBER: 'bg-green-100 text-green-800',
      VIEWER: 'bg-gray-100 text-gray-800',
    }
    return colors[role as keyof typeof colors] || colors.MEMBER
  }

  const canManageMembers = isOwner || isAdmin

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        {canManageMembers && (
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="btn btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        )}
      </div>

      {showAddMember && canManageMembers && (
        <form onSubmit={handleAddMember} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')}
                className="input"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? 'Adding...' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddMember(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {members.map((member) => {
          if (!member.user) return null

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {member.user.avatar ? (
                  <img
                    src={member.user.avatar}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {canManageMembers && member.role !== 'OWNER' ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateRole(member.user!.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadge(
                      member.role
                    )}`}
                  >
                    {getRoleIcon(member.role)}
                    {member.role}
                  </span>
                )}

                {canManageMembers && member.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemoveMember(member.user!.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectMembers
