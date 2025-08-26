import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './contexts/DataContext.jsx'
import { UIProvider } from './contexts/UIContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </DataProvider>
  </React.StrictMode>,
)
