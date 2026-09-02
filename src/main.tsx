import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        lazy: () =>
          import('./pages/Overview/Overview.tsx').then((module) => ({
            Component: module.Overview,
          })),
      },
      {
        path: 'cards',
        lazy: () =>
          import('./pages/AllCards/AllCards.tsx').then((module) => ({
            Component: module.AllCards,
          })),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
