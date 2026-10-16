import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useMemo, useState } from 'react';
import { PortalShell } from '../components/PortalShell';
import { AddPaymentMethodModal } from '../components/AddPaymentMethodModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PaymentMethodListRow } from '../components/PaymentMethodListRow';
import { Button, EmptyState, Search } from '../components/design-system';
import { usePaymentMethods } from '../context/PaymentMethodsContext';
import {
  PAYMENT_METHOD_CATEGORIES,
  getPaymentMethodRowDisplay,
  getPaymentMethodShortLabel,
  getPaymentMethodType,
} from '../data/paymentMethodCategories';
import { PAYMENT_METHOD_TYPES } from '../components/payment-method-logos';

export function PaymentMethodsPage() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const {
    methods,
    defaultMethodId,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  } = usePaymentMethods();
  const [addOpen, setAddOpen] = useState(false);
  const [addCategory, setAddCategory] = useState(null);
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
    setAddOpen(true);
  };

  const filteredMethods = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return methods;
    return methods.filter((method) => {
      const display = getPaymentMethodRowDisplay(method);
      const typeLabel = getPaymentMethodType(method.typeId, PAYMENT_METHOD_TYPES)?.label ?? '';
      const haystack = [display.primary, display.secondary, getPaymentMethodShortLabel(method), typeLabel]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [methods, query]);

  return (
    <PortalShell activeNav={false}>
      <Stack spacing={2.5} sx={{ width: '100%' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Search
            placeholder="Search"
            variant="outlined"
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{
              width: { xs: '100%', sm: 240 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: theme.palette.surfaceWhite,
                height: 36,
              },
              '& .MuiOutlinedInput-input': { fontSize: 14, fontWeight: 500, py: '7px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.borderSubtle2 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 20, color: theme.palette.textSecondary2 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="primary"
            onClick={openAddPaymentMethod}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            sx={{ height: 36, px: 2.5, flexShrink: 0 }}
          >
            Add Payment method
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
                Add Payment method
              </Button>
            </EmptyState>
          ) : null}
          {methods.length > 0 && filteredMethods.length === 0 ? (
            <EmptyState title="No payment methods found" description="Try adjusting your search." />
          ) : null}
          {PAYMENT_METHOD_CATEGORIES.filter((category) =>
            filteredMethods.some((method) => method.typeId === category.typeId),
          ).map((category, categoryIndex) => {
            // A category with nothing in it is dropped entirely — heading included —
            // so removing the last method never leaves an empty section behind.
            const rows = filteredMethods.filter((method) => method.typeId === category.typeId);

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
    </PortalShell>
  );
}
