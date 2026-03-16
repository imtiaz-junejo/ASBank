import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import CreditCardPaymentModule from './CreditCardPaymentModule';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CreditCardPaymentPage() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <CreditCardPaymentModule
        onClose={() => window.history.back()}
        onSuccess={() => {
          window.history.back();
        }}
      />
    </DashboardLayout>
  );
}

