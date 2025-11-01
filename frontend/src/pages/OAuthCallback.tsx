import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import api from '../lib/api'

const OAuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        toast.error('Authentication failed. Please try again.')
        navigate('/login')
        return
      }

      if (!token) {
        toast.error('No authentication token received.')
        navigate('/login')
        return
      }

      try {
        // Store token
        localStorage.setItem('token', token)

        // Fetch user data
        const { data } = await api.get('/auth/me')
        setAuth(data.user, token)

        toast.success('Successfully logged in!')
        navigate('/dashboard')
      } catch (error) {
        console.error('OAuth callback error:', error)
        toast.error('Failed to complete authentication.')
        navigate('/login')
      }
    }

    handleOAuthCallback()
  }, [searchParams, navigate, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Completing login...</h2>
        <p className="text-gray-600 mt-2">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  )
}

export default OAuthCallback
