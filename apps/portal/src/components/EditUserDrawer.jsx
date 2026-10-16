import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { primitive } from '@signal/design-tokens/colors';
import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Select, TextField } from './design-system';
import { MultiSelectWithChips } from './MultiSelectWithChips';
import {
  SelectChevronIcon,
  drawerSelectFieldSx,
  drawerSelectMenuProps,
} from './selectChevronProps';
import { FRANCHISE_OPTIONS, getSitesForFranchises } from '../data/franchiseSiteCatalog';
import { getUserAssociations } from '../data/userAssociationsMock';
import { USER_ROLES, getRole, getRoleIdFromLabel } from '../data/mockUsers';

const DRAWER_WIDTH = 'min(580px, 96vw)';

const fieldInputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    minHeight: 44,
    '& .MuiOutlinedInput-input': {
      fontSize: 16,
      lineHeight: '24px',
      py: '10px',
      px: '14px',
      '&::placeholder': {
        color: theme.palette.textPlaceholderField,
        opacity: 1,
      },
    },
  },
});

const readOnlyEmailSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    minHeight: 44,
    backgroundColor: theme.palette.surfaceGreySubtle,
  },
  '& .MuiOutlinedInput-input': {
    fontSize: 16,
    lineHeight: '24px',
    py: '10px',
    px: '14px',
    color: theme.palette.textSecondary2,
    WebkitTextFillColor: theme.palette.textSecondary2,
  },
});

function FieldLabel({ children, htmlFor }) {
  const theme = useTheme();
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: 'block',
        mb: 0.75,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        color: theme.palette.textSecondary3,
      }}
    >
      {children}
    </Typography>
  );
}

/** CBX Edit User — same fields as invite, email read-only. */
export function EditUserDrawer({ open, user, onClose, onUpdate }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [roleLabel, setRoleLabel] = useState('');
  const [franchises, setFranchises] = useState([]);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);

  const siteOptions = useMemo(() => getSitesForFranchises(franchises), [franchises]);

  useEffect(() => {
    if (!open || !user) return;
    const associations = getUserAssociations(user);
    setName(user.name ?? '');
    setRoleLabel(getRole(user.roleId).label);
    setFranchises(associations.franchises ?? []);
    setSites(associations.sites ?? []);
    setError(null);
  }, [open, user]);

  useEffect(() => {
    setSites((previous) => previous.filter((site) => siteOptions.includes(site)));
  }, [siteOptions]);

  const submit = () => {
    if (!user) return undefined;
    if (!name.trim()) return setError('Name is required');
    if (!roleLabel) return setError('Role is required');

    onUpdate(user.id, {
      name: name.trim(),
      roleId: getRoleIdFromLabel(roleLabel),
      franchises,
      sites,
    });
    onClose();
    return undefined;
  };

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
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.125} sx={{ width: '100%' }}>
          <Typography sx={{ flex: 1, fontSize: 22, fontWeight: 700, lineHeight: '30px', color: theme.palette.textPrimary, pr: 2 }}>
            Edit User
          </Typography>
          <IconButton onClick={onClose} aria-label="Close edit user panel" size="small" sx={{ flexShrink: 0, mr: -1, color: theme.palette.textSecondary2 }}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Stack>

        <Divider sx={{ mt: 2, mb: 2, borderColor: theme.palette.borderSubtle1 }} />

        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FieldLabel htmlFor="edit-user-name">Name</FieldLabel>
                <TextField
                  id="edit-user-name"
                  fullWidth
                  placeholder="Type name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError(null);
                  }}
                  sx={fieldInputSx(theme)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FieldLabel htmlFor="edit-user-role">Role</FieldLabel>
                <Select
                  id="edit-user-role"
                  fullWidth
                  IconComponent={SelectChevronIcon}
                  MenuProps={drawerSelectMenuProps(theme)}
                  value={roleLabel}
                  onChange={(event) => {
                    setRoleLabel(event.target.value);
                    if (error) setError(null);
                  }}
                  sx={drawerSelectFieldSx(theme, fieldInputSx)}
                >
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role.id} value={role.label}>
                      <ListItemText
                        primary={role.label}
                        secondary={role.summary}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }}
                        secondaryTypographyProps={{ fontSize: 12, lineHeight: '18px', color: theme.palette.textSecondary3 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>

            <Box>
              <FieldLabel htmlFor="edit-user-email">Email</FieldLabel>
              <TextField
                id="edit-user-email"
                fullWidth
                value={user?.email ?? ''}
                disabled
                sx={readOnlyEmailSx(theme)}
              />
              {error ? (
                <Typography role="alert" sx={{ mt: 0.75, fontSize: 12, color: theme.palette.textAlert }}>
                  {error}
                </Typography>
              ) : null}
            </Box>

            <Divider sx={{ borderColor: theme.palette.borderSubtle1 }} />

            <Stack spacing={3}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: theme.palette.textPrimary }}>
                Associated Franchise and Site
              </Typography>
              <Stack spacing={2}>
                <MultiSelectWithChips
                  id="edit-franchises"
                  label="Franchise"
                  placeholder="Select Franchise"
                  options={FRANCHISE_OPTIONS}
                  value={franchises}
                  onChange={setFranchises}
                />
                <MultiSelectWithChips
                  id="edit-sites"
                  label="Sites"
                  placeholder={franchises.length === 0 ? 'Select a franchise first' : 'Select Site'}
                  options={siteOptions}
                  value={sites}
                  onChange={setSites}
                  disabled={franchises.length === 0}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ flexShrink: 0, pt: 2 }}>
          <Divider sx={{ mb: 2, borderColor: theme.palette.borderSubtle1 }} />
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="secondaryGrey" onClick={onClose} sx={{ height: 36, px: 2 }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={submit}
              sx={{
                height: 36,
                px: 2,
                backgroundColor: primitive.blue[500],
                borderColor: primitive.blue[500],
                '&:hover': { backgroundColor: primitive.blue[700], borderColor: primitive.blue[700] },
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
