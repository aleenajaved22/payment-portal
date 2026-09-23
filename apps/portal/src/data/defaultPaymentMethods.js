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
    id: 'seed-paypal',
    typeId: 'paypal',
    details: { email: 'alina.morgan@example.com' },
  },
  {
    id: 'seed-zelle',
    typeId: 'zelle',
    details: { contact: 'alina.morgan@example.com', nickname: 'Primary Zelle' },
  },
  {
    id: 'seed-venmo',
    typeId: 'venmo',
    details: { username: 'alinamorgan', phone: '(415) 555-0134' },
  },
];

export function getDefaultPaymentMethodsState() {
  const methods = SEED_METHODS.map((seed) => {
    const summary = buildPaymentMethodSummary(seed.typeId, seed.details);
    return { ...seed, label: summary.label, subtitle: summary.subtitle, createdAt: null };
  });

  return {
    methods,
    defaultMethodId: methods[0]?.id ?? null,
  };
}
