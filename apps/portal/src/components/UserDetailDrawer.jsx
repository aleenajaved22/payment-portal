import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Drawer, UserRoleChip } from './design-system';
import { formatUserAddedAt, getRole } from '../data/mockUsers';
import { getUserAssociations } from '../data/userAssociationsMock';

const DRAWER_WIDTH = 'min(580px, 96vw)';

function AssociationBadge({ label }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: '2px',
        borderRadius: '16px',
        backgroundColor: theme.palette.surfaceGreySubtle,
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: theme.palette.textPlaceholder }}>
        {label}
      </Typography>
    </Box>
  );
}

function AssociationSection({ title, items }) {
  const theme = useTheme();
  return (
    <Stack spacing={0.75} sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: theme.palette.textPrimary }}>{title}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {items.map((item) => (
          <AssociationBadge key={item} label={item} />
        ))}
      </Box>
    </Stack>
  );
}

/** Read-only user profile panel — CBX "view users" drawer. */
export function UserDetailDrawer({ open, user, onClose }) {
  const theme = useTheme();
  const associations = user ? getUserAssociations(user) : { franchises: [], sites: [] };
  const role = user ? getRole(user.roleId) : null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ BackdropProps: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } } }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: DRAWER_WIDTH },
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme.shadows?.[16] ?? '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, px: 3, py: 3 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{
            pb: 1.5,
            borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
          }}
        >
          <Box sx={{ minWidth: 0, pr: 2 }}>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: '30px',
                color: theme.palette.textPrimary,
              }}
              noWrap
            >
              {user?.name ?? ''}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: theme.palette.textSecondary1 }}>
                {user?.email}
              </Typography>
              <Typography component="span" sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>
                •
              </Typography>
              <Typography sx={{ fontSize: 12, lineHeight: '18px', color: theme.palette.textSecondary3 }}>
                <Box component="span" sx={{ color: theme.palette.textSecondary3, fontWeight: 400 }}>
                  Added at:{' '}
                </Box>
                <Box component="span" sx={{ color: theme.palette.textSecondary1, fontWeight: 500 }}>
                  {user ? formatUserAddedAt(user) : '—'}
                </Box>
              </Typography>
              {role ? (
                <>
                  <Typography component="span" sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>
                    •
                  </Typography>
                  <UserRoleChip roleId={user.roleId} label={role.label} />
                </>
              ) : null}
            </Stack>
          </Box>
          <IconButton onClick={onClose} aria-label="Close user details" size="small" sx={{ color: theme.palette.textSecondary2 }}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pt: 2 }}>
          <Stack spacing={3}>
            <AssociationSection title="Franchise" items={associations.franchises} />
            <AssociationSection title="Sites" items={associations.sites} />
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
