// PWA Service Worker Registration

// Extend Window interface for PWA features
declare global {
  interface Window {
    pwaInstall?: () => Promise<void>
    pwaClose?: () => void
  }
  interface Navigator {
    standalone?: boolean
  }
}

// BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        })

        console.log('✅ Service Worker registered successfully:', registration.scope)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
      }
    })
  } else {
    console.warn('⚠️ Service Workers are not supported in this browser')
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)
    return permission === 'granted'
  }
  return false
}

// Show notification
export function showNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options,
        })
      })
    } else {
      new Notification(title, options)
    }
  }
}

// Check if app is running as PWA
export function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  )
}

// Prompt to install PWA
let deferredPrompt: BeforeInstallPromptEvent | null = null

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 Install prompt available')
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent

    // Show custom install UI
    showInstallBanner()
  })

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully')
    deferredPrompt = null
    hideInstallBanner()
  })
}

export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('⚠️ Install prompt not available')
    return false
  }

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  console.log('Install prompt outcome:', outcome)

  deferredPrompt = null
  return outcome === 'accepted'
}

function showInstallBanner() {
  const existingBanner = document.getElementById('pwa-install-banner')
  if (existingBanner || isPWA()) return

  const banner = document.createElement('div')
  banner.id = 'pwa-install-banner'
  banner.innerHTML = `
    <style>
      #pwa-install-banner {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 16px;
        max-width: 90%;
        animation: slideUp 0.3s ease-out;
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      
      #pwa-install-banner .banner-content {
        flex: 1;
      }
      
      #pwa-install-banner .banner-title {
        font-weight: 600;
        margin-bottom: 4px;
        font-size: 14px;
      }
      
      #pwa-install-banner .banner-text {
        font-size: 12px;
        opacity: 0.9;
      }
      
      #pwa-install-banner button {
        padding: 8px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 13px;
      }
      
      #pwa-install-banner .install-btn {
        background: white;
        color: #764ba2;
      }
      
      #pwa-install-banner .install-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      #pwa-install-banner .close-btn {
        background: rgba(255,255,255,0.2);
        color: white;
        margin-left: 8px;
      }
      
      #pwa-install-banner .close-btn:hover {
        background: rgba(255,255,255,0.3);
      }
      
      @media (max-width: 640px) {
        #pwa-install-banner {
          flex-direction: column;
          align-items: stretch;
          text-align: center;
        }
        
        #pwa-install-banner button {
          width: 100%;
          margin-left: 0 !important;
          margin-top: 8px;
        }
      }
    </style>
    <div class="banner-content">
      <div class="banner-title">📱 Install ClickUp Clone</div>
      <div class="banner-text">Install our app for a better experience!</div>
    </div>
    <button class="install-btn" onclick="window.pwaInstall()">Install</button>
    <button class="close-btn" onclick="window.pwaClose()">✕</button>
  `

  document.body.appendChild(banner)

  // Setup handlers
  window.pwaInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      hideInstallBanner()
    }
  }

  window.pwaClose = () => {
    hideInstallBanner()
    localStorage.setItem('pwa-install-dismissed', 'true')
  }
}

function hideInstallBanner() {
  const banner = document.getElementById('pwa-install-banner')
  if (banner) {
    banner.style.animation = 'slideUp 0.3s ease-out reverse'
    setTimeout(() => banner.remove(), 300)
  }
}

// Check connection status
export function checkOnlineStatus() {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      console.log('✅ Back online')
      // Trigger sync if needed
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          if ('sync' in registration) {
            ;(
              registration as unknown as { sync: { register: (tag: string) => Promise<void> } }
            ).sync.register('sync-data')
          }
        })
      }
    } else {
      console.log('❌ Gone offline')
    }
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
}

// Initialize all PWA features
export function initPWA() {
  registerServiceWorker()
  setupInstallPrompt()
  checkOnlineStatus()

  // Show install banner after 30 seconds if not dismissed
  if (!isPWA() && !localStorage.getItem('pwa-install-dismissed')) {
    setTimeout(() => {
      if (deferredPrompt) {
        showInstallBanner()
      }
    }, 30000)
  }

  console.log('🚀 PWA initialized')
  console.log('📱 Running as PWA:', isPWA())
}
