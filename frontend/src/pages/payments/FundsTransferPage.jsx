import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import FundsTransferModule from './FundsTransferModule';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function FundsTransferPage() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <FundsTransferModule
        onClose={() => window.history.back()}
        onSuccess={() => {
          // Success is handled within FundsTransferModule
        }}
      />
    </DashboardLayout>
  );
}


