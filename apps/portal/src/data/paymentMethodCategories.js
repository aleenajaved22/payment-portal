export const PAYMENT_METHOD_CATEGORIES = [
  { title: 'Credit card', typeId: 'credit-card' },
  { title: 'ACH', typeId: 'ach' },
  { title: 'PayPal', typeId: 'paypal' },
  { title: 'Zelle', typeId: 'zelle' },
  { title: 'Venmo', typeId: 'venmo' },
];

export const EMPTY_PAYMENT_METHOD_FORMS = {
  'credit-card': {
    cardNumber: '',
    cvv: '',
    expiryMonth: '',
    expiryYear: '',
    nameOnCard: '',
  },
  ach: {
    routingNumber: '',
    accountNumber: '',
    accountHolderName: '',
  },
  paypal: {
    email: '',
  },
  zelle: {
    contact: '',
    nickname: '',
  },
  venmo: {
    username: '',
    phone: '',
  },
};

/** Card brands we can identify from the number the user typed. */
export const CARD_BRANDS = {
  visa: { label: 'Visa' },
  mastercard: { label: 'Mastercard' },
  amex: { label: 'Amex' },
  discover: { label: 'Discover' },
  card: { label: 'Card' },
};

/** Identify the brand from the leading digits (IIN ranges). Falls back to a generic card. */
export function detectCardBrand(cardNumber = '') {
  const digits = String(cardNumber).replace(/\D/g, '');
  if (!digits) return 'card';
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'mastercard';
  if (/^(6011|65|64[4-9])/.test(digits)) return 'discover';
  return 'card';
}

export function getCardBrand(brandId) {
  return CARD_BRANDS[brandId] ?? CARD_BRANDS.card;
}

export function getPaymentMethodType(typeId, types = []) {
  return types.find((method) => method.id === typeId);
}

function formatCardExpiry(details = {}) {
  const month = details.expiryMonth ?? '';
  const year = details.expiryYear ?? '';
  if (!month && !year) return '';
  const mm = String(month).padStart(2, '0');
  const yy = String(year).length === 4 ? String(year).slice(-2) : String(year).padStart(2, '0');
  return `${mm}/${yy}`;
}

export function buildDetailsFromForm(typeId, form = {}) {
  switch (typeId) {
    case 'credit-card': {
      const digits = String(form.cardNumber ?? '').replace(/\D/g, '');
      return {
        last4: digits.slice(-4),
        brand: detectCardBrand(digits),
        nameOnCard: String(form.nameOnCard ?? '').trim(),
        expiryMonth: String(form.expiryMonth ?? '').trim(),
        expiryYear: String(form.expiryYear ?? '').trim(),
      };
    }
    case 'ach': {
      const acctDigits = String(form.accountNumber ?? '').replace(/\D/g, '');
      return {
        routingNumber: String(form.routingNumber ?? '').trim(),
        accountLast4: acctDigits.slice(-4),
        accountHolderName: String(form.accountHolderName ?? '').trim(),
      };
    }
    case 'paypal':
      return {
        email: String(form.email ?? '').trim(),
      };
    case 'zelle':
      return {
        contact: String(form.contact ?? '').trim(),
        nickname: String(form.nickname ?? '').trim(),
      };
    case 'venmo':
      return {
        username: String(form.username ?? '').trim(),
        phone: String(form.phone ?? '').trim(),
      };
    default:
      return {};
  }
}

export function buildPaymentMethodSummary(typeId, details = {}) {
  switch (typeId) {
    case 'credit-card': {
      const masked = details.last4 ? `•••• ${details.last4}` : '';
      const expiry = formatCardExpiry(details);
      return {
        label: details.nameOnCard?.trim() || masked || 'Credit card',
        subtitle: [masked && details.nameOnCard ? masked : '', expiry ? `Exp ${expiry}` : '']
          .filter(Boolean)
          .join(' · '),
      };
    }
    case 'ach':
      return {
        label: details.accountHolderName || 'Bank account',
        subtitle: details.accountLast4 ? `•••• ${details.accountLast4}` : '',
      };
    case 'paypal':
      return {
        label: details.email || 'PayPal',
        subtitle: '',
      };
    case 'zelle':
      return {
        label: details.contact || details.nickname || 'Zelle',
        subtitle: details.nickname && details.contact ? details.nickname : '',
      };
    case 'venmo':
      return {
        label: details.username || 'Venmo',
        subtitle: details.phone ?? '',
      };
    default:
      return { label: 'Payment method', subtitle: '' };
  }
}

