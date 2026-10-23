import { buildPaymentMethodSummary } from './paymentMethodCategories';

/**
 * Starting payment methods — one per category, so Card Management is never empty.
 * These are ordinary saved methods: editable, removable, and selectable at
 * checkout exactly like anything the user adds.
 */
const SEED_METHODS = [
  {
    id: 'seed-credit-card',
    typeId: 'credit-card',
    details: { brand: 'visa', last4: '4242', nameOnCard: 'Alina Morgan', expiryMonth: '08', expiryYear: '2027' },
  },
  {
    id: 'seed-ach',
    typeId: 'ach',
    details: { routingNumber: '021000021', accountLast4: '6789', accountHolderName: 'Alina Morgan' },
  },
  {
    id: 'seed-google-pay',
    typeId: 'google-pay',
    details: { email: 'alina.morgan@gmail.com', accountHolderName: 'Alina Morgan' },
  },
  {
    id: 'seed-apple-pay',
    typeId: 'apple-pay',
    details: { email: 'alina.morgan@icloud.com', accountHolderName: 'Alina Morgan' },
  },
];

function buildStoredSeedMethod(seed) {
  const summary = buildPaymentMethodSummary(seed.typeId, seed.details);
  return { ...seed, label: summary.label, subtitle: summary.subtitle, createdAt: null };
}

/** One demo method per type when local storage predates a newly added category. */
export function mergeMissingSeedPaymentMethods(methods = []) {
  const existingTypes = new Set(methods.map((method) => method.typeId));
  const additions = SEED_METHODS.filter((seed) => !existingTypes.has(seed.typeId)).map(buildStoredSeedMethod);
  return additions.length ? [...methods, ...additions] : methods;
}

export function getDefaultPaymentMethodsState() {
  const methods = SEED_METHODS.map(buildStoredSeedMethod);

  return {
    methods,
    defaultMethodId: methods[0]?.id ?? null,
  };
}
