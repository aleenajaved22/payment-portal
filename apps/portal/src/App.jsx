import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { InvoicePaymentPage } from './pages/InvoicePaymentPage';
import { LoginPage } from './pages/LoginPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { useAuth } from './auth/AuthContext';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice-payment"
        element={
          <ProtectedRoute>
            <InvoicePaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-methods"
        element={
          <ProtectedRoute>
            <PaymentMethodsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
