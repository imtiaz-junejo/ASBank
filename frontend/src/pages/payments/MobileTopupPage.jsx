import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import MobileTopupModule from './MobileTopupModule';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function MobileTopupPage() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <MobileTopupModule
        onClose={() => window.history.back()}
        onSuccess={() => {
          window.history.back();
        }}
      />
    </DashboardLayout>
  );
}

