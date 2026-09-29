import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { getPaymentMethodRowDisplay, getPaymentMethodType } from '../data/paymentMethodCategories';
import { PAYMENT_METHOD_TYPES, PaymentMethodLogoIcon } from './payment-method-logos';

/**
 * The saved methods, offered before the form.
 *
 * Checkout used to open on a blank card form even for an account with a card on
 * file, which asked the customer to re-key a number the portal was already
 * showing them on the dashboard two inches away. The saved methods now lead, the
 * default is preselected, and the form is what you reach for only if you want to
 * pay with something else.
 *
 * Rows behave as one radio group rather than as buttons: arrow keys move between
 * them, only the active row is in the tab order, and the whole row is the target.
 */

const NEW_METHOD_VALUE = 'new';

export { NEW_METHOD_VALUE };

function ChoiceRow({ selected, onSelect, tabIndex, children }) {
  const theme = useTheme();

  return (
    <Box
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          onSelect();
        }
      }}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.75,
        py: 1.25,
        border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.borderSubtle1}`,
        borderRadius: '10px',
        backgroundColor: selected ? theme.palette.surfaceBrandSubtle : theme.palette.surfaceWhite,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        '&:hover': { borderColor: selected ? theme.palette.primary.main : theme.palette.borderSubtle2 },
        /* The ring has to clear 3:1 against whatever it sits on. primary.main
           is only 2.93:1 on the selected row's brand tint, so the darker
           on-subtle token carries it on both selected and unselected rows. */
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.textBrandOnSubtle}`,
          outlineOffset: 2,
        },
      }}
    >
      {children}
      {/* Drawn rather than an <input>: the row is already the control, and a real
          radio would add a second focus stop inside it. */}
      <Box
        aria-hidden
        sx={{
          flexShrink: 0,
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `1.5px solid ${selected ? theme.palette.primary.main : theme.palette.borderSubtle2}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: theme.palette.primary.main }} />
        ) : null}
      </Box>
    </Box>
  );
}

export function CheckoutSavedMethods({ methods, selectedId, onSelect, defaultMethodId }) {
  const theme = useTheme();
  if (methods.length === 0) return null;

  const values = [...methods.map((method) => method.id), NEW_METHOD_VALUE];

  /* Roving focus: the group is one tab stop, arrows move within it. */
  const handleKeyDown = (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const current = values.indexOf(selectedId);
    const nextIndex = (current + step + values.length) % values.length;
    onSelect(values[nextIndex]);
    // Focus by position, not by `[tabindex="0"]`: React has not re-rendered yet,
    // so that attribute is still on the row we are leaving.
    event.currentTarget.querySelectorAll('[role="radio"]')[nextIndex]?.focus();
  };

  return (
    <Box
      role="radiogroup"
      /* Points at the visible label instead of repeating it — aria-label here
         meant the group announced "Pay with" twice. */
      aria-labelledby="checkout-pay-with"
      onKeyDown={handleKeyDown}
      sx={{ mb: 2.5 }}
    >
      <Typography
        id="checkout-pay-with"
        sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textSecondary2, mb: 1 }}
      >
        Pay with
      </Typography>

      <Stack spacing={1}>
        {methods.map((method) => {
          const Logo = getPaymentMethodType(method.typeId, PAYMENT_METHOD_TYPES)?.Logo;
          const display = getPaymentMethodRowDisplay(method);
          const selected = method.id === selectedId;
          const detail = [display.reference, ...display.fields.map((field) => field.value)]
            .filter((part) => part && part !== '—')
            .join(' · ');

          return (
            <ChoiceRow
              key={method.id}
              selected={selected}
              tabIndex={selected ? 0 : -1}
              onSelect={() => onSelect(method.id)}
            >
              {Logo ? (
                <Box sx={{ flexShrink: 0, color: theme.palette.textSecondary2 }}>
                  <PaymentMethodLogoIcon Logo={Logo} size={28} />
                </Box>
              ) : null}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }} noWrap>
                    {display.primary}
                  </Typography>
                  {method.id === defaultMethodId ? (
                    <Typography
                      sx={{
                        flexShrink: 0,
                        px: 0.75,
                        py: '1px',
                        borderRadius: '999px',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        color: theme.palette.textBrandOnSubtle,
                        backgroundColor: theme.palette.surfaceBrandSubtle,
                      }}
                    >
                      Default
                    </Typography>
                  ) : null}
                </Stack>
                {detail ? (
                  <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary2 }} noWrap>
                    {detail}
                  </Typography>
                ) : null}
              </Box>
            </ChoiceRow>
          );
        })}

        <ChoiceRow
          selected={selectedId === NEW_METHOD_VALUE}
          tabIndex={selectedId === NEW_METHOD_VALUE ? 0 : -1}
          onSelect={() => onSelect(NEW_METHOD_VALUE)}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.textSecondary2,
              backgroundColor: theme.palette.surfaceGreySubtle,
            }}
          >
            <AddOutlinedIcon sx={{ fontSize: 17 }} />
          </Box>
          <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }}>
            Use a different payment method
          </Typography>
        </ChoiceRow>
      </Stack>
    </Box>
  );
}
