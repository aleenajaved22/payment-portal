import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { primitive } from '@signal/design-tokens/colors';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getPaymentMethodRowDisplay, getPaymentMethodType } from '../data/paymentMethodCategories';
import { PAYMENT_METHOD_LOGO_SIZE, PAYMENT_METHOD_TYPES, PaymentMethodLogoIcon } from './payment-method-logos';
import { PaymentBrandMark, getPaymentBrandMark } from './payment-brand-marks';

const METHOD_MARK_TILE = 40;
const IDENTITY_COL_WIDTH = 220;
const FIELD_COL_WIDTH = 140;
const ROW_ACTION_WIDTH = 30;

/** Brand mark when we have an official one, otherwise the generic type glyph — same tile either way. */
function MethodMarkSlot({ method, Logo, listLogoSize }) {
  const theme = useTheme();
  const brandId = method.typeId === 'credit-card' ? method.details?.brand : method.typeId;
  const hasBrandMark = Boolean(getPaymentBrandMark(brandId));

  return (
    <Box
      sx={{
        width: METHOD_MARK_TILE,
        height: METHOD_MARK_TILE,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        backgroundColor: primitive.grey[50],
        lineHeight: 0,
      }}
    >
      {hasBrandMark ? (
        <PaymentBrandMark brandId={brandId} fit="tile" />
      ) : Logo ? (
        <Box sx={{ color: theme.palette.textSecondary2, display: 'flex' }}>
          <PaymentMethodLogoIcon Logo={Logo} size={listLogoSize ?? PAYMENT_METHOD_LOGO_SIZE} />
        </Box>
      ) : null}
    </Box>
  );
}

/** Ghost action — invisible until the row is hovered, always visible on keyboard focus. */
function RowAction({ label, icon, onClick }) {
  const theme = useTheme();

  return (
    <IconButton
      size="small"
      aria-label={label}
      onClick={onClick}
      sx={{
        width: 30,
        height: 30,
        border: 'none',
        backgroundColor: 'transparent',
        color: theme.palette.textSecondary3,
        opacity: 0,
        transition: 'opacity 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: 'transparent', color: theme.palette.textPrimary },
        '&:focus-visible': { opacity: 1 },
        '.payment-method-row:hover &': { opacity: 1 },
        // Touch devices get no hover, so keep the actions visible there.
        '@media (hover: none)': { opacity: 1 },
      }}
    >
      {icon}
    </IconButton>
  );
}

function FieldColumn({ field, sx }) {
  const theme = useTheme();

  if (!field) {
    return <Box sx={{ width: FIELD_COL_WIDTH, flexShrink: 0, ...sx }} aria-hidden />;
  }

  return (
    <Box sx={{ width: FIELD_COL_WIDTH, flexShrink: 0, minWidth: 0, ...sx }}>
      <Typography sx={{ fontSize: 12, lineHeight: '16px', color: theme.palette.textSecondary3 }}>
        {field.label}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          color: theme.palette.textPrimary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {field.value}
      </Typography>
    </Box>
  );
}

export function PaymentMethodListRow({ method, onRemove, showActions = true, isFirst = false }) {
  const theme = useTheme();
  const type = getPaymentMethodType(method.typeId, PAYMENT_METHOD_TYPES);
  const display = getPaymentMethodRowDisplay(method);
  const [fieldOne, fieldTwo] = display.fields;

  return (
    <Box
      className="payment-method-row"
      sx={{
        width: '100%',
        display: 'grid',
        alignItems: 'center',
        columnGap: 2,
        rowGap: 0,
        py: 1.25,
        minHeight: 58,
        boxSizing: 'border-box',
        gridTemplateColumns: {
          xs: `${METHOD_MARK_TILE}px minmax(0, 1fr) ${ROW_ACTION_WIDTH}px`,
          md: `${METHOD_MARK_TILE}px ${IDENTITY_COL_WIDTH}px ${FIELD_COL_WIDTH}px ${FIELD_COL_WIDTH}px 1fr ${ROW_ACTION_WIDTH}px`,
        },
        // Listing style: a hairline between items, no surrounding container.
        borderTop: isFirst ? 'none' : `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      <MethodMarkSlot method={method} Logo={type?.Logo} listLogoSize={type?.listLogoSize} />

      <Box sx={{ width: { md: IDENTITY_COL_WIDTH }, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: '20px',
            color: theme.palette.textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {display.primary}
        </Typography>
        <Typography sx={{ fontSize: 12, lineHeight: '18px', color: theme.palette.textSecondary3 }}>
          {display.reference}
        </Typography>
      </Box>

      <FieldColumn field={fieldOne} sx={{ display: { xs: 'none', md: 'block' } }} />
      <FieldColumn field={fieldTwo} sx={{ display: { xs: 'none', md: 'block' } }} />

      <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }} />

      {showActions ? (
        <RowAction
          label={`Remove ${display.primary}`}
          icon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
          onClick={() => onRemove?.(method.id)}
        />
      ) : (
        <Box sx={{ width: ROW_ACTION_WIDTH }} />
      )}
    </Box>
  );
}
