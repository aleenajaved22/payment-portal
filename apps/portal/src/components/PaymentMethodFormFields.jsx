import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField } from './design-system';
import { portalFieldInputSx, portalFieldLabelSx } from './portalFormFieldStyles';
import { cvvLengthFor, formatCardExpiry, formatCardNumber, formatDigits } from '../data/paymentValidation';

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
function PaymentField({ label, hint, error, required = false, children }) {
  const theme = useTheme();
  const reactId = useId();
  const fieldId = `pf-${reactId}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
      <Typography component="label" htmlFor={fieldId} sx={portalFieldLabelSx(theme)}>
        {label}
        {required ? (
          <Box component="span" sx={{ color: theme.palette.textAlert, ml: 0.25 }} aria-hidden="true">
            *
          </Box>
        ) : null}
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
  columnGap: 3,
  rowGap: 3,
  width: '100%',
  minWidth: 0,
  alignItems: 'start',
  '& > *': { minWidth: 0 },
};

const twoEqualColumnRowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  columnGap: 3,
  rowGap: 3,
  width: '100%',
  minWidth: 0,
  alignItems: 'start',
  '& > *': { minWidth: 0 },
};

export function PaymentMethodFormFields({ methodId, values = {}, errors = {}, onChange }) {
  const theme = useTheme();
  const fieldInputSx = portalFieldInputSx(theme);
  const set = (field) => (event) => onChange?.(field, event.target.value);
  /* Masked fields rewrite what was typed before it reaches state, so the value
     shown and the value validated are always the same string. */
  const setFormatted = (field, format) => (event) => onChange?.(field, format(event.target.value));
  const cvvLength = cvvLengthFor(values.cardNumber);
  const setExpiry = (event) => {
    const digits = formatDigits(event.target.value, 4);
    onChange?.('expiryMonth', digits.slice(0, 2));
    onChange?.('expiryYear', digits.slice(2, 4));
  };
  const expiryDisplay = formatCardExpiry(`${values.expiryMonth ?? ''}${values.expiryYear ?? ''}`);

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
      error={Boolean(errors[props.errorKey ?? name])}
      value={values[name] ?? ''}
      onChange={props.onChange ?? set(name)}
      placeholder={props.placeholder}
      type={props.type}
      inputProps={{ ...props.inputProps, 'aria-describedby': describedBy }}
      sx={fieldInputSx}
    />
  );

  switch (methodId) {
    case 'credit-card':
      return (
        <Stack spacing={3} sx={formStackSx}>
          <Box sx={twoColumnRowSx}>
            <PaymentField label="Card number" required error={errors.cardNumber}>
              {field('cardNumber', {
                placeholder: 'Enter 16-digit card number',
                inputProps: { inputMode: 'numeric', autoComplete: 'cc-number' },
                onChange: setFormatted('cardNumber', formatCardNumber),
              })}
            </PaymentField>
            <PaymentField label="CVV" required error={errors.cvv}>
              {field('cvv', {
                placeholder: 'Enter CVV',
                inputProps: { inputMode: 'numeric', autoComplete: 'cc-csc' },
                onChange: setFormatted('cvv', (value) => formatDigits(value, cvvLength)),
              })}
            </PaymentField>
          </Box>

          <Box sx={twoEqualColumnRowSx}>
            <PaymentField label="Name on card" required error={errors.nameOnCard}>
              {field('nameOnCard', {
                placeholder: 'Name as printed on the card',
                inputProps: { autoComplete: 'cc-name' },
              })}
            </PaymentField>

            <PaymentField label="Expiry date" required error={errors.expiry}>
              {({ fieldId, describedBy }) => (
                <TextField
                  id={fieldId}
                  fullWidth
                  placeholder="MM/YY"
                  error={Boolean(errors.expiry)}
                  value={expiryDisplay}
                  onChange={setExpiry}
                  inputProps={{
                    maxLength: 5,
                    inputMode: 'numeric',
                    autoComplete: 'cc-exp',
                    'aria-label': 'Expiry date',
                    'aria-describedby': describedBy,
                  }}
                  sx={fieldInputSx}
                />
              )}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'ach':
      return (
        <Stack spacing={3} sx={formStackSx}>
          <Box sx={twoEqualColumnRowSx}>
            <PaymentField label="Account number" required error={errors.accountNumber}>
              {field('accountNumber', {
                placeholder: 'Enter account number',
                inputProps: { maxLength: 17, inputMode: 'numeric' },
                onChange: setFormatted('accountNumber', (value) => formatDigits(value, 17)),
              })}
            </PaymentField>
            <PaymentField label="Routing number" required error={errors.routingNumber}>
              {field('routingNumber', {
                placeholder: '9 digits',
                inputProps: { maxLength: 9, inputMode: 'numeric' },
                onChange: setFormatted('routingNumber', (value) => formatDigits(value, 9)),
              })}
            </PaymentField>
          </Box>

          {/* Alone on its row rather than paired with an empty cell: a name field
              has no reason to stop at half width just to keep a grid square. */}
          <Box sx={{ ...twoEqualColumnRowSx, gridTemplateColumns: '1fr' }}>
            <PaymentField label="Account holder name" required error={errors.accountHolderName}>
              {field('accountHolderName', { placeholder: 'Name on the account' })}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'google-pay':
      return (
        <Stack spacing={3} sx={formStackSx}>
          <Box sx={twoEqualColumnRowSx}>
            <PaymentField label="Google account email" required error={errors.email}>
              {field('email', { type: 'email', placeholder: 'Enter Google account email' })}
            </PaymentField>
            <PaymentField label="Account holder name" required error={errors.accountHolderName}>
              {field('accountHolderName', { placeholder: 'Name on the wallet' })}
            </PaymentField>
          </Box>
        </Stack>
      );

    case 'apple-pay':
      return (
        <Stack spacing={3} sx={formStackSx}>
          <Box sx={twoEqualColumnRowSx}>
            <PaymentField label="Apple ID email" required error={errors.email}>
              {field('email', { type: 'email', placeholder: 'Enter Apple ID email' })}
            </PaymentField>
            <PaymentField label="Billing name" required error={errors.accountHolderName}>
              {field('accountHolderName', { placeholder: 'Name on the wallet' })}
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
        <Stack spacing={3} sx={formStackSx}>
          <Box sx={twoEqualColumnRowSx}>
            <PaymentField label="PayPal email" required error={errors.email}>
              {field('email', { type: 'email', placeholder: 'Enter PayPal email' })}
            </PaymentField>
          </Box>
        </Stack>
      );

    default:
      return null;
  }
}
