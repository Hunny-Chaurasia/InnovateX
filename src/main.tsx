import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import logo from './assets/logo.png';

// Dynamically favicon set karne ke liye
const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
if (favicon) {
  favicon.href = logo;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
