import { getDefaultPaymentMethodsState } from '../data/defaultPaymentMethods';

const STORAGE_KEY = 'filtergo_portal_payment_methods_v2';

const REMOVED_PAYMENT_TYPE_IDS = new Set(['zelle', 'venmo']);

function normalizeStoredState(parsed) {
  const methods = (Array.isArray(parsed.methods) ? parsed.methods : []).filter(
    (method) => !REMOVED_PAYMENT_TYPE_IDS.has(method.typeId),
  );
  let defaultMethodId = parsed.defaultMethodId ?? methods[0]?.id ?? null;
  if (defaultMethodId && !methods.some((method) => method.id === defaultMethodId)) {
    defaultMethodId = methods[0]?.id ?? null;
  }
  return { methods, defaultMethodId };
}

export function getStoredPaymentMethods() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultPaymentMethodsState();
    }
    const parsed = JSON.parse(raw);
    return normalizeStoredState(parsed);
  } catch {
    return getDefaultPaymentMethodsState();
  }
}

export function setStoredPaymentMethods(methods, defaultMethodId) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      methods,
      defaultMethodId,
    }),
  );
}
