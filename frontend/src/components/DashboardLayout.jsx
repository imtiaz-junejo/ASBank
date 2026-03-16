import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ORANGE = '#E85D04';
const BLUE = '#003366';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get last login time
  const getLastLogin = () => {
    const stored = localStorage.getItem('last_login');
    if (stored) {
      return new Date(stored).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    return new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('vb_user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Modern Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-stretch h-16">
          {/* Left Section - White Background */}
          <div className="flex items-center px-6 bg-white border-r border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded transition-colors mr-4"
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 cursor-pointer"
            >
              {/* Logo Icon - Blue square with MA */}
              <div className="relative">
                <div 
                  className="w-10 h-10 flex items-center justify-center text-white font-bold text-sm rounded"
                  style={{ backgroundColor: BLUE }}
                >
                  <span className="text-xs">MA</span>
                </div>
              </div>
              {/* Logo Text */}
              <div className="flex items-baseline gap-0">
                <span className="text-lg font-normal text-gray-600">my</span>
                <span className="text-2xl font-bold" style={{ color: BLUE }}>ABL</span>
              </div>
            </button>
          </div>

          {/* Right Section - Orange Background */}
          <div 
            className="flex-1 flex items-center justify-between px-6"
            style={{ backgroundColor: ORANGE }}
          >
            {/* Welcome Message & Last Login */}
            <div className="text-white">
              <p className="text-sm font-medium mb-0.5">Welcome</p>
              <p className="text-xs opacity-90">
                Your last login was on | {getLastLogin()}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4">
              {/* Search Icon */}
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="currentColor"/>
                </svg>
              </button>

              {/* Home Icon */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="Home"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0L0 9H2V18H7V12H11V18H16V9H18L9 0Z" fill="currentColor"/>
                </svg>
              </button>

              {/* Mail Icon with Badge */}
              <button
                type="button"
                className="relative w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="Messages"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0H3C1.35 0 0.015 1.35 0.015 3L0 15C0 16.65 1.35 18 3 18H15C16.65 18 18 16.65 18 15V3C18 1.35 16.65 0 15 0ZM15 5L9 10.5L3 5V3L9 8.5L15 3V5Z" fill="currentColor"/>
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold" style={{ color: ORANGE }}>
                  01
                </span>
              </button>

              {/* Settings Icon */}
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="Settings"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 9.75H15.75C15.45 11.1 14.85 12.3 14.025 13.35L15.675 15L14.25 16.425L12.6 14.775C11.55 15.6 10.35 16.2 9 16.5V18.75H6.75V16.5C5.4 16.2 4.2 15.6 3.15 14.775L1.5 16.425L0.075 15L1.725 13.35C0.9 12.3 0.3 11.1 0 9.75H-2.25V7.5H0C0.3 6.15 0.9 4.95 1.725 3.9L0.075 2.25L1.5 0.825L3.15 2.475C4.2 1.65 5.4 1.05 6.75 0.75V-1.5H9V0.75C10.35 1.05 11.55 1.65 12.6 2.475L14.25 0.825L15.675 2.25L14.025 3.9C14.85 4.95 15.45 6.15 15.75 7.5H18V9.75ZM9 12C10.65 12 12 10.65 12 9C12 7.35 10.65 6 9 6C7.35 6 6 7.35 6 9C6 10.65 7.35 12 9 12Z" fill="currentColor"/>
                </svg>
              </button>

              {/* Logout Icon */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="Logout"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0V2.25H15.75V15.75H7.5V18H18V0H7.5ZM5.25 4.5L0 9.75L5.25 15V11.25H12V8.25H5.25V4.5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}


