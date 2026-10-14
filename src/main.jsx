import { createRoot } from 'react-dom/client'
import '@fontsource/ibm-plex-sans/300.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import App from './App.jsx'
import { upgradeOldLinks } from './route.js'

upgradeOldLinks()
createRoot(document.getElementById('root')).render(<App />)

// for anyone who opens the console
console.log(
  '%cMani Poorna%c  full-stack developer\nHello, curious one. The source is on GitHub, and a message is always welcome.',
  'font: 600 16px monospace; color: #1d4fd7',
  'font: 12px monospace; color: #666',
)
