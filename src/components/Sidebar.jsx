import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });
  const location = useLocation();

  useEffect(() => {
    fetchStats();
    // Fetch stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close on mobile when sidebar is open
      if (isOpen && window.innerWidth < 768) {
        const sidebar = document.querySelector('.sidebar-container');
        const menuButton = document.querySelector('.mobile-menu-button');
        
        // Check if click is outside sidebar and not on menu button
        if (sidebar && !sidebar.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/tasks');
      const tasks = response.data;
      setStats({
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        pending: tasks.filter(t => t.status === 'pending').length
      });
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: '📊',
      stats: `${stats.total} total`
    },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-button md:hidden fixed top-5 left-4 z-50 p-2 rounded-md bg-white shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`sidebar-container
        fixed top-0 left-0 z-40 w-64 sm:w-60 bg-white shadow-xl transform transition-transform duration-300 ease-in-out h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:shadow-lg md:h-[calc(100vh-64px)] md:top-16
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile header with close button */}
          <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200 pt-20">
            <span className="text-lg font-semibold text-gray-800">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <div key={item.name} className="mb-4">
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center px-4 py-4 text-base font-medium rounded-lg transition-colors duration-200
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                  </Link>
                 
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 text-center">
              Produced by Raushan
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Sidebar;