import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Button, Dialog, Select, TextField } from './design-system';
import { USER_ROLES } from '../data/mockUsers';

/**
 * Invite someone to the account.
 *
 * The role picker carries each role's summary underneath the label rather than
 * in a help link, because "Billing" means nothing on its own and the person
 * choosing it is deciding who can spend money. Validated on submit, in the same
 * shape as checkout: the field is marked, the message names the problem, and
 * editing clears it.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function InviteUserDialog({ open, onClose, onInvite, emailInUse }) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [roleLabel, setRoleLabel] = useState(USER_ROLES[1].label);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setEmail('');
    setRoleLabel(USER_ROLES[1].label);
    setError(null);
  }, [open]);

  const submit = () => {
    const trimmed = email.trim();
    if (!trimmed) return setError('Email address is required');
    if (!EMAIL_PATTERN.test(trimmed)) return setError('Enter a valid email address');
    if (emailInUse?.(trimmed)) return setError('Someone with this email is already on the account');

    onInvite(trimmed, roleLabel);
    onClose();
    return undefined;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '16px', p: 3, width: '100%', maxWidth: 460 } }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: '26px', color: theme.palette.textPrimary }}>
        Invite someone
      </Typography>
      <Typography sx={{ mt: 0.5, mb: 2.5, fontSize: 14, color: theme.palette.textSecondary2 }}>
        They'll get an email with a link to join this account.
      </Typography>

      <Stack spacing={2.5}>
        <Box>
          <Typography
            component="label"
            htmlFor="invite-email"
            sx={{ display: 'block', mb: 0.5, fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }}
          >
            Email address
          </Typography>
          <TextField
            id="invite-email"
            fullWidth
            size="small"
            type="email"
            error={Boolean(error)}
            placeholder="name@company.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          {error ? (
            <Typography role="alert" sx={{ mt: 0.5, fontSize: 12, color: theme.palette.textAlert }}>
              {error}
            </Typography>
          ) : null}
        </Box>

        <Box>
          <Typography sx={{ mb: 0.5, fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }}>
            Role
          </Typography>
          <Select
            fullWidth
            size="small"
            value={roleLabel}
            onChange={(event) => setRoleLabel(event.target.value)}
            inputProps={{ 'aria-label': 'Role' }}
            renderValue={(selected) => selected}
            sx={{ borderRadius: '8px', minWidth: 0, '& .MuiSelect-select': { minWidth: '0 !important' } }}
          >
            {USER_ROLES.map((role) => (
              <MenuItem key={role.id} value={role.label} sx={{ py: 1, display: 'block' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }}>
                  {role.label}
                </Typography>
                <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>
                  {role.summary}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="secondaryGrey" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit}>
          Send invite
        </Button>
      </Stack>
    </Dialog>
  );
}
