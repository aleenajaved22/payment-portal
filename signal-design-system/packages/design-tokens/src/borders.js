/**
 * Signal Design System — Border tokens
 *
 * Default width is 1px (observed across shared controls).
 * Semantic colors follow approved role split; component overrides stay separate.
 */

/** Border widths — 1px is the default control border width. */
export const width = {
  none: 0,
  /** Canonical / default border width. */
  default: '1px',
  /** Alias of `default` (historical name). */
  thin: '1px',
};

/** Semantic border colors (aligned with colors.semantic.border). */
export const color = {
  subtle1: '#e6e6e7',
  subtle2: '#d0cfd2',
  strong1: '#AEAEB2',
  strong2: '#6A6A70',
  brand: '#2DA551',
  warning: '#F19F02',
  success: '#2E964B',
  alert: '#E43F32',
  purple: '#9747FF',
  alertHover: '#B32318',
  alertDisabled: '#FECDCA',
  brandDisabled: '#9DD49D',
  /**
   * Form-error border — component/role-specific vs alert.
   * Do not merge with `alert` (#E43F32) yet.
   */
  formError: '#DF372B',
};

/**
 * Component-specific / override border colors.
 * Intentionally separate from semantic palette borders.
 */
export const overrideColor = {
  inputDefault: '#E6E6E7',
  inputHover: '#AEAEB2',
  inputFocus: '#2DA551',
  /** TextField / destructiveSecondary — same as color.formError. */
  inputError: '#DF372B',
  /**
   * Select-family focus — keep #3F99FF; do not replace with #146DFF.
   * Also used by countrySelect / bulkAssignments.
   */
  selectFocus: '#3F99FF',
  /** Select error only — legacy/component-specific. */
  selectError: '#f04438',
  /** Destructive button hover:none — legacy. */
  destructiveAlt: '#D92D20',
};

/** Shorthand borders matching override / semantic strings. */
export const style = {
  inputDefault: '1px solid #E6E6E7',
  inputFocus: '1px solid #2DA551',
  inputError: '1px solid #DF372B',
  /** Component-specific Select-family focus. */
  selectFocus: '1px solid #3F99FF',
  brand: '1px solid #2DA551',
  strong: '1px solid #AEAEB2',
  subtle: '1px solid #e6e6e7',
  alert: '1px solid #E43F32',
  formError: '1px solid #DF372B',
};

const borders = {
  width,
  color,
  overrideColor,
  style,
};

export default borders;
