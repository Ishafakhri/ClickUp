import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FiSend, FiMessageSquare } from 'react-icons/fi'
import { useAuthStore } from '../stores/authStore'
import { socketService } from '../lib/socket'
import { ChatMessage } from '../types'
import api from '../lib/api'

const Chat = () => {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load existing messages
  const { data: existingMessages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await api.get<ChatMessage[]>('/messages')
      return data
    },
  })

  // Set existing messages when loaded
  useEffect(() => {
    if (existingMessages) {
      setMessages(existingMessages)
    }
  }, [existingMessages])

  // Listen for new messages via socket
  useEffect(() => {
    const socket = socketService.getSocket()
    if (!socket) return

    socket.on('chat:message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('chat:message')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const socket = socketService.getSocket()
    if (socket) {
      socket.emit('chat:send', {
        content: newMessage,
      })
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Team Chat</h1>
        <p className="text-gray-600 mt-1">Collaborate with your team in real-time</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">Start the conversation with your team!</p>
          </div>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === user?.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              {message.senderId !== user?.id && (
                <p className="text-xs font-semibold mb-1">{message.sender?.name}</p>
              )}
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
