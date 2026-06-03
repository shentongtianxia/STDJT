import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

async function bootstrap() {
  // 默认在 dev 启用 MSW；想直连真后端时设 VITE_USE_MOCK=false。
  const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false';
  if (useMock) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
