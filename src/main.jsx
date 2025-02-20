import React, { StrictMode } from 'react';
import './public-path'; // For proper Qiankun integration
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Store the root instance for proper unmounting
let root = null;

function render(props) {
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement) {
    console.log('[App3] Rendering in container:', rootElement);
    if (!root) {
      root = createRoot(rootElement);
    }
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    console.warn('[App3] Root element not found!');
  }
}

export async function bootstrap() {
  console.time('[App3] bootstrap');
  console.log('[App3] Bootstrapping...');
  return Promise.resolve();
}

export async function mount(props) {
  console.log('[App3] Mounting...', props);
  const { container } = props;
  if (container) {
    console.log('[App3] Found container for mounting:', container);
  } else {
    console.warn('[App3] No container found for mounting');
  }
  render(props);
  return Promise.resolve();
}

export async function unmount(props) {
  console.log('[App3] Unmounting...', props);
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement && root) {
    console.log('[App3] Unmounting from container:', rootElement);
    root.unmount();
    root = null; // Reset the root instance
  } else {
    console.warn('[App3] Root element not found for unmounting!');
  }
  return Promise.resolve();
}

// Standalone mode: If the app is running outside Qiankun, it will use this code
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('[App3] Running in standalone mode');
  render({});
} else {
  console.log('[App3] Running inside Qiankun');
  render({})
}
