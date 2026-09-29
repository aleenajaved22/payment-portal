import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatInvoiceTotal, sumInvoiceAmounts } from '../data/mockInvoices';
import { Button, Dialog } from './design-system';
import { NEW_METHOD_VALUE } from './CheckoutSavedMethods';
import { PayInvoicesFormPanel } from './PayInvoicesFormPanel';
import { PAYMENT_METHODS } from './payment-method-logos';
import { PaymentMethodModalSkeleton } from './PaymentMethodModalSkeleton';
import {
  PaymentMethodModalDeclined,
  PaymentMethodModalProcessing,
  PaymentMethodModalSuccess,
} from './PaymentMethodModalPayStates';

import {
  EMPTY_PAYMENT_METHOD_FORMS,
  buildDetailsFromForm,
  getPaymentMethodShortLabel,
} from '../data/paymentMethodCategories';
import { GENERIC_DECLINE, authorizePayment, validatePaymentForm } from '../data/paymentValidation';

/**
 * Checkout.
 *
 * Four states, one dialog: `form` → `processing` → `success` | `declined`.
 *
 * `form` is gated. Pay Now used to fire on any click, which meant an entirely
 * empty form authorised a five-figure charge and then wrote a card with no
 * number into the account's saved methods. Now the form is validated first, the
 * offending fields are marked, and focus moves to the first of them.
 *
 * `declined` exists because "it worked" was previously the only outcome the
 * customer could ever see. It is reachable on purpose with the standard test
 * card numbers, and it offers both ways out rather than dumping the customer
 * back into a form they have to re-read to find what changed.
 *
 * Success no longer auto-dismisses. A charge clearing is the one moment in this
 * flow worth reading, and a dialog that closes itself mid-sentence takes the
 * confirmation away before it has been taken in.
 */

const PROCESSING_MS = 1600;

