import { formatMMDDYY } from './mockInvoices';

/**
 * The people who can sign in to this account.
 *
 * Roles are deliberately few and phrased by what they can do to money, because
 * that is the only consequential difference in a billing portal:
 *
 *   Admin    — pays invoices, manages cards, manages people
 *   Billing  — pays invoices, manages cards
 *   Viewer   — reads invoices and reports, pays nothing
 *
 * Seeded relative to today so "invited 3 days ago" stays true however long the
 * demo sits, matching how mockInvoices and mockReports already work.
 */

export const USER_ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    summary: 'Full access, including people and payment methods',
  },
  {
    id: 'billing',
    label: 'Billing',
    summary: 'Can pay invoices and manage payment methods',
  },
  {
    id: 'viewer',
    label: 'Viewer',
    summary: 'Can read invoices and reports, but not pay',
  },
];

export const USER_ROLE_OPTIONS = USER_ROLES.map((role) => role.label);

export function getRole(roleId) {
  return USER_ROLES.find((role) => role.id === roleId) ?? USER_ROLES[USER_ROLES.length - 1];
}

export function getRoleIdFromLabel(label) {
  return USER_ROLES.find((role) => role.label === label)?.id ?? 'viewer';
}

function daysAgoIso(days) {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const mockUsers = [
  {
    id: 'u-1',
    name: 'Alina Morgan',
    email: 'alina.morgan@example.com',
    roleId: 'admin',
    status: 'active',
    addedAt: daysAgoIso(120),
    lastActiveAt: daysAgoIso(0),
  },
  {
    id: 'u-2',
    name: 'John Hairgrove',
    email: 'john.hairgrove@filtergo.com',
    roleId: 'billing',
    status: 'active',
    addedAt: daysAgoIso(400),
    lastActiveAt: daysAgoIso(2),
  },
  {
    id: 'u-3',
    name: 'Maria Chen',
    email: 'maria.chen@filtergo.com',
    roleId: 'viewer',
    status: 'active',
    addedAt: daysAgoIso(90),
    lastActiveAt: daysAgoIso(11),
  },
  {
    id: 'u-4',
    name: 'Rosie Padilla',
    email: 'rosie.padilla@filtergo.com',
    roleId: 'billing',
    status: 'invited',
    addedAt: daysAgoIso(3),
    lastActiveAt: null,
    invitedAt: daysAgoIso(3),
  },
];

/** When the user joined or was invited — MM/DD/YY. */
export function formatUserAddedAt(user) {
  const iso = user.addedAt ?? user.invitedAt ?? user.lastActiveAt;
  return iso ? formatMMDDYY(iso) : '—';
}

/** Last sign-in — MM/DD/YY • HH:MM:SS (portal convention). */
export function formatUserLastLogin(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${formatMMDDYY(date)} • ${time}`;
}

export function getUserAddedTime(user) {
  const iso = user.addedAt ?? user.invitedAt ?? user.lastActiveAt;
  const parsed = iso ? new Date(iso) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : 0;
}

export function getUserLastLoginTime(user) {
  if (!user.lastActiveAt) return 0;
  const parsed = new Date(user.lastActiveAt);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

/** "Today", "Yesterday", "11 days ago" — relative reads better than a date here. */
export function formatRelativeDay(iso) {
  if (!iso) return null;
  const then = new Date(iso);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const thenDay = new Date(then);
  thenDay.setHours(0, 0, 0, 0);

  const days = Math.round((startOfToday.getTime() - thenDay.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return formatMMDDYY(then);
}
