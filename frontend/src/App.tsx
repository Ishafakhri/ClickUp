import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Chat from './pages/Chat'
import Documents from './pages/Documents'
import DocumentEditor from './pages/DocumentEditor'
import Settings from './pages/Settings'
import OAuthCallback from './pages/OAuthCallback'

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="chat" element={<Chat />} />
        <Route path="documents" element={<Documents />} />
        <Route path="documents/:id" element={<DocumentEditor />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
