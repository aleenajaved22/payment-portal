import { Navigate } from 'react-router-dom';

/** Payment methods live under Settings; keep old URL working. */
export function PaymentMethodsPage() {
  return <Navigate to="/settings/payment-methods" replace />;
}