export function PaymentMethodModal({
  open,
  onClose,
  invoices = [],
  defaultTypeId,
  savedMethods = [],
  defaultMethodId,
  onPayNow,
  onPaymentComplete,
}) {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(PAYMENT_METHODS[0].id);
  const [formValues, setFormValues] = useState(EMPTY_PAYMENT_METHOD_FORMS[PAYMENT_METHODS[0].id]);
  const [formErrors, setFormErrors] = useState({});
  /** A saved method's id, or NEW_METHOD_VALUE when paying with the form below. */
  const [savedSelection, setSavedSelection] = useState(NEW_METHOD_VALUE);
  const [phase, setPhase] = useState('form');
  const [failure, setFailure] = useState(null);
  const processingTimerRef = useRef(null);
  const panelRef = useRef(null);
  /**
   * The account's current defaults, read only when the dialog opens.
   *
   * They must not be effect dependencies. A successful payment makes whatever
   * was just used the new default, so depending on them would re-run the reset
   * below one render after authorisation and replace the success screen with an
   * empty form — the customer would see their confirmation flash and vanish.
   */
  const accountDefaultsRef = useRef({ defaultTypeId, defaultMethodId, savedMethods });
  accountDefaultsRef.current = { defaultTypeId, defaultMethodId, savedMethods };

  useEffect(() => {
    const { defaultTypeId: typeDefault, defaultMethodId: methodDefault, savedMethods: saved } =
      accountDefaultsRef.current;

    if (open) {
      const typeId = typeDefault ?? PAYMENT_METHODS[0].id;
      setSelectedId(typeId);
      setFormValues({ ...EMPTY_PAYMENT_METHOD_FORMS[typeId] });
      setFormErrors({});
      // Open on the account's default method when there is one — that is the
      // card the dashboard has been showing as active, so it is the one the
      // customer expects to be charged.
      setSavedSelection(
        saved.some((method) => method.id === methodDefault)
          ? methodDefault
          : saved[0]?.id ?? NEW_METHOD_VALUE,
      );
    }
    setPhase('form');
    setFailure(null);
  }, [open]);

  useEffect(() => () => window.clearTimeout(processingTimerRef.current), []);

  const subtotal = useMemo(() => sumInvoiceAmounts(invoices), [invoices]);
  const amountLabel = useMemo(() => formatInvoiceTotal(subtotal), [subtotal]);

  /* Announced once, as a count. The per-field messages are read by
     aria-describedby when focus reaches the field they belong to. */
  const formErrorCount = Object.keys(formErrors).length;
  const errorSummary = formErrorCount
    ? `${formErrorCount} ${formErrorCount === 1 ? 'field needs' : 'fields need'} attention.`
    : null;

  const isProcessing = phase === 'processing';
  const isSuccess = phase === 'success';
  const isDeclined = phase === 'declined';
  const showForm = phase === 'form';

  const payingWithSaved = savedMethods.length > 0 && savedSelection !== NEW_METHOD_VALUE;
  const activeSavedMethod = payingWithSaved
    ? savedMethods.find((method) => method.id === savedSelection) ?? null
    : null;

  /** What the confirmation calls the thing that was charged. */
  const methodLabel = activeSavedMethod
    ? getPaymentMethodShortLabel(activeSavedMethod)
    : getPaymentMethodShortLabel({ typeId: selectedId, details: buildDetailsFromForm(selectedId, formValues) });

  const finishAndClose = () => {
    onPaymentComplete?.();
    onClose();
  };

  /** Processing is the one phase that owns the dialog; everything else can leave. */
  const handleClose = () => {
    if (isProcessing) return;
    if (isSuccess) {
      finishAndClose();
      return;
    }
    onClose();
  };

  const handleSelect = (methodId) => {
    if (!showForm) return;
    setSelectedId(methodId);
    setFormValues({ ...EMPTY_PAYMENT_METHOD_FORMS[methodId] });
    setFormErrors({});
  };

  /** Clearing a field's error as it is edited: re-validating on every keystroke
   *  would shout "invalid" at a card number halfway through being typed. */
  const handleFieldChange = (field, value) => {
    if (!showForm) return;
    setFormValues((previous) => ({ ...previous, [field]: value }));
    const errorKey = field === 'expiryMonth' || field === 'expiryYear' ? 'expiry' : field;
    setFormErrors((previous) => {
      if (!previous[errorKey]) return previous;
      const { [errorKey]: _cleared, ...rest } = previous;
      return rest;
    });
  };

  const handleSavedSelectionChange = (value) => {
    if (!showForm) return;
    setSavedSelection(value);
    setFormErrors({});
  };

  /**
   * Sends focus to the first field that failed, so a long form doesn't have to
   * be scanned for the red one.
   *
   * Found by DOM order rather than by a hand-kept list of field names: the
   * first `.Mui-error` input on the page is the topmost one by definition, and
   * that stays true when a form gains or loses a field.
   */
  const focusFirstError = () => {
    const node = panelRef.current?.querySelector('.Mui-error input, .Mui-error textarea');
    node?.focus();
    node?.scrollIntoView({ block: 'nearest' });
  };

  const runPayment = () => {
    setPhase('processing');
    setFailure(null);

    processingTimerRef.current = window.setTimeout(() => {
      const result = authorizePayment({
        typeId: selectedId,
        form: formValues,
        existingMethodId: activeSavedMethod?.id,
      });

      if (!result.approved) {
        setFailure(result.failure ?? GENERIC_DECLINE);
        setPhase('declined');
        return;
      }

      onPayNow?.(
        activeSavedMethod
          ? { existingMethodId: activeSavedMethod.id }
          : { typeId: selectedId, details: buildDetailsFromForm(selectedId, formValues) },
      );
      setPhase('success');
    }, PROCESSING_MS);
  };

  const handlePayNow = () => {
    if (invoices.length === 0 || !showForm) return;

    // A saved method has already been validated once, when it was added.
    if (!activeSavedMethod) {
      const errors = validatePaymentForm(selectedId, formValues);
      const errorCount = Object.keys(errors).length;
      if (errorCount > 0) {
        setFormErrors(errors);
        // After paint, so the fields have actually been marked before we look
        // for the first marked one.
        window.requestAnimationFrame(focusFirstError);
        return;
      }
    }

    runPayment();
  };

  const receiptBackground = theme.palette.surfaceSuccessSubtle;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      /* MUI generates an aria-labelledby, but nothing claimed the id because the
         dialog has no DialogTitle — so it announced as an unnamed "dialog". */
      aria-labelledby="checkout-title"
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          m: 2,
          width: '100%',
          maxWidth: 1080,
          /* Bounded, or nothing inside can scroll: an unbounded flex column just
             grows past the Paper, and `overflow: hidden` then swallows whatever
             did not fit. That put the receipt total 650px below the clip line on
             a phone with no way to reach it. */
          maxHeight: { xs: 'calc(100dvh - 32px)', md: 'min(92vh, 780px)' },
          overflow: 'hidden',
          display: 'flex',
        },
      }}
    >
      {/* One scroll on a phone — the dialog is a single column and scrolls as a
          whole. From md the two columns scroll independently so the receipt can
          stay beside the form however many invoices it lists. */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          flex: 1,
          width: '100%',
          minHeight: { md: 520 },
          overflowY: { xs: 'auto', md: 'hidden' },
        }}
      >
        <Box
          ref={panelRef}
          sx={{
            /* From md this column shares the row and scrolls inside itself, so
               minHeight:0 is what lets it be shorter than its content. On a
               phone the Stack is the scroller and this must size to its content
               instead — flex:1 there squashed the whole form to nothing. */
            flex: { xs: '0 0 auto', md: 1 },
            minWidth: { md: 640 },
            minHeight: { md: 0 },
            px: 3,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          {showForm ? (
            <PayInvoicesFormPanel
              methods={PAYMENT_METHODS}
              selectedId={selectedId}
              onSelect={handleSelect}
              formValues={formValues}
              formErrors={formErrors}
              onFieldChange={handleFieldChange}
              savedMethods={savedMethods}
              savedSelection={savedSelection}
              onSavedSelectionChange={handleSavedSelectionChange}
              defaultMethodId={defaultMethodId}
              formFooter={
                <Button
                  variant="primary"
                  fullWidth
                  disabled={invoices.length === 0}
                  onClick={handlePayNow}
                  endIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    minHeight: 44,
                    py: 1.375,
                    fontSize: 15,
                    fontWeight: 600,
                    borderRadius: '8px',
                    '& .MuiButton-endIcon': { ml: 0.75 },
                  }}
                >
                  {/* The button carries the amount: the figure is on the receipt
                      beside it, but the commitment is made here. */}
                  {invoices.length === 0 ? 'Pay Now' : `Pay ${amountLabel}`}
                </Button>
              }
            />
          ) : null}

          {/* One live region for the whole flow. Screen readers announce changes
              to a region that is already mounted, so it stays in the tree across
              every phase and only its text changes. */}
          <Box
            role="status"
            aria-live="polite"
            sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
          >
            {showForm && errorSummary ? errorSummary : null}
            {isProcessing ? 'Processing payment. Please wait.' : null}
            {isSuccess ? `Payment successful. ${amountLabel} paid.` : null}
            {isDeclined ? `${failure?.title ?? 'Payment failed'}. You have not been charged.` : null}
          </Box>

          {isProcessing ? (
            <Box aria-busy="true" sx={{ position: 'absolute', inset: 0, px: 3, py: 2.5, backgroundColor: theme.palette.surfaceWhite, zIndex: 1 }}>
              <PaymentMethodModalSkeleton />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <PaymentMethodModalProcessing />
              </Box>
            </Box>
          ) : null}

          {isSuccess ? (
            <PaymentMethodModalSuccess
              amountLabel={amountLabel}
              invoiceCount={invoices.length}
              methodLabel={methodLabel}
              /* A method entered at checkout is saved and becomes the default.
                 That is a reasonable default, but not one to make silently — the
                 dashboard's Active Payment Method is about to change. */
              savedAsDefault={!activeSavedMethod}
              onDone={finishAndClose}
            />
          ) : null}

          {isDeclined ? (
            <PaymentMethodModalDeclined
              failure={failure}
              onRetry={runPayment}
              onChooseAnother={() => {
                setPhase('form');
                setFailure(null);
                // Straight to the form: the saved method that just failed is not
                // the answer, so landing back on it would be a dead end.
                setSavedSelection(NEW_METHOD_VALUE);
                setFormValues({ ...EMPTY_PAYMENT_METHOD_FORMS[selectedId] });
              }}
            />
          ) : null}
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: 360 },
            flexShrink: 0,
            minHeight: { md: 0 },
            /* First on a phone: what you owe, then how you'll pay it, with the
               Pay button pinned to the bottom of the form below. Reversing this
               would put the amount after the button that commits to it. */
            order: { xs: -1, md: 0 },
            backgroundColor: receiptBackground,
            px: 3,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ReceiptLongOutlinedIcon sx={{ fontSize: 20, color: theme.palette.textSecondary2 }} />
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: theme.palette.textSecondary2 }}>Receipt</Typography>
            </Stack>
            <IconButton
              onClick={handleClose}
              disabled={isProcessing}
              aria-label="Close"
              size="small"
              sx={{ color: theme.palette.textSecondary2, mr: -0.5 }}
            >
              <CloseIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Stack>

          {/* The list scrolls; the total does not. Ten invoices should never be
              able to push the figure being authorised out of view. */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: { xs: 'visible', md: 'auto' },
            }}
          >
            {invoices.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3, textAlign: 'center', py: 4 }}>
                Select one or more invoices to see your payment summary.
              </Typography>
            ) : (
              <Stack spacing={1.75}>
                  {invoices.map((invoice) => (
                    <Stack key={invoice.id} direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textPrimary }}>
                          {invoice.invoiceNumber}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary2 }} noWrap>
                          {invoice.site}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textPrimary, flexShrink: 0 }}>
                        {invoice.amount}
                      </Typography>
                    </Stack>
                  ))}
              </Stack>
            )}
          </Box>

          {invoices.length > 0 ? (
                <Box
                  sx={{
                    flexShrink: 0,
                    mt: 2,
                    borderTop: `1px dashed ${theme.palette.borderSubtle2}`,
                    pt: 2,
                    position: 'relative',
                    /* Perforation notches. Inset rather than hung outside the
                       column: at -6 the left one was drawn over the white form
                       panel and the right one was clipped by the Paper. */
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      top: -6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.surfaceWhite,
                    },
                    '&::before': { left: -30 },
                    '&::after': { right: -30 },
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary2 }}>Subtotal</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: theme.palette.textPrimary, lineHeight: 1.2 }}>
                      {formatInvoiceTotal(subtotal)}
                    </Typography>
                  </Stack>

                  {/* Once it has cleared, the receipt says so — the panel is the
                      only part of the dialog that survives into the success
                      state, so the status belongs on it. */}
                  {isSuccess ? (
                    <Typography sx={{ mt: 1, fontSize: 12, fontWeight: 700, color: theme.palette.textBrandOnSubtle }}>
                      Paid · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  ) : null}
                </Box>
          ) : null}
        </Box>
      </Stack>
    </Dialog>
  );
}
