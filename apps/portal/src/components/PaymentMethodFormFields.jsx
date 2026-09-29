import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField } from './design-system';
import { semantic } from '@signal/design-tokens/colors';
import { cvvLengthFor, formatCardNumber, formatDigits } from '../data/paymentValidation';

/**
 * A labelled field.
 *
 * `children` is a render function receiving the ids this field owns, so the
 * input it wraps can be tied to both the visible label and the error text:
 *
 *   - the label is a real `<label htmlFor>`, which makes the accessible name the
 *     same string the eye reads. It used to be a bare Typography, so the name
 *     came from the placeholder instead — "Name on card" on screen announced as
 *     "Full name", which also broke voice control ("click Name on card").
 *   - the error is referenced by `aria-describedby` rather than shouted as its
 *     own `role="alert"`. Four alerts mounting in one tick get coalesced or
 *     dropped; described-by text is read when focus lands on the field, which is
 *     exactly where the modal sends it.
 *
 * `error` sits beneath whatever the field wraps, so a composite control like the
 * MM/YY pair reports one message for both boxes instead of two half-messages
 * that each describe the other's problem.
 */
function PaymentField({ label, hint, error, children }) {
  const theme = useTheme();
  const reactId = useId();
  const fieldId = `pf-${reactId}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
      <Typography
        component="label"
        htmlFor={fieldId}
        sx={{
          display: 'block',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '20px',
          color: theme.palette.textPrimary,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      {hint ? (
        <Typography id={hintId} sx={{ fontSize: 12, lineHeight: '16px', color: theme.palette.textSecondary2, mb: 1 }}>
          {hint}
        </Typography>
      ) : null}
      {children({ fieldId, describedBy })}
      {error ? (
        <Typography
          id={errorId}
          sx={{ mt: 0.5, fontSize: 12, lineHeight: '16px', color: theme.palette.textAlert }}
        >
          {error}
        </Typography>
      ) : null}
    </Box>
  );
}

const fieldSx = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  '& .MuiFormControl-root': {
    width: '100%',
    minWidth: 0,
  },
  '& .MuiOutlinedInput-root': {
    minWidth: 0,
    maxWidth: '100%',
    borderRadius: '8px',
    backgroundColor: semantic.surface.white,
  },
};

const fieldPlaceholderSx = {
  ...fieldSx,
  '& .MuiOutlinedInput-input::placeholder': {
    fontSize: 13,
    opacity: 1,
  },
};

const formStackSx = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  overflowX: 'hidden',
};

/**
 * Two fields abreast — but only where there is room for two.
 *
 * The second column used to claim its 240px maximum at every width, so on a
 * phone the 16-digit card number was left with whatever remained: measured at
 * 19px, beside a 212px CVV. Below sm the pair stacks, which is the only honest
 * answer on a 375px screen.
 */
const twoColumnRowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(148px, 240px)' },
  columnGap: 1,
  rowGap: 2.5,
  width: '100%',
  minWidth: 0,
  alignItems: 'start',
  '& > *': { minWidth: 0 },
};

export function PaymentMethodFormFields({ methodId, values = {}, errors = {}, onChange }) {
  const set = (field) => (event) => onChange?.(field, event.target.value);
  /* Masked fields rewrite what was typed before it reaches state, so the value
     shown and the value validated are always the same string. */
  const setFormatted = (field, format) => (event) => onChange?.(field, format(event.target.value));
  const cvvLength = cvvLengthFor(values.cardNumber);

  /**
   * Every text input in this form is the same shape; only its wiring differs.
   *
   * `aria-describedby` goes through `inputProps`, not as a top-level prop: MUI
   * spreads unrecognised props onto the FormControl root, so setting it directly
   * lands it on a wrapper div and the input keeps no description at all.
   */
  const field = (name, props) => ({ fieldId, describedBy }) => (
    <TextField
      id={fieldId}
      fullWidth
      size="small"
      error={Boolean(errors[props.errorKey ?? name])}
      value={values[name] ?? ''}
      onChange={props.onChange ?? set(name)}
      placeholder={props.placeholder}
      type={props.type}
      inputProps={{ ...props.inputProps, 'aria-describedby': describedBy }}
      sx={fieldPlaceholderSx}
    />
  );

  switch (methodId) {
    case 'credit-card':
      return (
        <Stack spacing={2.5} sx={formStackSx}>
          <Box sx={twoColumnRowSx}>
            <PaymentField label="Card number" error={errors.cardNumber}>
              {field('cardNumber', {
                placeholder: 'Enter 16-digit card number',
                inputProps: { inputMode: 'numeric', autoComplete: 'cc-number' },
                onChange: setFormatted('cardNumber', formatCardNumber),
              })}
            </PaymentField>
            <PaymentField label="CVV" error={errors.cvv}>
              {field('cvv', {
                placeholder: 'Enter CVV',
                inputProps: { inputMode: 'numeric', autoComplete: 'cc-csc' },
                onChange: setFormatted('cvv', (value) => formatDigits(value, cvvLength)),
              })}
            </PaymentField>
          </Box>

          <Box sx={twoColumnRowSx}>
            <PaymentField label="Name on card" error={errors.nameOnCard}>
              {field('nameOnCard', {
                placeholder: 'Name as printed on the card',
                inputProps: { autoComplete: 'cc-name' },
              })}
            </PaymentField>

            {/* Two inputs under one visible label, so they keep explicit names of
                their own and share the single expiry error between them. */}
            <PaymentField label="Expiry date" error={errors.expiry}>
              {({ describedBy }) => (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                    columnGap: 1,
                    width: '100%',
                    minWidth: 0,
                    maxWidth: '100%',
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="MM"
                    error={Boolean(errors.expiry)}
                    inputProps={{
                      maxLength: 2,
                      inputMode: 'numeric',
                      autoComplete: 'cc-exp-month',
                      'aria-label': 'Expiry month',
                      'aria-describedby': describedBy,
                    }}
                    value={values.expiryMonth ?? ''}
                    onChange={setFormatted('expiryMonth', (value) => formatDigits(value, 2))}
                    sx={{ ...fieldPlaceholderSx, minWidth: 0 }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="YY"
                    error={Boolean(errors.expiry)}
                    inputProps={{
                      maxLength: 2,
                      inputMode: 'numeric',
                      autoComplete: 'cc-exp-year',
                      'aria-label': 'Expiry year',
                      'aria-describedby': describedBy,
                    }}
                    value={values.expiryYear ?? ''}
                    onChange={setFormatted('expiryYear', (value) => formatDigits(value, 2))}
                    sx={{ ...fieldPlaceholderSx, minWidth: 0 }}
                  />
                </Box>
              )}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'ach':
      return (
        <Stack spacing={2.5} sx={formStackSx}>
          <Box sx={twoColumnRowSx}>
            <PaymentField label="Account number" error={errors.accountNumber}>
              {field('accountNumber', {
                placeholder: 'Enter account number',
                inputProps: { maxLength: 17, inputMode: 'numeric' },
                onChange: setFormatted('accountNumber', (value) => formatDigits(value, 17)),
              })}
            </PaymentField>
            <PaymentField label="Routing number" error={errors.routingNumber}>
              {field('routingNumber', {
                placeholder: '9 digits',
                inputProps: { maxLength: 9, inputMode: 'numeric' },
                onChange: setFormatted('routingNumber', (value) => formatDigits(value, 9)),
              })}
            </PaymentField>
          </Box>

          {/* Alone on its row rather than paired with an empty cell: a name field
              has no reason to stop at half width just to keep a grid square. */}
          <Box sx={{ ...twoColumnRowSx, gridTemplateColumns: '1fr' }}>
            <PaymentField label="Account holder name" error={errors.accountHolderName}>
              {field('accountHolderName', { placeholder: 'Name on the account' })}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'paypal':
      /**
       * Email only — the password field is gone.
       *
       * No PayPal integration has ever collected a PayPal password on the
       * merchant's own form; it is an OAuth redirect or an SDK popup. Asking for
       * it here had the exact shape of a phishing page, and a customer paying
       * attention would have been right to refuse. It was also never stored:
       * `buildDetailsFromForm` reads only the email.
       */
      return (
        <Stack spacing={2.5} sx={formStackSx}>
          <Box sx={twoColumnRowSx}>
            <PaymentField
              label="PayPal email"
              hint="We'll open PayPal to confirm. You sign in there, never here."
              error={errors.email}
            >
              {field('email', { type: 'email', placeholder: 'Enter PayPal email' })}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'zelle':
      return (
        <Stack spacing={2.5} sx={formStackSx}>
          <Box sx={twoColumnRowSx}>
            <PaymentField label="Zelle email or phone" error={errors.contact}>
              {field('contact', { placeholder: 'Email or mobile number' })}
            </PaymentField>
            <PaymentField label="Account nickname (optional)" error={errors.nickname}>
              {field('nickname', { placeholder: 'e.g. Primary Zelle' })}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'venmo':
      return (
        <Stack spacing={2.5} sx={formStackSx}>
          <Box sx={twoColumnRowSx}>
            <PaymentField label="Venmo username" error={errors.username}>
              {field('username', { placeholder: '@username' })}
            </PaymentField>
            <PaymentField label="Mobile number" error={errors.phone}>
              {field('phone', { placeholder: '(555) 123-4567', inputProps: { inputMode: 'tel', autoComplete: 'tel' } })}
            </PaymentField>
          </Box>
        </Stack>
      );

    default:
      return null;
  }
}
