import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { AddPaymentMethodModal } from '../components/AddPaymentMethodModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PaymentMethodListRow } from '../components/PaymentMethodListRow';
import { Button, EmptyState, PageHeader } from '../components/design-system';
import { usePaymentMethods } from '../context/PaymentMethodsContext';
import {
  PAYMENT_METHOD_CATEGORIES,
  getPaymentMethodShortLabel,
  getPaymentMethodType,
} from '../data/paymentMethodCategories';
import { PAYMENT_METHOD_TYPES } from '../components/payment-method-logos';

/**
 * Prefill the edit form from stored details. Secrets we deliberately never keep
 * (full card number, CVV, PayPal password) come back blank and must be re-entered.
 */
function getEditFormValues(method) {
  const d = method.details ?? {};
  switch (method.typeId) {
    case 'credit-card':
      return {
        nameOnCard: d.nameOnCard ?? '',
        expiryMonth: d.expiryMonth ?? '',
        // The field takes two digits; stored years may be four.
        expiryYear: String(d.expiryYear ?? '').slice(-2),
      };
    case 'ach':
      return { routingNumber: d.routingNumber ?? '', accountHolderName: d.accountHolderName ?? '' };
    case 'paypal':
      return { email: d.email ?? '' };
    case 'zelle':
      return { contact: d.contact ?? '', nickname: d.nickname ?? '' };
    case 'venmo':
      return { username: d.username ?? '', phone: d.phone ?? '' };
    default:
      return {};
  }
}

export function PaymentMethodsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    methods,
    defaultMethodId,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePaymentMethod,
  } = usePaymentMethods();
  const [addOpen, setAddOpen] = useState(false);
  const [addCategory, setAddCategory] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodPendingRemoval, setMethodPendingRemoval] = useState(null);

  /**
   * What removing this method would cost, beyond the method itself. Removing the
   * default hands the role to whatever the context would promote — the customer
   * should read that before confirming, not discover it afterwards.
   */
  const removalConsequence = (() => {
    if (!methodPendingRemoval) return null;
    if (methodPendingRemoval.id !== defaultMethodId) return null;
    const successor = methods.find((method) => method.id !== methodPendingRemoval.id);
    return successor
      ? `This is your default. ${getPaymentMethodShortLabel(successor)} will take over as the default.`
      : 'This is your last saved method. Checkout will ask for full details until you add another.';
  })();

  const openAddPaymentMethod = () => {
    setAddCategory(null);
    setEditingMethod(null);
    setAddOpen(true);
  };

  /** Re-open the form for an existing method, prefilled with what we still hold. */
  const openEditPaymentMethod = (method) => {
    setEditingMethod(method);
    setAddCategory(method.typeId);
    setAddOpen(true);
  };

  return (
    <PortalShell activeNav="invoice-payment">
      <Stack spacing={2.5} sx={{ width: '100%' }}>
        <PageHeader
          onBack={() => navigate('/invoice-payment')}
          backLabel="Back to invoices"
          title="Card Management"
          description="Saved payment methods for this account. The default is what checkout offers first."
          actions={
            <Button
              variant="primary"
              onClick={openAddPaymentMethod}
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            >
              Add Payment method
            </Button>
          }
        />

        <Box>
          {methods.length === 0 ? (
            <EmptyState
              title="No saved payment methods"
              description="Add a card or bank account and checkout will offer it instead of asking for full details every time."
            >
              <Button
                variant="primary"
                onClick={openAddPaymentMethod}
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                sx={{ mt: 3 }}
              >
                Add Payment method
              </Button>
            </EmptyState>
          ) : null}
          {PAYMENT_METHOD_CATEGORIES.filter((category) =>
            methods.some((method) => method.typeId === category.typeId),
          ).map((category, categoryIndex) => {
            // A category with nothing in it is dropped entirely — heading included —
            // so removing the last method never leaves an empty section behind.
            const rows = methods.filter((method) => method.typeId === category.typeId);

            return (
              <Box key={category.typeId}>
                {categoryIndex > 0 ? (
                  <Divider sx={{ borderColor: theme.palette.borderSubtle1 }} />
                ) : null}
                <Box sx={{ py: 2 }}>
                  {/* Group eyebrow — deliberately distinct from the 16/600 row name below it. */}
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: '18px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: theme.palette.textSecondary3,
                      mb: 1,
                    }}
                  >
                    {category.title}
                  </Typography>

                  <Stack spacing={0}>
                    {rows.map((method, index) => (
                      <PaymentMethodListRow
                        key={method.id}
                        method={method}
                        isDefault={method.id === defaultMethodId}
                        onEdit={openEditPaymentMethod}
                        onSetDefault={setDefaultPaymentMethod}
                        onRemove={() => setMethodPendingRemoval(method)}
                        isFirst={index === 0}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Stack>

      <ConfirmDialog
        open={Boolean(methodPendingRemoval)}
        title={
          methodPendingRemoval
            ? `Remove ${getPaymentMethodShortLabel(methodPendingRemoval)}?`
            : 'Remove payment method?'
        }
        description="It will no longer be offered at checkout. Invoices already paid with it are unaffected."
        consequence={removalConsequence}
        confirmLabel="Remove method"
        onClose={() => setMethodPendingRemoval(null)}
        onConfirm={() => {
          removePaymentMethod(methodPendingRemoval.id);
          setMethodPendingRemoval(null);
        }}
      />

      <AddPaymentMethodModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setAddCategory(null);
          setEditingMethod(null);
        }}
        onSave={(typeId, details) => {
          if (editingMethod) {
            updatePaymentMethod(editingMethod.id, typeId, details);
            return;
          }
          addPaymentMethod(typeId, details, { makeDefault: methods.length === 0 || !defaultMethodId });
        }}
        initialValues={editingMethod ? getEditFormValues(editingMethod) : undefined}
        entityKey={editingMethod?.id ?? 'new'}
        lockType={Boolean(editingMethod)}
        saveLabel={editingMethod ? 'Save changes' : undefined}
        title={
          editingMethod
            ? `Edit ${getPaymentMethodType(editingMethod.typeId, PAYMENT_METHOD_TYPES)?.label ?? 'payment method'}`
            : addCategory
            ? `Add ${getPaymentMethodType(addCategory, PAYMENT_METHOD_TYPES)?.label ?? 'payment method'}`
            : 'Add payment method'
        }
        initialTypeId={addCategory ?? undefined}
      />
    </PortalShell>
  );
}
