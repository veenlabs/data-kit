import React from 'react'
import ReactDOM from 'react-dom/client'
import App1 from './version1/App'
import App2 from './version2/App'
import './app.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>,
)
