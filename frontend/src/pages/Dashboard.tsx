import { useQuery } from '@tanstack/react-query'
import { FiCheckSquare, FiClock, FiUsers } from 'react-icons/fi'
import api from '../lib/api'

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      return data
    },
  })

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: FiCheckSquare,
      color: 'bg-blue-500',
    },
    {
      title: 'In Progress',
      value: stats?.inProgressTasks || 0,
      icon: FiClock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Completed',
      value: stats?.completedTasks || 0,
      icon: FiCheckSquare,
      color: 'bg-green-500',
    },
    {
      title: 'Team Members',
      value: stats?.teamMembers || 0,
      icon: FiUsers,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <p className="text-gray-500">No recent projects yet.</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          <p className="text-gray-500">No upcoming tasks yet.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
