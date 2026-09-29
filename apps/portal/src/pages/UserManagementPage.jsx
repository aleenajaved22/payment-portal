import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { InviteUserDialog } from '../components/InviteUserDialog';
import { Button, PageHeader, Select } from '../components/design-system';
import { useAuth } from '../auth/AuthContext';
import { useTeam } from '../context/TeamContext';
import { USER_ROLES, formatRelativeDay, getRole, getRoleIdFromLabel } from '../data/mockUsers';

/**
 * Who can sign in, and what each of them is allowed to do.
 *
 * "User Management" sat in the account menu doing nothing but closing the menu.
 * This is the page it was pointing at.
 *
 * Built from the same listing primitives as Card Management — a hairline between
 * rows, no surrounding container, the destructive action a ghost that appears on
 * hover — because both pages answer the same kind of question ("what is attached
 * to this account, and can I change it"). Role is an inline control rather than
 * a trip to an edit screen: it is the one field anyone actually changes, and
 * making it a two-step flow would be the only reason to leave this page.
 */

/** Initials, for the seeded users who have no avatar image. */
function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** Invited-but-not-yet-joined is a real state and reads as one. */
function PendingPill() {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        flexShrink: 0,
        px: '8px',
        py: '1px',
        borderRadius: '999px',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: theme.palette.textSecondary2,
        backgroundColor: theme.palette.surfaceGreySubtle,
      }}
    >
      Invited
    </Box>
  );
}

function YouPill() {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        flexShrink: 0,
        px: '8px',
        py: '1px',
        borderRadius: '999px',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: theme.palette.textBrand,
        backgroundColor: theme.palette.surfaceBrandSubtle,
      }}
    >
      You
    </Box>
  );
}

