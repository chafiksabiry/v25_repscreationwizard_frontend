/* import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
) */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './public-path'; // For Qiankun public path setup
import 'systemjs';

// Keep a reference to the React Root instance
let root = null;

// Function to render the React app
function render(props = {}) {
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root') // Use the container provided by Qiankun
    : document.getElementById('root'); // Fallback for standalone mode

  if (!rootElement) {
    console.warn('[App] Root element not found!');
    return;
  }

  console.log('[App] Rendering in container:', rootElement);

  // Initialize React root if not already created
  if (!root) {
    root = createRoot(rootElement);
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Standalone mode check (if running outside Qiankun)
if (!window.__POWERED_BY_QIANKUN__) {
  console.log('[App] Running in standalone mode');
  render({});
}

// Qiankun lifecycle methods
export async function bootstrap() {
  console.log('[App] Bootstrapping...');
  console.log('beforeLoad hook triggered');
  // You can add any setup needed for bootstrapping here
}

export async function mount(props) {
  console.log('[App] Mounting...', props);
  console.log('beforeMount hook triggered');
  render(props); // Mount the app
}

export async function unmount(props) {
  console.log('[App] Unmounting...', props);
  console.log('afterUnmount hook triggered');

  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root') // Find root in the container
    : document.getElementById('root'); // Fallback for standalone mode

  if (root) {
    console.log('[App] Unmounting from container:', rootElement);
    root.unmount();
    root = null; // Clear root reference
  } else {
    console.warn('[App] React Root instance not found for unmounting!');
  }
}