import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import PayAnyoneModule from './PayAnyoneModule';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PayAnyonePage() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <PayAnyoneModule
        onClose={() => window.history.back()}
        onSuccess={() => {
          // Success is handled within PayAnyoneModule
        }}
      />
    </DashboardLayout>
  );
}

