/**
 * MainLayout Component
 * 
 * Main application layout structure
 */

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingChatButton } from './FloatingChatButton';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <FloatingChatButton />
    </div>
  );
}