/**
 * Row content for a saved method.
 *
 * `fields` mirrors that type's own "Add payment method" form one-for-one, so a row
 * shows back exactly what was asked for — minus the secrets we deliberately never
 * store (card CVV, PayPal password). Every value comes from user input; nothing is
 * synthesised from the record id.
 *
 *   primary   — the identity the user would recognise the method by
 *   reference — the supporting identifier under it
 *   fields    — the remaining form fields, labelled as the form labelled them
 */
export function getPaymentMethodRowDisplay(method) {
  const details = method.details ?? {};

  switch (method.typeId) {
    case 'credit-card': {
      const expiry = formatCardExpiry(details);
      return {
        primary: details.nameOnCard?.trim() || method.label || 'Credit card',
        reference: getCardBrand(details.brand).label,
        fields: [
          { label: 'Card number', value: details.last4 ? `•••• ${details.last4}` : '—', minWidth: 104 },
          { label: 'Expiry', value: expiry || '—', minWidth: 64 },
        ],
      };
    }
    case 'ach': {
      return {
        primary: details.accountHolderName?.trim() || method.label || 'Bank account',
        reference: 'Bank account',
        fields: [
          {
            label: 'Account number',
            value: details.accountLast4 ? `•••• ${details.accountLast4}` : '—',
            minWidth: 116,
          },
          { label: 'Routing number', value: details.routingNumber || '—', minWidth: 112 },
        ],
      };
    }
    case 'paypal': {
      return {
        primary: details.email || method.label || 'PayPal',
        reference: 'PayPal',
        fields: [],
      };
    }
    case 'zelle': {
      const nickname = details.nickname?.trim();
      const contact = details.contact?.trim();
      return {
        primary: nickname || contact || method.label || 'Zelle',
        reference: 'Zelle',
        fields: contact ? [{ label: 'Email or phone', value: contact, minWidth: 180 }] : [],
      };
    }
    case 'venmo': {
      const username = details.username?.trim();
      const phone = details.phone?.trim();
      return {
        primary: username ? (username.startsWith('@') ? username : `@${username}`) : method.label || 'Venmo',
        reference: 'Venmo',
        fields: phone ? [{ label: 'Mobile number', value: phone, minWidth: 140 }] : [],
      };
    }
    default: {
      return {
        primary: method.label ?? 'Payment method',
        reference: method.subtitle ?? '',
        fields: [],
      };
    }
  }
}


/**
 * The shortest thing you can call a saved method in running prose — "Visa ••••
 * 4242", "Bank account •••• 6789", "@alinamorgan".
 *
 * Distinct from `getPaymentMethodRowDisplay().primary`, which leads with the
 * person (the cardholder's name), because a confirmation is about the
 * instrument: "$980.00 paid with Alina Morgan" reads as paying a person, which
 * is precisely what did not happen.
 */
export function getPaymentMethodShortLabel(method) {
  if (!method) return null;
  const details = method.details ?? {};

  switch (method.typeId) {
    case 'credit-card': {
      const brand = getCardBrand(details.brand).label;
      return details.last4 ? `${brand} •••• ${details.last4}` : brand;
    }
    case 'ach':
      return details.accountLast4 ? `bank account •••• ${details.accountLast4}` : 'your bank account';
    case 'paypal':
      return details.email ? `PayPal (${details.email})` : 'PayPal';
    case 'zelle':
      return details.nickname?.trim() || details.contact?.trim() || 'Zelle';
    case 'venmo': {
      const username = details.username?.trim();
      if (!username) return 'Venmo';
      return username.startsWith('@') ? username : `@${username}`;
    }
    default:
      return method.label ?? null;
  }
}
