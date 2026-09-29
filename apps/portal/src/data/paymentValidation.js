import { detectCardBrand } from './paymentMethodCategories';

/**
 * Checkout validation, and the simulated gateway behind it.
 *
 * Two separate gates, deliberately. Validation catches what the browser can know
 * on its own — a card number that fails Luhn, an expiry in the past, a routing
 * number whose checksum is wrong — and blocks before anything is submitted.
 * Authorisation is the gateway's answer, which can only arrive after the round
 * trip, so a declined card is a different state from an invalid one and gets a
 * different screen: invalid means "fix this field", declined means "that card
 * won't work, try another".
 *
 * Messages name the problem rather than restating the rule ("Card number isn't
 * valid", not "Must pass the Luhn check"), and each is short enough to sit under
 * its field without reflowing the form.
 */

/* ------------------------------------------------------------------ helpers */

const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');
const trimmed = (value) => String(value ?? '').trim();

/** Luhn check digit — the arithmetic every issuer's numbering scheme satisfies. */
function passesLuhn(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

/** ABA routing numbers carry their own weighted checksum; a typo fails it. */
function passesAbaChecksum(digits) {
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  const sum = digits
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  return sum % 10 === 0;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isEmail = (value) => EMAIL_PATTERN.test(trimmed(value));
/** Deliberately loose: 10 digits or more, however the user chose to punctuate. */
const isPhone = (value) => digitsOnly(value).length >= 10;

/* --------------------------------------------------------------- formatting */

/** Amex groups 4-6-5; everything else groups in fours. */
export function formatCardNumber(value) {
  const digits = digitsOnly(value).slice(0, 19);
  if (!digits) return '';

  if (detectCardBrand(digits) === 'amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(' ');
  }
  return digits.match(/.{1,4}/g).join(' ');
}

export function formatDigits(value, maxLength) {
  const digits = digitsOnly(value);
  return maxLength ? digits.slice(0, maxLength) : digits;
}

/** Amex asks for a 4-digit CID; the rest want 3. */
export function cvvLengthFor(cardNumber) {
  return detectCardBrand(cardNumber) === 'amex' ? 4 : 3;
}

/* --------------------------------------------------------------- validation */

function validateCreditCard(form, now) {
  const errors = {};
  const number = digitsOnly(form.cardNumber);

  if (!number) errors.cardNumber = 'Card number is required';
  else if (number.length < 13 || number.length > 19) errors.cardNumber = 'Card number is too short';
  else if (!passesLuhn(number)) errors.cardNumber = "Card number isn't valid";

  const expectedCvv = cvvLengthFor(number);
  const cvv = digitsOnly(form.cvv);
  if (!cvv) errors.cvv = 'CVV is required';
  else if (cvv.length !== expectedCvv) errors.cvv = `CVV is ${expectedCvv} digits`;

  if (!trimmed(form.nameOnCard)) errors.nameOnCard = 'Name on card is required';

  const month = Number(digitsOnly(form.expiryMonth));
  const year = digitsOnly(form.expiryYear);

  if (!month || !year) {
    errors.expiry = 'Expiry date is required';
  } else if (month < 1 || month > 12) {
    errors.expiry = 'Month must be 01–12';
  } else {
    // A card is good through the last day of its expiry month, so compare
    // against the month itself rather than against today.
    const fullYear = year.length === 2 ? 2000 + Number(year) : Number(year);
    const expiresAfter = new Date(fullYear, month, 1);
    if (expiresAfter <= new Date(now.getFullYear(), now.getMonth(), 1)) {
      errors.expiry = 'That card has expired';
    }
  }

  return errors;
}

function validateAch(form) {
  const errors = {};

  const account = digitsOnly(form.accountNumber);
  if (!account) errors.accountNumber = 'Account number is required';
  else if (account.length < 4 || account.length > 17) errors.accountNumber = 'Account number is 4–17 digits';

  const routing = digitsOnly(form.routingNumber);
  if (!routing) errors.routingNumber = 'Routing number is required';
  else if (routing.length !== 9) errors.routingNumber = 'Routing number is 9 digits';
  else if (!passesAbaChecksum(routing)) errors.routingNumber = "That routing number isn't valid";

  if (!trimmed(form.accountHolderName)) errors.accountHolderName = 'Account holder name is required';

  return errors;
}

/** Email only — see the note on the PayPal branch in PaymentMethodFormFields. */
function validatePaypal(form) {
  const errors = {};
  if (!trimmed(form.email)) errors.email = 'PayPal email is required';
  else if (!isEmail(form.email)) errors.email = 'Enter a valid email address';
  return errors;
}

function validateZelle(form) {
  const errors = {};
  const contact = trimmed(form.contact);
  if (!contact) errors.contact = 'Email or phone is required';
  else if (!isEmail(contact) && !isPhone(contact)) errors.contact = 'Enter a valid email or mobile number';
  return errors;
}

function validateVenmo(form) {
  const errors = {};
  if (!trimmed(form.username)) errors.username = 'Venmo username is required';
  const phone = trimmed(form.phone);
  if (!phone) errors.phone = 'Mobile number is required';
  else if (!isPhone(phone)) errors.phone = 'Enter a valid mobile number';
  return errors;
}

/**
 * Validate one method's form. Returns a `{ field: message }` map, empty when the
 * form is good. Credit card expiry reports against a single `expiry` key because
 * MM and YY are one control as far as the customer is concerned.
 */
export function validatePaymentForm(typeId, form = {}, now = new Date()) {
  switch (typeId) {
    case 'credit-card':
      return validateCreditCard(form, now);
    case 'ach':
      return validateAch(form);
    case 'paypal':
      return validatePaypal(form);
    case 'zelle':
      return validateZelle(form);
    case 'venmo':
      return validateVenmo(form);
    default:
      return {};
  }
}

/* ------------------------------------------------------------------ gateway */

/**
 * Test numbers that authorise, then decline — the industry's standard ones, so
 * anyone demoing the portal can reach the failure path on purpose. Both satisfy
 * Luhn, which is the point: they get past validation and fail at the processor.
 */
const DECLINE_CARDS = {
  '4000000000000002': {
    code: 'card_declined',
    title: 'Your card was declined',
    detail: 'The issuer turned down this charge. Try another card, or contact your bank.',
  },
  '4000000000009995': {
    code: 'insufficient_funds',
    title: 'Insufficient funds',
    detail: "This card doesn't have enough available balance for the full amount.",
  },
};

const GENERIC_DECLINE = {
  code: 'processing_error',
  title: "We couldn't process that payment",
  detail: 'Nothing was charged. Check the details and try again, or use a different method.',
};

/**
 * The simulated authorisation step.
 *
 * Saved methods always authorise — they have cleared once already, and a demo
 * that randomly fails the happy path is a demo nobody trusts. A new card can be
 * made to decline on purpose with one of the test numbers above; nothing else
 * fails, so the outcome is always something the presenter chose.
 */
export function authorizePayment({ typeId, form = {}, existingMethodId }) {
  if (existingMethodId) return { approved: true };

  if (typeId === 'credit-card') {
    const failure = DECLINE_CARDS[digitsOnly(form.cardNumber)];
    if (failure) return { approved: false, failure };
  }

  return { approved: true };
}

export { GENERIC_DECLINE };
