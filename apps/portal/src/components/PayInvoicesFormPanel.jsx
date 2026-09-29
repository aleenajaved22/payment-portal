import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { CheckoutSavedMethods, NEW_METHOD_VALUE } from './CheckoutSavedMethods';
import { PaymentMethodFormFields } from './PaymentMethodFormFields';
import { PaymentMethodTypePicker } from './PaymentMethodTypePicker';

/**
 * The checkout form: saved methods first, the new-method form underneath.
 *
 * With something saved, the type tiles and fields only appear once the customer
 * has asked for a different method — showing both at once would present two
 * competing answers to "how am I paying", and the account's own card should not
 * have to compete with a blank form for that.
 */
export function PayInvoicesFormPanel({
  methods,
  selectedId,
  onSelect,
  formValues,
  formErrors,
  onFieldChange,
  savedMethods = [],
  savedSelection,
  onSavedSelectionChange,
  defaultMethodId,
  formFooter,
}) {
  const theme = useTheme();
  const hasSaved = savedMethods.length > 0;
  const showNewMethodForm = !hasSaved || savedSelection === NEW_METHOD_VALUE;

  return (
    <>
      {/* A real heading, and the dialog's accessible name. 700 to match the
          house CardHeading rather than inventing a 600 step for this one panel. */}
      <Typography
        component="h2"
        id="checkout-title"
        sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary, mb: 2.5 }}
      >
        Pay invoices
      </Typography>

      {/* From md this column scrolls on its own beside the receipt. On a phone
          the whole dialog is the scroller, so this must not trap a second one
          inside it — nested scrollers on a touch screen are a coin toss. */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflowY: { xs: 'visible', md: 'auto' },
          overflowX: 'hidden',
          // Keeps the scrollbar off the right-hand field's border.
          pr: { md: 0.5 },
        }}
      >
        {hasSaved ? (
          <CheckoutSavedMethods
            methods={savedMethods}
            selectedId={savedSelection}
            onSelect={onSavedSelectionChange}
            defaultMethodId={defaultMethodId}
          />
        ) : null}

        {showNewMethodForm ? (
          <>
            {hasSaved ? <Divider sx={{ mb: 2.5, borderColor: theme.palette.borderSubtle1 }} /> : null}

            <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textSecondary2, mb: 1 }}>
              Payment method
            </Typography>
            <PaymentMethodTypePicker methods={methods} selectedId={selectedId} onSelect={onSelect} />

            <Divider sx={{ mb: 2.5, borderColor: theme.palette.borderSubtle1 }} />

            <PaymentMethodFormFields
              methodId={selectedId}
              values={formValues}
              errors={formErrors}
              onChange={onFieldChange}
            />
          </>
        ) : null}
      </Box>

      {/* Sticky on a phone: the form can be taller than the screen, and the one
          control that commits the charge should never be something you have to
          go looking for. */}
      <Box
        sx={{
          mt: 3,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          flexShrink: 0,
          position: { xs: 'sticky', md: 'static' },
          bottom: 0,
          zIndex: 2,
          backgroundColor: theme.palette.surfaceWhite,
          pt: { xs: 1.5, md: 0 },
          pb: { xs: 0.5, md: 0 },
        }}
      >
        {formFooter}
        {/* Was "Your payment is safe and secure" at 10px in the lowest-contrast
            grey in the flow — an unsupported claim nobody could read. Now it
            says the specific thing that is true, at a size that can be read. */}
        <Typography
          sx={{
            fontSize: 12,
            lineHeight: '16px',
            color: theme.palette.textSecondary2,
            textAlign: 'center',
          }}
        >
          Your details are encrypted in transit and never stored on our servers.
        </Typography>
      </Box>
    </>
  );
}
