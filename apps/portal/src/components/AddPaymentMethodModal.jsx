import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';
import { PAYMENT_METHOD_TYPES } from './payment-method-logos';
import { Button, Dialog } from './design-system';
import { PaymentMethodFormFields } from './PaymentMethodFormFields';
import { PaymentMethodTypePicker } from './PaymentMethodTypePicker';
import { EMPTY_PAYMENT_METHOD_FORMS, buildDetailsFromForm } from '../data/paymentMethodCategories';
import { validatePaymentForm } from '../data/paymentValidation';

/** Matches credit card’s two field rows (label + 44px input, 24px gap) so the dialog doesn’t jump. */
const FORM_BODY_MIN_HEIGHT = 168;

export function AddPaymentMethodModal({
  open,
  onClose,
  onSave,
  title = 'Add payment method',
  initialTypeId,
  initialValues,
  /** Stable id for what is being edited ('new' when adding) — drives the form reset. */
  entityKey = 'new',
  lockType = false,
  saveLabel,
}) {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(PAYMENT_METHOD_TYPES[0].id);
  const [formValues, setFormValues] = useState(EMPTY_PAYMENT_METHOD_FORMS[PAYMENT_METHOD_TYPES[0].id]);
  const [formErrors, setFormErrors] = useState({});
  const initialValuesRef = useRef(initialValues);
  initialValuesRef.current = initialValues;

  // Reset only when the dialog opens or the entity changes. `initialValues` is a
  // fresh object every parent render, so depending on it re-ran this effect
  // continuously and discarded whatever the user had typed.
  useEffect(() => {
    if (!open) return;
    const typeId = initialTypeId ?? PAYMENT_METHOD_TYPES[0].id;
    setSelectedId(typeId);
    setFormValues({ ...EMPTY_PAYMENT_METHOD_FORMS[typeId], ...(initialValuesRef.current ?? {}) });
    setFormErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialTypeId, entityKey]);

  const handleTypeChange = (typeId) => {
    setSelectedId(typeId);
    setFormValues({ ...EMPTY_PAYMENT_METHOD_FORMS[typeId] });
    setFormErrors({});
  };

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSave = () => {
    const errors = validatePaymentForm(selectedId, formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const details = buildDetailsFromForm(selectedId, formValues);
    onSave?.(selectedId, details);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          m: 2,
          width: '100%',
          maxWidth: 760,
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: theme.palette.textPrimary }}>{title}</Typography>
          <IconButton onClick={onClose} aria-label="Close" size="small" sx={{ color: theme.palette.textSecondary2 }}>
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Stack>

        {lockType ? null : (
          <PaymentMethodTypePicker methods={PAYMENT_METHOD_TYPES} selectedId={selectedId} onSelect={handleTypeChange} />
        )}

        <Divider sx={{ mb: 2.5, borderColor: theme.palette.borderSubtle1 }} />

        <Box sx={{ minHeight: FORM_BODY_MIN_HEIGHT }}>
          <PaymentMethodFormFields
            methodId={selectedId}
            values={formValues}
            errors={formErrors}
            onChange={handleFieldChange}
          />
        </Box>

        <Button variant="primary" fullWidth onClick={handleSave} sx={{ mt: 3, py: 1.25, fontWeight: 600, borderRadius: '8px' }}>
          {saveLabel ?? 'Save payment method'}
        </Button>
      </Box>
    </Dialog>
  );
}
