import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorNotice, Notice } from './components/Notice';
import { Sidebar } from './components/Sidebar/Sidebar';

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorNotice}>
      <Suspense fallback={<Notice>Loading Ash's collection…</Notice>}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-y-auto px-8 py-6">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
