/**
 * Flat palette keys used across Signal apps (theme.palette.textPrimary, etc.)
 * Values come from @signal/design-tokens — do not invent colors here.
 */
import { semantic } from '@signal/design-tokens/colors';

const { text, border, surface } = semantic;

const palette = {
  textPrimary: text.primary,
  textSecondary1: text.secondary1,
  textSecondary2: text.secondary2,
  textSecondary3: text.secondary3,
  textPlaceholder: text.placeholder,
  textPlaceholderField: text.placeholderField,
  textDisabled: text.disabled,
  textOnColor: text.onColor,
  textBrand: text.brand,
  textBrandHover: text.brandHover,
  textBrandDisabled: text.brandDisabled,
  textAlert: text.alert,
  textAlerDisabled: text.alertDisabled,
  textSuccess: text.success,
  textWarning: text.warning,
  /**
   * Brand-coloured text that actually passes AA.
   *
   * `textBrand` (#2DA551) measures 3.18:1 on white and 2.93:1 on
   * surfaceBrandSubtle — fine for a 24px heading, a failure for the 12–13px
   * labels it was being used on. This is the existing status token, 5.6:1 on
   * both, and is the one to reach for whenever brand-coloured text is small.
   */
  textBrandOnSubtle: semantic.status.onSubtle.success,

  borderSubtle1: border.subtle1,
  borderSubtle2: border.subtle2,
  borderStrong1: border.strong1,
  borderStrong2: border.strong2,
  borderBrand: border.brand,
  borderWarning: border.warning,
  borderSuccess: border.success,
  borderAlert: border.alert,
  borderPurple: border.purple,
  borderAlertHover: border.alertHover,
  borderAlertDisabled: border.alertDisabled,
  borderBrandDisabled: border.brandDisabled,

  surfaceWhite: surface.white,
  surfaceGreySubtle: surface.greySubtle,
  surfaceGreyLight: surface.greyLight,
  surfaceGreyStrong1: surface.greyStrong1,
  surfaceGreyDisabled: surface.greyDisabled,
  surfaceGreyStrong2: surface.greyStrong2,
  surfaceAlertSubtle: surface.alertSubtle,
  surfaceAlertStrong: surface.alertStrong,
  surfaceAlertDisabled: surface.alertDisabled,
  surfaceAlertHover: surface.alertHover,
  surfaceSuccessSubtle: surface.successSubtle,
  surfaceSuccessStrong: surface.successStrong,
  surfaceWarningSubtle: surface.warningSubtle,
  surfaceWarningStrong: surface.warningStrong,
  surfaceBrandSubtle: surface.brandSubtle,
  surfaceBrand: surface.brand,
  surfaceBrandDisabled: surface.brandDisabled,
  surfaceBrandHover: surface.brandHover,
  surfaceSuccessActive: surface.successActive,

  // Standard MUI keys (agents / new apps)
  primary: {
    main: semantic.primary.default,
    light: semantic.primary.subtle,
    dark: semantic.primary.hover,
    contrastText: text.onColor,
  },
  text: {
    primary: text.primary,
    secondary: text.secondary2,
    disabled: text.disabled,
  },
  background: {
    default: surface.greySubtle,
    paper: surface.white,
  },
  error: { main: border.formError },
  success: { main: text.success },
  warning: { main: text.warning },
  divider: border.subtle1,
};

export default palette;