function UserRow({ user, isSelf, isLastAdmin, onChangeRole, onRemove, isFirst }) {
  const theme = useTheme();
  const role = getRole(user.roleId);
  const isInvited = user.status === 'invited';

  /**
   * Two rows are frozen, and the controls say which and why rather than just
   * refusing:
   *
   *  - the last Admin, because demoting or removing them leaves nobody able to
   *    manage people or payment methods again;
   *  - yourself, because self-demotion is the most common way an account locks
   *    its own owner out, and a second Admin can always do it for you.
   */
  const lockReason = isSelf
    ? "You can't change your own access. Another Admin can do it for you."
    : isLastAdmin
    ? 'This is the only Admin. Promote someone else first.'
    : null;

  const activity = isInvited
    ? `Invited ${formatRelativeDay(user.invitedAt)?.toLowerCase() ?? 'recently'}`
    : user.lastActiveAt
    ? `Active ${formatRelativeDay(user.lastActiveAt).toLowerCase()}`
    : 'Never signed in';

  return (
    /* One line on desktop. On a phone the role control alone is wider than what
       is left beside a name and an email, so the row wraps: identity first, its
       controls on a second line under it, rather than crushing the name to two
       letters to keep everything abreast. */
    <Box
      className="team-row"
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        alignItems: 'center',
        columnGap: { xs: 1.5, md: 2 },
        rowGap: 1.25,
        py: 1.5,
        borderTop: isFirst ? 'none' : `1px solid ${theme.palette.borderSubtle1}`,
        '&:hover .team-row-action': { opacity: 1 },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 600,
          color: theme.palette.textSecondary2,
          backgroundColor: theme.palette.surfaceGreySubtle,
          // An invitation that hasn't been accepted is not yet a person here.
          opacity: isInvited ? 0.6 : 1,
        }}
      >
        {initialsOf(user.name)}
      </Avatar>

      <Box sx={{ flex: { xs: '1 1 0', md: '1 1 auto' }, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: theme.palette.textPrimary }} noWrap>
            {user.name}
          </Typography>
          {isSelf ? <YouPill /> : null}
          {isInvited ? <PendingPill /> : null}
        </Stack>
        <Typography sx={{ fontSize: 13, lineHeight: '18px', color: theme.palette.textSecondary3 }} noWrap>
          {user.email}
        </Typography>
      </Box>

      {/* Full width beneath the name on a phone, a column of its own from md. */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1, md: 2 }}
        sx={{
          flexBasis: { xs: '100%', md: 'auto' },
          flexShrink: 0,
          justifyContent: { xs: 'space-between', md: 'flex-end' },
          pl: { xs: '52px', md: 0 },
        }}
      >
        {/* Repeated on the phone row as a plain line: the label-above-value pair
            needs vertical room the wrapped layout doesn't have. */}
        <Typography
          sx={{
            display: { xs: 'block', md: 'none' },
            fontSize: 13,
            color: theme.palette.textSecondary3,
          }}
          noWrap
        >
          {activity}
        </Typography>

        <Box sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' }, width: 140 }}>
          <Typography sx={{ fontSize: 12, lineHeight: '16px', color: theme.palette.textSecondary3 }}>
            Activity
          </Typography>
          <Typography sx={{ mt: '2px', fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }} noWrap>
            {activity}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
      <Tooltip title={lockReason ?? ''} placement="top" disableHoverListener={!lockReason}>
        <Box sx={{ flexShrink: 0, width: { xs: 132, sm: 150 } }}>
          <Select
            fullWidth
            size="small"
            value={role.label}
            disabled={Boolean(lockReason)}
            onChange={(event) => onChangeRole(user.id, getRoleIdFromLabel(event.target.value))}
            inputProps={{ 'aria-label': `Role for ${user.name}` }}
            /* Without this the closed control renders the whole option — label
               and its description — and spills out of the row. The summary is
               there to help you choose, not to be read back afterwards. */
            renderValue={(selected) => selected}
            sx={{
              borderRadius: '8px',
              // The theme sets minWidth: 220 on inputs, which is wider than a
              // phone leaves for this control — without clearing it the row
              // overflows the viewport however narrow the wrapper is.
              minWidth: 0,
              '& .MuiSelect-select': { fontSize: 14, fontWeight: 500, py: 0.75, minWidth: '0 !important' },
            }}
          >
            {USER_ROLES.map((entry) => (
              <MenuItem key={entry.id} value={entry.label} sx={{ py: 1, display: 'block' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }}>
                  {entry.label}
                </Typography>
                <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>
                  {entry.summary}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Tooltip>

      <Box sx={{ flexShrink: 0, width: 30 }}>
        {lockReason ? null : (
          <IconButton
            className="team-row-action"
            size="small"
            aria-label={`Remove ${user.name}`}
            onClick={() => onRemove(user)}
            sx={{
              width: 30,
              height: 30,
              color: theme.palette.textSecondary3,
              opacity: 0,
              transition: 'opacity 0.15s ease, color 0.15s ease',
              '&:hover': { backgroundColor: 'transparent', color: theme.palette.textAlert },
              '&:focus-visible': { opacity: 1 },
              '@media (hover: none)': { opacity: 1 },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export function UserManagementPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { users, inviteUser, changeUserRole, removeUser, isLastAdmin, emailInUse } = useTeam();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userPendingRemoval, setUserPendingRemoval] = useState(null);

  const activeCount = users.filter((user) => user.status !== 'invited').length;
  const invitedCount = users.length - activeCount;


  return (
    <PortalShell activeNav="dashboard">
      <Stack spacing={2.5} sx={{ width: '100%' }}>
        <PageHeader
          onBack={() => navigate('/dashboard')}
          backLabel="Back to dashboard"
          title="User Management"
          description={
            invitedCount > 0
              ? `${activeCount} ${activeCount === 1 ? 'person has' : 'people have'} access, ${invitedCount} invited.`
              : `${activeCount} ${activeCount === 1 ? 'person has' : 'people have'} access to this account.`
          }
          actions={
            <Button
              variant="primary"
              onClick={() => setInviteOpen(true)}
              startIcon={<PersonAddAltOutlinedIcon sx={{ fontSize: 18 }} />}
            >
              Invite someone
            </Button>
          }
        />

        <Box>
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.email.toLowerCase() === session?.email?.toLowerCase()}
              isLastAdmin={isLastAdmin(user.id)}
              onChangeRole={changeUserRole}
              onRemove={setUserPendingRemoval}
              isFirst={index === 0}
            />
          ))}
        </Box>

        <Typography sx={{ fontSize: 12, lineHeight: '18px', color: theme.palette.textSecondary3 }}>
          Admins can manage people and payment methods. Billing can pay invoices and manage payment
          methods. Viewers can read invoices and reports but cannot pay.
        </Typography>
      </Stack>

      <InviteUserDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={inviteUser}
        emailInUse={emailInUse}
      />

      <ConfirmDialog
        open={Boolean(userPendingRemoval)}
        title={
          userPendingRemoval?.status === 'invited'
            ? 'Cancel this invitation?'
            : `Remove ${userPendingRemoval?.name}?`
        }
        description={
          userPendingRemoval?.status === 'invited'
            ? `${userPendingRemoval?.email} will no longer be able to join with this invite.`
            : `${userPendingRemoval?.email} will lose access to invoices, reports and payment methods immediately.`
        }
        confirmLabel={userPendingRemoval?.status === 'invited' ? 'Cancel invite' : 'Remove access'}
        cancelLabel="Keep"
        onClose={() => setUserPendingRemoval(null)}
        onConfirm={() => {
          removeUser(userPendingRemoval.id);
          setUserPendingRemoval(null);
        }}
      />
    </PortalShell>
  );
}
