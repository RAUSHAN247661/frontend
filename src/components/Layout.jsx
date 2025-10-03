import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-16"> {/* Add padding top to account for fixed header */}
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-60 transition-all duration-300 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-full w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;