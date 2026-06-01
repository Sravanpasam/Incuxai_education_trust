import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error listener to render a beautiful diagnostics card in case of any runtime crash
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 2rem; background: #fffbeb; border: 2px solid #f59e0b; color: #78350f; font-family: system-ui, -apple-system, sans-serif; border-radius: 16px; margin: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <h2 style="margin-top: 0; font-size: 1.3rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">⚠️ System Diagnostics Alert</h2>
        <p style="font-size: 0.92rem; margin: 0.5rem 0 1rem 0; line-height: 1.5;">An unexpected JavaScript exception occurred during the browser's render cycle. You can see the error details below:</p>
        <pre style="background: rgba(0, 0, 0, 0.04); padding: 1.2rem; border-radius: 8px; font-family: monospace; font-size: 0.82rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; border: 1px solid rgba(0, 0, 0, 0.05); line-height: 1.4;"><b>Error:</b> ${event.message}\n\n<b>Stack Trace:</b>\n${event.error?.stack || 'No stack trace available'}</pre>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
          <button onclick="localStorage.clear(); sessionStorage.clear(); location.reload();" style="padding: 0.6rem 1.2rem; background: #d97706; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: background 0.2s;">🧹 Clear LocalStorage & Reset App</button>
          <button onclick="location.reload();" style="padding: 0.6rem 1.2rem; background: rgba(0,0,0,0.06); color: #78350f; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">🔄 Reload Page</button>
        </div>
      </div>
    `;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
