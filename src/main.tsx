import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const OFFLINE = import.meta.env.VITE_OFFLINE === 'true';

async function bootstrap() {
  if (OFFLINE) {
    // 单文件离线分发：不依赖 service worker，直接在 window.fetch 上拦截。
    const { installOfflineFetch } = await import('./mocks/offline-fetch');
    installOfflineFetch();
  } else {
    // dev 默认启用 MSW；想直连真后端时设 VITE_USE_MOCK=false。
    const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false';
    if (useMock) {
      const { worker } = await import('./mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      });
    }
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
