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
import { USER_ROLES } from '../data/mockUsers';

const DRAWER_WIDTH = 'min(580px, 96vw)';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

/**
 * Right-hand "Invite User" panel from CBX — invite flow for the customer portal demo.
 */
export function InviteUserDrawer({ open, onClose, onInvite, emailInUse }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [franchises, setFranchises] = useState([]);
  const [sites, setSites] = useState([]);
  const [roleLabel, setRoleLabel] = useState('');
  const [error, setError] = useState(null);

  const siteOptions = useMemo(() => getSitesForFranchises(franchises), [franchises]);

  useEffect(() => {
    if (!open) return;
    setName('');
    setEmail('');
    setFranchises([]);
    setSites([]);
    setRoleLabel('');
    setError(null);
  }, [open]);

  useEffect(() => {
    setSites((previous) => previous.filter((site) => siteOptions.includes(site)));
  }, [siteOptions]);

  const submit = () => {
    const trimmedEmail = email.trim();
    if (!name.trim()) return setError('Name is required');
    if (!roleLabel) return setError('Role is required');
    if (!trimmedEmail) return setError('Email address is required');
    if (!EMAIL_PATTERN.test(trimmedEmail)) return setError('Enter a valid email address');
    if (emailInUse?.(trimmedEmail)) return setError('Someone with this email is already on the account');

    const displayName = name.trim();
    onInvite(trimmedEmail, roleLabel, displayName, { franchises, sites });
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
          boxShadow: theme.shadows?.[16] ?? '0 8px 32px rgba(0,0,0, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          px: 3,
          py: 3,
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1.125}
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: '30px',
                color: theme.palette.textPrimary,
              }}
            >
              Invite User
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                lineHeight: '20px',
                color: theme.palette.textPlaceholder,
              }}
            >
              Please fill the form to invite a new user.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close invite user panel"
            size="small"
            sx={{
              flexShrink: 0,
              ml: 1,
              mr: -1,
              color: theme.palette.textSecondary2,
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Stack>

        <Divider sx={{ mt: 2, mb: 2, borderColor: theme.palette.borderSubtle1 }} />

        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FieldLabel htmlFor="invite-name">Name</FieldLabel>
                <TextField
                  id="invite-name"
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
                <FieldLabel htmlFor="invite-role">Role</FieldLabel>
                <Select
                  id="invite-role"
                  fullWidth
                  displayEmpty
                  IconComponent={SelectChevronIcon}
                  MenuProps={drawerSelectMenuProps(theme)}
                  value={roleLabel}
                  onChange={(event) => {
                    setRoleLabel(event.target.value);
                    if (error) setError(null);
                  }}
                  renderValue={(selected) =>
                    selected || (
                      <Typography component="span" sx={{ color: theme.palette.textPlaceholderField }}>
                        Select role
                      </Typography>
                    )
                  }
                  sx={drawerSelectFieldSx(theme, fieldInputSx)}
                >
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role.id} value={role.label}>
                      <ListItemText
                        primary={role.label}
                        secondary={role.summary}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: theme.palette.textPrimary,
                        }}
                        secondaryTypographyProps={{
                          fontSize: 12,
                          lineHeight: '18px',
                          color: theme.palette.textSecondary3,
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>

            <Box>
              <FieldLabel htmlFor="invite-email">Email</FieldLabel>
              <TextField
                id="invite-email"
                fullWidth
                type="email"
                placeholder="Type email address"
                error={Boolean(error)}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                sx={fieldInputSx(theme)}
              />
              {error ? (
                <Typography role="alert" sx={{ mt: 0.75, fontSize: 12, color: theme.palette.textAlert }}>
                  {error}
                </Typography>
              ) : null}
            </Box>

            <Divider sx={{ borderColor: theme.palette.borderSubtle1 }} />

            <Stack spacing={3}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: theme.palette.textPrimary }}>
                  Associated Franchise and Site
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 12, lineHeight: '20px', color: theme.palette.textPlaceholder }}>
                  Select the associated franchise and sites of the above email address
                </Typography>
              </Box>

              <Stack spacing={2}>
                <MultiSelectWithChips
                  id="invite-franchises"
                  label="Franchise"
                  placeholder="Select Franchise"
                  options={FRANCHISE_OPTIONS}
                  value={franchises}
                  onChange={setFranchises}
                />

                <MultiSelectWithChips
                  id="invite-sites"
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
                '&:hover': {
                  backgroundColor: primitive.blue[700],
                  borderColor: primitive.blue[700],
                },
              }}
            >
              Invite User
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
