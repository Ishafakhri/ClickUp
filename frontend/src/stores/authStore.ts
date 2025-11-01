import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import { socketService } from '../lib/socket'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        socketService.connect(token)
        set({ user, token })
      },
      logout: () => {
        localStorage.removeItem('token')
        socketService.disconnect()
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
