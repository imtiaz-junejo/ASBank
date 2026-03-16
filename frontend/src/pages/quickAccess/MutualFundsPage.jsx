import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import QuickAccessNavigation from '../../components/QuickAccessNavigation';

const BLUE = '#003366';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function MutualFundsPage() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
            My Mutual Funds
          </h2>
        </div>
        <QuickAccessNavigation />
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">My Mutual Funds content coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

