import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { primitive } from '@signal/design-tokens/colors';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterSelect } from '../components/FilterSelect';
import { PortalShell } from '../components/PortalShell';
import { toolbarSearchFieldSx, toolbarSearchIconSx } from '../components/toolbarSearchFieldSx';
import { InactivateUserDialog } from '../components/InactivateUserDialog';
import { EditUserDrawer } from '../components/EditUserDrawer';
import { InviteUserDrawer } from '../components/InviteUserDrawer';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { Button, EmptyState, Search, SiteNameChip } from '../components/design-system';
import { useAuth } from '../auth/AuthContext';
import { useTeam } from '../context/TeamContext';
import {
  formatUserAddedAt,
  formatUserLastLogin,
  getUserAddedTime,
  getUserLastLoginTime,
} from '../data/mockUsers';
import { getUserSiteFilterOptions, userFranchiseFilterOptions } from '../data/franchiseSiteCatalog';
import { getUserAssociations } from '../data/userAssociationsMock';

const ROWS_PER_PAGE = 15;
const SEARCH_PLACEHOLDER = 'Search';
const CELL_PADDING_X = '24px';
/** Matches InvoicesTable: bodyCellPy 2 + 14px/1.43 line (~52px total). */
const BODY_ROW_HEIGHT = 52;
const AVATAR_SIZE = 28;
/** Ghost edit control at the row’s trailing edge (matches payment-method row actions). */
const ROW_EDIT_ACTION_WIDTH = 30;
/** 30px control + 24px right inset (aligns with table gutter). */
const ROW_EDIT_CELL_WIDTH = 62;
const NAME_COLUMN_WIDTH = 220;
const EMAIL_COLUMN_WIDTH = 280;
const USER_STATUS_COLUMN_WIDTH = 120;
/** Theme switch is 36×20; uniform scale keeps thumb centered on the track. */
const USER_STATUS_SWITCH_SCALE = 34 / 36;
const ADDED_AT_COLUMN_WIDTH = 165;
/** Fits `MM/DD/YY • HH:MM:SS` without bleeding into the sticky edit column. */
const LAST_LOGIN_COLUMN_WIDTH = 232;
const VISIBLE_ASSOCIATION_CHIPS = 2;
const STICKY_LEFT_SHADOW = '4px 0 10px -2px rgba(16, 24, 40, 0.1)';
const STICKY_RIGHT_SHADOW = '-4px 0 10px -2px rgba(16, 24, 40, 0.1)';
function stickyLeftEdgeSx(theme) {
  return {
    borderRight: `1px solid ${theme.palette.borderSubtle1}`,
    boxShadow: STICKY_LEFT_SHADOW,
  };
}

function stickyNameCellSx(theme, { header = false } = {}) {
  return {
    position: 'sticky',
    left: 0,
    zIndex: header ? 13 : 12,
    width: NAME_COLUMN_WIDTH,
    minWidth: NAME_COLUMN_WIDTH,
    maxWidth: NAME_COLUMN_WIDTH,
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundColor: theme.palette.surfaceWhite,
    ...stickyLeftEdgeSx(theme),
  };
}

function stickyEditCellSx(theme, { header = false } = {}) {
  return {
    position: 'sticky',
    right: 0,
    zIndex: header ? 12 : 11,
    width: ROW_EDIT_CELL_WIDTH,
    minWidth: ROW_EDIT_CELL_WIDTH,
    maxWidth: ROW_EDIT_CELL_WIDTH,
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundColor: theme.palette.surfaceWhite,
    borderLeft: `1px solid ${theme.palette.borderSubtle1}`,
    boxShadow: STICKY_RIGHT_SHADOW,
  };
}

function scrollBodyCellSx() {
  return {
    overflow: 'hidden',
    zIndex: 0,
  };
}

function associationBodyCellSx() {
  return {
    width: 'auto',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    overflow: 'hidden',
  };
}

function associationHeaderCellSx() {
  return {
    width: 'auto',
    whiteSpace: 'nowrap',
  };
}

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function sortUsers(rows, sortField, sortDirection) {
  const dir = sortDirection === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    let aVal;
    let bVal;
    switch (sortField) {
      case 'email':
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
        break;
      case 'addedAt':
        aVal = getUserAddedTime(a);
        bVal = getUserAddedTime(b);
        break;
      case 'lastLogin':
        aVal = getUserLastLoginTime(a);
        bVal = getUserLastLoginTime(b);
        break;
      case 'franchise':
        aVal = getUserAssociations(a).franchises.join(', ').toLowerCase();
        bVal = getUserAssociations(b).franchises.join(', ').toLowerCase();
        break;
      case 'sites':
        aVal = getUserAssociations(a).sites.join(', ').toLowerCase();
        bVal = getUserAssociations(b).sites.join(', ').toLowerCase();
        break;
      default:
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
    }
    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });
}

