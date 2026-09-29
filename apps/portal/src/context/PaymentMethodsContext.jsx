import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { buildPaymentMethodSummary } from '../data/paymentMethodCategories';
import { getStoredPaymentMethods, setStoredPaymentMethods } from '../auth/paymentMethodsStorage';

const PaymentMethodsContext = createContext(null);

function createMethodId() {
  return `pm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Whether two sets of details describe the same instrument.
 *
 * Compared on what identifies the method to its provider, not on the whole
 * record: a card re-entered with a different expiry is still that card, and the
 * fields we deliberately never store (CVV, PayPal password) can't take part.
 */
function isSameMethod(typeId, a = {}, b = {}) {
  const eq = (left, right) => Boolean(left) && String(left).toLowerCase() === String(right).toLowerCase();

  switch (typeId) {
    case 'credit-card':
      return eq(a.last4, b.last4) && eq(a.brand, b.brand);
    case 'ach':
      return eq(a.accountLast4, b.accountLast4) && eq(a.routingNumber, b.routingNumber);
    case 'paypal':
      return eq(a.email, b.email);
    case 'zelle':
      return eq(a.contact, b.contact);
    case 'venmo':
      return eq(a.username, b.username);
    default:
      return false;
  }
}

function buildStoredMethod(typeId, details) {
  const summary = buildPaymentMethodSummary(typeId, details);
  return {
    id: createMethodId(),
    typeId,
    details,
    label: summary.label,
    subtitle: summary.subtitle,
    createdAt: new Date().toISOString(),
  };
}

export function PaymentMethodsProvider({ children }) {
  const [state, setState] = useState(() => getStoredPaymentMethods());

  const persist = useCallback((next) => {
    setState(next);
    setStoredPaymentMethods(next.methods, next.defaultMethodId);
  }, []);

  const defaultMethod = useMemo(
    () => state.methods.find((method) => method.id === state.defaultMethodId) ?? state.methods[0] ?? null,
    [state.defaultMethodId, state.methods],
  );

  const addPaymentMethod = useCallback(
    (typeId, details = {}, options = {}) => {
      const method = buildStoredMethod(typeId, details);
      const methods = [...state.methods, method];
      const defaultMethodId = options.makeDefault !== false ? method.id : state.defaultMethodId ?? method.id;
      persist({ methods, defaultMethodId });
      return method;
    },
    [persist, state.defaultMethodId, state.methods],
  );

  const payAtCheckout = useCallback(
    ({ existingMethodId, typeId, details }) => {
      /* Paying with something already saved does not re-point the account's
         default. Settling one invoice by bank transfer is not a decision to
         stop using your card, and having the dashboard's Active Payment Method
         change behind you because of it is exactly the kind of silent side
         effect that makes people distrust a billing portal. */
      if (existingMethodId) {
        const existing = state.methods.find((method) => method.id === existingMethodId);
        if (!existing) return null;
        if (!state.defaultMethodId) persist({ ...state, defaultMethodId: existingMethodId });
        return existing;
      }

      // Paying twice with the same card used to save it twice, so the account
      // filled up with copies of one method — and, before checkout validated
      // anything, with blank ones. Match on the identity the type is keyed by
      // and reuse the existing record instead.
      const existing = state.methods.find(
        (method) => method.typeId === typeId && isSameMethod(typeId, method.details, details),
      );
      if (existing) {
        // Refreshed rather than merely reused: the customer just re-keyed this
        // card, so a changed name or a new expiry from a reissue is the current
        // truth and should be what the account shows from now on.
        const summary = buildPaymentMethodSummary(typeId, details);
        const refreshed = { ...existing, details, label: summary.label, subtitle: summary.subtitle };
        persist({
          methods: state.methods.map((method) => (method.id === existing.id ? refreshed : method)),
          defaultMethodId: existing.id,
        });
        return refreshed;
      }

      const primary = buildStoredMethod(typeId, details);
      const methods = [...state.methods, primary];

      persist({ methods, defaultMethodId: primary.id });
      return primary;
    },
    // Reads state.defaultMethodId as well as state.methods now, so it depends on
    // the whole slice rather than one field of it.
    [persist, state],
  );

  const setDefaultPaymentMethod = useCallback(
    (methodId) => {
      if (!state.methods.some((method) => method.id === methodId)) return;
      persist({ ...state, defaultMethodId: methodId });
    },
    [persist, state],
  );

  const updatePaymentMethod = useCallback(
    (methodId, typeId, details) => {
      const existing = state.methods.find((entry) => entry.id === methodId);
      if (!existing) return null;
      const summary = buildPaymentMethodSummary(typeId, details);
      const updated = { ...existing, typeId, details, label: summary.label, subtitle: summary.subtitle };
      persist({ ...state, methods: state.methods.map((m) => (m.id === methodId ? updated : m)) });
      return updated;
    },
    [persist, state],
  );

  const removePaymentMethod = useCallback(
    (methodId) => {
      const methods = state.methods.filter((method) => method.id !== methodId);
      const defaultMethodId =
        state.defaultMethodId === methodId ? methods[0]?.id ?? null : state.defaultMethodId;
      persist({ methods, defaultMethodId });
    },
    [persist, state],
  );

  const syncFromStorage = useCallback(() => {
    setState(getStoredPaymentMethods());
  }, []);

  const value = useMemo(
    () => ({
      methods: state.methods,
      defaultMethod,
      defaultMethodId: state.defaultMethodId,
      hasPaymentMethod: state.methods.length > 0,
      addPaymentMethod,
      payAtCheckout,
      setDefaultPaymentMethod,
      removePaymentMethod,
      updatePaymentMethod,
      syncFromStorage,
    }),
    [
      addPaymentMethod,
      defaultMethod,
      payAtCheckout,
      removePaymentMethod,
      updatePaymentMethod,
      setDefaultPaymentMethod,
      syncFromStorage,
      state.defaultMethodId,
      state.methods,
    ],
  );

  return <PaymentMethodsContext.Provider value={value}>{children}</PaymentMethodsContext.Provider>;
}

export function usePaymentMethods() {
  const ctx = useContext(PaymentMethodsContext);
  if (!ctx) {
    throw new Error('usePaymentMethods must be used within PaymentMethodsProvider');
  }
  return ctx;
}
