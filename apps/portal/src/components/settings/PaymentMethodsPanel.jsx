import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { AddPaymentMethodModal } from '../AddPaymentMethodModal';
import { ConfirmDialog } from '../ConfirmDialog';
import { PaymentMethodListRow } from '../PaymentMethodListRow';
import { Button, EmptyState } from '../design-system';
import { usePaymentMethods } from '../../context/PaymentMethodsContext';
import {
  PAYMENT_METHOD_CATEGORIES,
  getPaymentMethodShortLabel,
  getPaymentMethodType,
} from '../../data/paymentMethodCategories';
import { PAYMENT_METHOD_TYPES } from '../payment-method-logos';

export function PaymentMethodsPanel() {
  const theme = useTheme();
  const { methods, defaultMethodId, addPaymentMethod, removePaymentMethod } = usePaymentMethods();
  const [addOpen, setAddOpen] = useState(false);
  const [addCategory, setAddCategory] = useState(null);
  const [methodPendingRemoval, setMethodPendingRemoval] = useState(null);

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
    setAddOpen(true);
  };

  return (
    <>
      <Stack spacing={3} sx={{ width: '100%' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary }}>
              Payment methods
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary3, mt: 0.5 }}>
              Manage cards and accounts used at checkout.
            </Typography>
          </Box>
          <Button
            variant="primary"
            onClick={openAddPaymentMethod}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            sx={{ height: 36, px: 2, flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'flex-start' } }}
          >
            Add
          </Button>
        </Stack>

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
                Add
              </Button>
            </EmptyState>
          ) : null}
          {PAYMENT_METHOD_CATEGORIES.filter((category) =>
            methods.some((method) => method.typeId === category.typeId),
          ).map((category, categoryIndex) => {
            const rows = methods.filter((method) => method.typeId === category.typeId);

            return (
              <Box key={category.typeId}>
                {categoryIndex > 0 ? <Divider sx={{ borderColor: theme.palette.borderSubtle1 }} /> : null}
                <Box sx={{ py: 2 }}>
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
        }}
        onSave={(typeId, details) => {
          addPaymentMethod(typeId, details, { makeDefault: methods.length === 0 || !defaultMethodId });
        }}
        entityKey="new"
        title={
          addCategory
            ? `Add ${getPaymentMethodType(addCategory, PAYMENT_METHOD_TYPES)?.label ?? 'payment method'}`
            : 'Add payment method'
        }
        initialTypeId={addCategory ?? undefined}
      />
    </>
  );
}
