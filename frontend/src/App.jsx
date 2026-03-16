import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ASBankLanding from './pages/ASBankLanding';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import DashboardPage from './pages/DashboardPage';
import FavoritesPage from './pages/payments/FavoritesPage';
import FundsTransferPage from './pages/payments/FundsTransferPage';
import BillPaymentsPage from './pages/payments/BillPaymentsPage';
import PayAnyonePage from './pages/payments/PayAnyonePage';
import DonationsPage from './pages/payments/DonationsPage';
import MobileTopupPage from './pages/payments/MobileTopupPage';
import CreditCardPaymentPage from './pages/payments/CreditCardPaymentPage';
import TicketsPage from './pages/payments/TicketsPage';
import RaastIdPage from './pages/quickAccess/RaastIdPage';
import PaydayLoanPage from './pages/quickAccess/PaydayLoanPage';
import MutualFundsPage from './pages/quickAccess/MutualFundsPage';
import DebitCardsPage from './pages/quickAccess/DebitCardsPage';
import ManagePayeesPage from './pages/quickAccess/ManagePayeesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ASBankLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/payments/favorites" element={<FavoritesPage />} />
          <Route path="/payments/funds-transfer" element={<FundsTransferPage />} />
          <Route path="/payments/pay-bills" element={<BillPaymentsPage />} />
          <Route path="/payments/pay-anyone" element={<PayAnyonePage />} />
          <Route path="/payments/donations" element={<DonationsPage />} />
          <Route path="/payments/mobile-topup" element={<MobileTopupPage />} />
          <Route path="/payments/credit-card-payment" element={<CreditCardPaymentPage />} />
          <Route path="/payments/tickets" element={<TicketsPage />} />
          <Route path="/quick-access/raast-id" element={<RaastIdPage />} />
          <Route path="/quick-access/payday-loan" element={<PaydayLoanPage />} />
          <Route path="/quick-access/mutual-funds" element={<MutualFundsPage />} />
          <Route path="/quick-access/debit-cards" element={<DebitCardsPage />} />
          <Route path="/quick-access/manage-payees" element={<ManagePayeesPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
