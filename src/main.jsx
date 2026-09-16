import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import App from './App.jsx'
import './styles.css'

const smoothScrollOptions = {
  autoRaf: true,
  lerp: 0.085,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
  syncTouch: false,
  anchors: {
    offset: -96,
  },
  stopInertiaOnNavigate: true,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ReactLenis root options={smoothScrollOptions} />
    <App />
  </>,
)
