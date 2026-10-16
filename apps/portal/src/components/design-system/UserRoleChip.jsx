import { primitive, semantic } from '@signal/design-tokens/colors';
import { Chip } from '@signal/ui';

const ROLE_CHIP_SX = {
  height: 'auto',
  minHeight: 26,
  pl: '10px !important',
  pr: '10px !important',
  py: '4px !important',
  gap: 0,
  '& .MuiChip-label': {
    pl: '0 !important',
    pr: '0 !important',
    py: 0,
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '18px',
  },
};

const ROLE_STYLES = {
  admin: {
    backgroundColor: `${primitive.green[100]} !important`,
    color: `${primitive.green[700]} !important`,
    '& .MuiChip-label': { color: `${primitive.green[700]} !important` },
  },
  billing: {
    backgroundColor: `${semantic.surface.warningSubtle} !important`,
    color: `${primitive.orange[800]} !important`,
    '& .MuiChip-label': { color: `${primitive.orange[800]} !important` },
  },
  viewer: {
    backgroundColor: `${primitive.blue[50]} !important`,
    color: `${primitive.blue[700]} !important`,
    '& .MuiChip-label': { color: `${primitive.blue[700]} !important` },
  },
};

export function UserRoleChip({ roleId, label }) {
  const sx = {
    ...ROLE_CHIP_SX,
    ...(ROLE_STYLES[roleId] ?? ROLE_STYLES.viewer),
  };

  return <Chip label={label} size="small" sx={sx} />;
}
