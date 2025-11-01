import { useAuthStore } from '../stores/authStore'

const Settings = () => {
  const { user } = useAuthStore()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" className="input" defaultValue={user?.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="input" defaultValue={user?.email} disabled />
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your tasks</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Desktop Notifications</p>
                <p className="text-sm text-gray-600">Get notified about important updates</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
