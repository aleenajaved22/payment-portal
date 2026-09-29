import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getRoleIdFromLabel, mockUsers } from '../data/mockUsers';

/**
 * The people on this account.
 *
 * In memory, like [InvoicesContext] and [ReportsContext] — a reload restores the
 * seed list so the demo can be walked again.
 */

const TeamContext = createContext(null);

function createUserId() {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** "alina.morgan@example.com" → "Alina Morgan", as a stand-in until they accept. */
function nameFromEmail(email) {
  const local = String(email).split('@')[0] ?? '';
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || email
  );
}

export function TeamProvider({ children }) {
  const { session } = useAuth();
  const [users, setUsers] = useState(mockUsers);

  /**
   * The signed-in account, always present in the list.
   *
   * Whoever is reading this page is on the account by definition, so a roster
   * that omits them is simply wrong — and it takes the one safeguard that
   * matters with it, since you cannot be warned about removing yourself from a
   * list you do not appear in. Signing in with a seeded address matches that
   * row instead of duplicating it.
   */
  const roster = useMemo(() => {
    const email = session?.email?.trim();
    if (!email) return users;
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return users;

    return [
      {
        id: 'u-self',
        name: session.name ?? email,
        email,
        roleId: 'admin',
        status: 'active',
        lastActiveAt: session.loggedInAt ?? new Date().toISOString(),
      },
      ...users,
    ];
  }, [session, users]);

  const inviteUser = useCallback((email, roleLabel) => {
    const invited = {
      id: createUserId(),
      name: nameFromEmail(email),
      email: email.trim(),
      roleId: getRoleIdFromLabel(roleLabel),
      status: 'invited',
      lastActiveAt: null,
      invitedAt: new Date().toISOString(),
    };
    setUsers((previous) => [...previous, invited]);
    return invited;
  }, []);

  const changeUserRole = useCallback((userId, roleId) => {
    setUsers((previous) =>
      previous.map((user) => (user.id === userId ? { ...user, roleId } : user)),
    );
  }, []);

  const removeUser = useCallback((userId) => {
    setUsers((previous) => previous.filter((user) => user.id !== userId));
  }, []);

  /**
   * An account must keep at least one Admin, or nobody can manage people or
   * cards again. The rule lives here rather than in the page so every caller is
   * bound by it, and the page can ask the same question to disable its controls.
   */
  const isLastAdmin = useCallback(
    (userId) => {
      const user = roster.find((entry) => entry.id === userId);
      if (!user || user.roleId !== 'admin') return false;
      return roster.filter((entry) => entry.roleId === 'admin').length === 1;
    },
    [roster],
  );

  const emailInUse = useCallback(
    (email) => roster.some((user) => user.email.toLowerCase() === String(email).trim().toLowerCase()),
    [roster],
  );

  const value = useMemo(
    () => ({ users: roster, inviteUser, changeUserRole, removeUser, isLastAdmin, emailInUse }),
    [roster, inviteUser, changeUserRole, removeUser, isLastAdmin, emailInUse],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return ctx;
}
