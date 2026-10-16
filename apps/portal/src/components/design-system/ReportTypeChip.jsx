import { primitive } from '@signal/design-tokens/colors';
import { Chip } from '@signal/ui';

const TYPE_COLOR = {
  Incident: 'error',
};

const VISIT_REPORT_CHIP_SX = {
  backgroundColor: `${primitive.blue[50]} !important`,
  color: `${primitive.blue[700]} !important`,
  '& .MuiChip-label': {
    color: `${primitive.blue[700]} !important`,
  },
};

export function ReportTypeChip({ type }) {
  if (type === 'Visit Report') {
    return <Chip label={type} size="small" sx={VISIT_REPORT_CHIP_SX} />;
  }

  return <Chip label={type} size="small" color={TYPE_COLOR[type] || 'info'} />;
}
