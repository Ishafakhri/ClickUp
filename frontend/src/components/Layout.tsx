import { Outlet, NavLink } from 'react-router-dom'
import { FiHome, FiFolder, FiMessageSquare, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '../stores/authStore'

const Layout = () => {
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/projects', icon: FiFolder, label: 'Projects' },
    { path: '/chat', icon: FiMessageSquare, label: 'Chat' },
    { path: '/documents', icon: FiFileText, label: 'Documents' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">ClickUp Clone</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
