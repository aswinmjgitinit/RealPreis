import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Rechner from './Rechner.jsx'

function Root() {
  const initialPage = window.location.pathname === '/rechner' ? 'rechner' : 'home'
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    const syncHistory = (nextPage, replace = false) => {
      const path = nextPage === 'rechner' ? '/rechner' : '/'
      const state = { page: nextPage }

      if (replace) {
        window.history.replaceState(state, '', path)
      } else {
        window.history.pushState(state, '', path)
      }
    }

    syncHistory(initialPage, true)

    const handlePopState = (event) => {
      const nextPage = event.state?.page || (window.location.pathname === '/rechner' ? 'rechner' : 'home')
      setPage(nextPage)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [initialPage])

  const navigateTo = (nextPage) => {
    setPage(nextPage)
    const path = nextPage === 'rechner' ? '/rechner' : '/'
    window.history.pushState({ page: nextPage }, '', path)
  }

  return (
    <StrictMode>
      {page === 'home' ? (
        <App onNavigate={() => navigateTo('rechner')} />
      ) : (
        <Rechner onBack={() => navigateTo('home')} />
      )}
    </StrictMode>
  )
}

export default Root;

createRoot(document.getElementById('root')).render(<Root />)