function AssociationChipsCell({ items }) {
  const theme = useTheme();

  if (!items.length) {
    return (
      <Typography variant="body2" sx={{ color: theme.palette.textSecondary2, fontSize: 14 }}>
        —
      </Typography>
    );
  }

  const hasOverflow = items.length > VISIBLE_ASSOCIATION_CHIPS;
  const visibleCount = hasOverflow ? VISIBLE_ASSOCIATION_CHIPS : items.length;
  const visible = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount);

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: '6px',
        verticalAlign: 'middle',
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {visible.map((item) => (
        <SiteNameChip key={item} label={item} />
      ))}
      {overflow.length > 0 ? (
        <Tooltip
          placement="top"
          describeChild
          title={overflow.join('\n')}
          slotProps={{
            tooltip: {
              sx: {
                whiteSpace: 'pre-line',
                maxWidth: 360,
              },
            },
          }}
        >
          <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
            <SiteNameChip label={`+${overflow.length} more`} />
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}

function UserManagementRow({ user, onOpenUser, onEditUser, onToggleAccess, lockReason }) {
  const theme = useTheme();
  const { session } = useAuth();
  const isCurrentUser =
    Boolean(session?.email) && user.email.toLowerCase() === session.email.toLowerCase();
  const isActive = user.status === 'active';
  const isInvited = user.status === 'invited';
  const associations = getUserAssociations(user);

  const primaryCellTextSx = {
    color: theme.palette.textPrimary,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1.43,
    m: 0,
  };

  const secondaryCellTextSx = {
    color: theme.palette.textSecondary2,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 1.43,
    m: 0,
  };

  const rowHoverBackground = alpha(theme.palette.textPrimary, 0.035);

  return (
    <TableRow
      onClick={() => onOpenUser(user)}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover td': { backgroundColor: rowHoverBackground },
        '&:hover td.user-sticky-name': { zIndex: 14 },
        '&:hover td.user-row-edit-cell': { zIndex: 14 },
        '&:hover .user-row-edit': { opacity: '1 !important' },
        '& td': {
          borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
          boxSizing: 'border-box',
          height: BODY_ROW_HEIGHT,
          py: 0,
          px: CELL_PADDING_X,
          verticalAlign: 'middle',
        },
        '& td.user-row-edit-cell': {
          px: 0,
          pr: CELL_PADDING_X,
        },
        '&:last-child td': { borderBottom: 0 },
      }}
    >
      <TableCell className="user-sticky-name" sx={stickyNameCellSx(theme)}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
          <Avatar
            sx={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 600,
              color: theme.palette.textSecondary2,
              backgroundColor: theme.palette.surfaceGreySubtle,
              opacity: isInvited ? 0.6 : 1,
            }}
          >
            {initialsOf(user.name)}
          </Avatar>
          <Typography variant="body2" sx={{ ...primaryCellTextSx, overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>
            {user.name}
            {isCurrentUser ? (
              <Box component="span" sx={{ color: primitive.grey[500], fontWeight: 500 }}>
                {' '}
                (You)
              </Box>
            ) : null}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell
        sx={{
          width: EMAIL_COLUMN_WIDTH,
          minWidth: EMAIL_COLUMN_WIDTH,
          maxWidth: EMAIL_COLUMN_WIDTH,
          position: 'relative',
          zIndex: 0,
        }}
      >
        <Typography variant="body2" sx={secondaryCellTextSx}>
          {user.email}
        </Typography>
      </TableCell>
      <TableCell className="user-association-cell" sx={associationBodyCellSx()}>
        <AssociationChipsCell items={associations.franchises} />
      </TableCell>
      <TableCell className="user-association-cell" sx={associationBodyCellSx()}>
        <AssociationChipsCell items={associations.sites} />
      </TableCell>
      <TableCell
        className="user-scroll-cell"
        sx={{ ...scrollBodyCellSx(), width: USER_STATUS_COLUMN_WIDTH, minWidth: USER_STATUS_COLUMN_WIDTH }}
        onClick={(event) => event.stopPropagation()}
      >
        <Tooltip title={lockReason ?? ''} placement="top" disableHoverListener={!lockReason}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              verticalAlign: 'middle',
              lineHeight: 0,
            }}
          >
            <Switch
              size="small"
              checked={isActive}
              disabled={Boolean(lockReason)}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onToggleAccess(user, event.target.checked)}
              inputProps={{ 'aria-label': `Access for ${user.name}` }}
              sx={{
                transform: `scale(${USER_STATUS_SWITCH_SCALE})`,
                transformOrigin: 'left center',
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: `${theme.palette.primary.main} !important`,
                  opacity: 1,
                },
                '& .MuiSwitch-switchBase.Mui-disabled': {
                  opacity: 1,
                },
                '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
                  backgroundColor: `${theme.palette.borderSubtle1} !important`,
                  opacity: 1,
                },
                '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled + .MuiSwitch-track': {
                  backgroundColor: `${theme.palette.primary.main} !important`,
                  opacity: 1,
                },
                '& .MuiSwitch-switchBase.Mui-disabled .MuiSwitch-thumb': {
                  backgroundColor: theme.palette.surfaceWhite,
                  boxShadow: 'none',
                },
              }}
            />
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ width: ADDED_AT_COLUMN_WIDTH, minWidth: ADDED_AT_COLUMN_WIDTH }}>
        <Typography variant="body2" sx={secondaryCellTextSx}>
          {formatUserAddedAt(user)}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          width: LAST_LOGIN_COLUMN_WIDTH,
          minWidth: LAST_LOGIN_COLUMN_WIDTH,
          maxWidth: LAST_LOGIN_COLUMN_WIDTH,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="body2"
          noWrap
          sx={{ ...secondaryCellTextSx, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {formatUserLastLogin(user.lastActiveAt)}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        className="user-row-edit-cell"
        sx={{
          ...stickyEditCellSx(theme),
          pl: 0,
          pr: CELL_PADDING_X,
          py: 0,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {!isCurrentUser ? (
          <IconButton
            className="user-row-edit"
            size="small"
            aria-label={`Edit ${user.name}`}
            onClick={() => onEditUser?.(user)}
            sx={{
              width: ROW_EDIT_ACTION_WIDTH,
              height: ROW_EDIT_ACTION_WIDTH,
              mr: 0,
              display: 'inline-flex',
              color: theme.palette.textSecondary3,
              opacity: 0,
              transition: 'opacity 0.15s ease, color 0.15s ease',
              '&:hover': { backgroundColor: 'transparent', color: theme.palette.textPrimary },
              '&:focus-visible': { opacity: '1 !important' },
              '@media (hover: none)': { opacity: '1 !important' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

export function UserManagementPage() {
  const theme = useTheme();
  const { session } = useAuth();
  const { users, inviteUser, updateUser, setUserActive, isLastAdmin, emailInUse } = useTeam();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userPendingRemoval, setUserPendingRemoval] = useState(null);
  const [query, setQuery] = useState('');
  const [franchiseFilter, setFranchiseFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const siteFilterOptions = useMemo(
    () => getUserSiteFilterOptions(franchiseFilter),
    [franchiseFilter],
  );

  useEffect(() => {
    setPage(0);
  }, [query, franchiseFilter, siteFilter]);

  const handleFranchiseFilterChange = (value) => {
    setFranchiseFilter(value);
    if (!value || !siteFilter) return;
    const allowedSites = getUserSiteFilterOptions(value).slice(1);
    if (!allowedSites.includes(siteFilter)) {
      setSiteFilter('');
    }
  };

  const filteredUsers = useMemo(() => {
    let rows = [...users];
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      rows = rows.filter(
        (user) =>
          user.name.toLowerCase().includes(normalized) || user.email.toLowerCase().includes(normalized),
      );
    }
    if (franchiseFilter) {
      rows = rows.filter((user) => {
        const { franchises } = getUserAssociations(user);
        return franchises.includes(franchiseFilter);
      });
    }
    if (siteFilter) {
      rows = rows.filter((user) => {
        const { sites } = getUserAssociations(user);
        return sites.includes(siteFilter);
      });
    }
    return sortUsers(rows, sortField, sortDirection);
  }, [users, query, franchiseFilter, siteFilter, sortField, sortDirection]);

  const resolveRosterUser = useCallback(
    (user) => {
      if (!user) return null;
      return users.find((entry) => entry.id === user.id) ?? user;
    },
    [users],
  );

  const detailUser = useMemo(
    () => resolveRosterUser(selectedUser),
    [resolveRosterUser, selectedUser],
  );

  const editUser = useMemo(() => resolveRosterUser(userToEdit), [resolveRosterUser, userToEdit]);

  const pagedUsers = filteredUsers.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);
  const total = filteredUsers.length;
  const from = total === 0 ? 0 : page * ROWS_PER_PAGE + 1;
  const to = Math.min((page + 1) * ROWS_PER_PAGE, total);
  const canPrev = page > 0;
  const canNext = (page + 1) * ROWS_PER_PAGE < total;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getLockReason = (user) => {
    const isSelf = user.email.toLowerCase() === session?.email?.toLowerCase();
    if (isSelf) return "You can't change your own access. Another Admin can do it for you.";
    if (isLastAdmin(user.id)) return 'This is the only Admin. Promote someone else first.';
    return null;
  };

  const handleToggleAccess = (user, active) => {
    if (getLockReason(user)) return;
    if (active) {
      setUserActive(user.id, true);
      return;
    }
    setUserPendingRemoval(user);
  };

  const headerCellSx = {
    fontWeight: 500,
    fontSize: 13,
    color: theme.palette.textSecondary3,
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
    py: 1.25,
    px: CELL_PADDING_X,
    backgroundColor: theme.palette.surfaceWhite,
    whiteSpace: 'nowrap',
  };

  const sortLabelSx = {
    color: `${theme.palette.textSecondary3} !important`,
    '& .MuiTableSortLabel-icon': {
      color: `${theme.palette.textSecondary3} !important`,
      opacity: 1,
      fontSize: 16,
    },
  };

  return (
    <PortalShell activeNav="user-management">
      <Stack spacing={2.5} sx={{ width: '100%' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2.5}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 1.5 }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ minWidth: 0, flexWrap: { md: 'nowrap' } }}
          >
            <Search
              placeholder={SEARCH_PLACEHOLDER}
              variant="outlined"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={toolbarSearchFieldSx(theme, {
                placeholder: SEARCH_PLACEHOLDER,
                query,
                extraWidthPx: 80,
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={toolbarSearchIconSx(theme)} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" sx={{ flexShrink: 0 }}>
              <FilterSelect
                label="Franchise"
                value={franchiseFilter}
                onChange={handleFranchiseFilterChange}
                options={userFranchiseFilterOptions}
                searchable
                searchPlaceholder="Search franchises"
              />
              <FilterSelect
                label="Sites"
                value={siteFilter}
                onChange={setSiteFilter}
                options={siteFilterOptions}
                searchable
                searchPlaceholder="Search sites"
              />
            </Stack>
          </Stack>
          <Button
            variant="primary"
            onClick={() => setInviteOpen(true)}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            sx={{ height: 36, px: 2.5, flexShrink: 0, alignSelf: { xs: 'flex-start', md: 'center' } }}
          >
            Invite User
          </Button>
        </Stack>

        <Box
          sx={{
            pt: 0.5,
            maxHeight: 'calc(100vh - 280px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {filteredUsers.length === 0 ? (
            <EmptyState title="No users found" description="Try adjusting your search or filters." />
          ) : (
            <>
              <TableContainer
                sx={{
                  overflowX: 'auto',
                  overflowY: 'visible',
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: theme.palette.surfaceWhite,
                  WebkitOverflowScrolling: 'touch',
                  isolation: 'isolate',
                }}
              >
                <Table sx={{ tableLayout: 'auto', width: 'max-content', minWidth: '100%' }}>
                  <colgroup>
                    <col style={{ width: NAME_COLUMN_WIDTH }} />
                    <col style={{ width: EMAIL_COLUMN_WIDTH }} />
                    <col />
                    <col />
                    <col style={{ width: USER_STATUS_COLUMN_WIDTH }} />
                    <col style={{ width: ADDED_AT_COLUMN_WIDTH }} />
                    <col style={{ width: LAST_LOGIN_COLUMN_WIDTH }} />
                    <col style={{ width: ROW_EDIT_CELL_WIDTH }} />
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className="user-sticky-name"
                        sx={{ ...headerCellSx, ...stickyNameCellSx(theme, { header: true }) }}
                        sortDirection={sortField === 'name' ? sortDirection : false}
                      >
                        <TableSortLabel
                          active={sortField === 'name'}
                          direction={sortField === 'name' ? sortDirection : 'asc'}
                          onClick={() => handleSort('name')}
                          sx={sortLabelSx}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellSx, width: EMAIL_COLUMN_WIDTH, minWidth: EMAIL_COLUMN_WIDTH }}
                        sortDirection={sortField === 'email' ? sortDirection : false}
                      >
                        <TableSortLabel
                          active={sortField === 'email'}
                          direction={sortField === 'email' ? sortDirection : 'asc'}
                          onClick={() => handleSort('email')}
                          sx={sortLabelSx}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellSx, ...associationHeaderCellSx() }}
                        sortDirection={sortField === 'franchise' ? sortDirection : false}
                      >
                        <TableSortLabel
                          active={sortField === 'franchise'}
                          direction={sortField === 'franchise' ? sortDirection : 'asc'}
                          onClick={() => handleSort('franchise')}
                          sx={sortLabelSx}
                        >
                          Franchise
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellSx, ...associationHeaderCellSx() }}
                        sortDirection={sortField === 'sites' ? sortDirection : false}
                      >
                        <TableSortLabel
                          active={sortField === 'sites'}
                          direction={sortField === 'sites' ? sortDirection : 'asc'}
                          onClick={() => handleSort('sites')}
                          sx={sortLabelSx}
                        >
                          Sites
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellSx, width: USER_STATUS_COLUMN_WIDTH, minWidth: USER_STATUS_COLUMN_WIDTH }}
                      >
                        User Status
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellSx, width: ADDED_AT_COLUMN_WIDTH, minWidth: ADDED_AT_COLUMN_WIDTH }}
                        sortDirection={sortField === 'addedAt' ? sortDirection : false}
                      >
                        <TableSortLabel
                          active={sortField === 'addedAt'}
                          direction={sortField === 'addedAt' ? sortDirection : 'desc'}
                          onClick={() => handleSort('addedAt')}
                          sx={sortLabelSx}
                        >
                          Added at
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sx={{
                          ...headerCellSx,
                          width: LAST_LOGIN_COLUMN_WIDTH,
                          minWidth: LAST_LOGIN_COLUMN_WIDTH,
                          maxWidth: LAST_LOGIN_COLUMN_WIDTH,
                          boxSizing: 'border-box',
                        }}
                        sortDirection={sortField === 'lastLogin' ? sortDirection : false}
                      >
                        <TableSortLabel
                          active={sortField === 'lastLogin'}
                          direction={sortField === 'lastLogin' ? sortDirection : 'desc'}
                          onClick={() => handleSort('lastLogin')}
                          sx={sortLabelSx}
                        >
                          Last login
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        className="user-row-edit-cell"
                        sx={{
                          ...headerCellSx,
                          ...stickyEditCellSx(theme, { header: true }),
                          pl: 0,
                          pr: CELL_PADDING_X,
                        }}
                        aria-hidden
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedUsers.map((user) => (
                      <UserManagementRow
                        key={user.id}
                        user={user}
                        lockReason={getLockReason(user)}
                        onOpenUser={setSelectedUser}
                        onEditUser={(user) => {
                          if (user.email.toLowerCase() === session?.email?.toLowerCase()) return;
                          setUserToEdit(user);
                        }}
                        onToggleAccess={handleToggleAccess}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.25} sx={{ pt: 2 }}>
                <Typography variant="body2" sx={{ color: theme.palette.textSecondary2, fontSize: 14 }}>
                  {from}-{to} of {total}
                </Typography>
                <IconButton
                  size="small"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => p - 1)}
                  sx={{
                    border: `1px solid ${theme.palette.borderSubtle2}`,
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: theme.palette.textSecondary2,
                    '&.Mui-disabled': { opacity: 0.4 },
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={!canNext}
                  onClick={() => setPage((p) => p + 1)}
                  sx={{
                    border: `1px solid ${theme.palette.borderSubtle2}`,
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: theme.palette.textSecondary2,
                    '&.Mui-disabled': { opacity: 0.4 },
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </>
          )}
        </Box>
      </Stack>

      <InviteUserDrawer
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={inviteUser}
        emailInUse={emailInUse}
      />

      <UserDetailDrawer
        open={Boolean(selectedUser)}
        user={detailUser}
        onClose={() => setSelectedUser(null)}
      />

      <EditUserDrawer
        open={Boolean(userToEdit)}
        user={editUser}
        onClose={() => setUserToEdit(null)}
        onUpdate={(userId, patch) => {
          updateUser(userId, patch);
        }}
      />

      <InactivateUserDialog
        open={Boolean(userPendingRemoval)}
        userName={userPendingRemoval?.name}
        onClose={() => setUserPendingRemoval(null)}
        onConfirm={() => {
          const userId = userPendingRemoval.id;
          setUserActive(userId, false);
          setSelectedUser((current) =>
            current?.id === userId ? { ...current, status: 'inactive' } : current,
          );
          setUserPendingRemoval(null);
        }}
      />
    </PortalShell>
  );
}
