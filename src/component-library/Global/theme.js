import { rgbToHex } from '@mui/material';
import { Platform, Dimensions, Appearance, StyleSheet } from 'react-native';

const calculateResponsivePadding = () => {
  let padding = 10;
  if (Dimensions.get('window').width > 320) {
    padding = 15;
  }
  if (Dimensions.get('window').width > 375) {
    padding = 20;
  }
  if (Dimensions.get('window').width > 720) {
    padding = 25;
  }
  return padding;
};

const calculateResponsiveMargin = () => {
  let margin = 0;
  if (Dimensions.get('window').width > 720) {
    margin = 40;
  }
  return margin;
};

const APPBAR_HEIGHT = Platform.select({ ios: 44, android: 56 });
const STATUSBAR_HEIGHT = Platform.select({ ios: 20, android: 0 });
const HEADER_HEIGHT = STATUSBAR_HEIGHT + APPBAR_HEIGHT;

const variables = {
  APPBAR_HEIGHT,
  STATUSBAR_HEIGHT,
  HEADER_HEIGHT,

  buttonMaxWidth: 375,
  buttonMaxWidthSmall: 263,
  mobileWidth: 375,
  mobileWidthLG: 425,
  mobileWidthXL: 480,
  tabletWidth: 690,
  mobileHeightLG: 1000,
  margin: calculateResponsiveMargin(),
};

const debug = {
  borderColor: 'red',
  borderWidth: 1,
};

const fonts = {
  primary: 'DMSansRegular',
  dmSansRegular: 'DMSans-Regular',
  dmSansMedium: 'DMSans-Medium',
  dmSansBold: 'DMSans-Bold',
};

const fontSize = {
  fontSizeXS: 9,
  fontSizeSM: 12,
  fontSizeNormal: 16,
  fontSizeMD: 21,
  fontSizeLG: 26,
  fontSizeXL: 48,
};

const lineHeight = {
  lineHeightXS: 12,
  lineHeightSM: 16,
  lineHeightNormal: 24,
  lineHeightMD: 27,
  lineHeightLG: 32,
  lineHeightXL: 58,
};

const gutters = {
  margin: 5,
  responsivePadding: calculateResponsivePadding(),
  paddingXXS: 4,
  paddingXS: 8,
  paddingSM: 12,
  paddingNormal: 16,
  paddingMD: 20,
  paddingLG: 24,
  paddingXL: 32,
  padding2XL: 40,
  padding3XL: 48,
  padding4XL: 56,
};

const borderRadius = {
  borderRadiusXS: 4,
  borderRadiusSM: 6,
  borderRadiusNormal: 8,
  borderRadiusMD: 10,
  borderRadiusLG: 16,
  borderRadiusXL: 20,
  borderRadiusPill: 25,
};

const staticColor = {
  alwaysWhite: '#fff',
  alwaysBlack: '#000',
  transparent: 'transparent',
};

const themes = {
  light: {
    white: '#fff',
    black: '#000000',

    white100: 'rgba(255, 255, 255, 0.1)',
    white200: 'rgba(255, 255, 255, 0.2)',
    white300: 'rgba(255, 255, 255, 0.3)',
    white400: 'rgba(255, 255, 255, 0.4)',
    white500: 'rgba(255, 255, 255, 0.5)',
    white600: 'rgba(255, 255, 255, 0.6)',
    white700: 'rgba(255, 255, 255, 0.7)',
    white800: 'rgba(255, 255, 255, 0.8)',
    white850: 'rgba(255, 255, 255, 0.85)',
    white900: 'rgba(255, 255, 255, 0.9)',

    black100: 'rgba(0, 0, 0, 0.1)',
    black150: 'rgba(0, 0, 0, 0.15)',
    black200: 'rgba(0, 0, 0, 0.2)',
    black300: 'rgba(0, 0, 0, 0.3)',
    black400: 'rgba(0, 0, 0, 0.4)',
    black500: 'rgba(0, 0, 0, 0.5)',
    black600: 'rgba(0, 0, 0, 0.6)',
    black700: 'rgba(0, 0, 0, 0.7)',
    black800: 'rgba(0, 0, 0, 0.8)',
    black850: 'rgba(0, 0, 0, 0.85)',
    black900: 'rgba(0, 0, 0, 0.9)',

    // bgPrimary: 'hsla(225, 25%, 25%, 1)',
    bgPrimary: 'hsla(225, 27%, 9%, 1)',
    bgDarken: 'hsla(225, 27%, 9%, 1)',
    bgDarkenFaded: 'hsla(225, 27%, 9%, 0.3)',
    bgLight: 'hsla(223, 34%, 13%, 1)',
    cards: 'rgba(42, 56, 78, 1)',

    labelPrimary: 'hsla(0, 0%, 99%, 1)',
    labelSecondary: 'rgba(191, 197, 210, 1)',
    labelTertiary: 'rgba(128, 135, 153, 1)',

    accentPrimary: 'hsla(7, 100%, 64%, 1)',
    accentSecondary: 'hsla(0, 59%, 40%, 1)',
    accentTertiary: 'hsla(0, 100%, 86%, 1)',

    btnHover: 'hsla(0, 79%, 53%, 1)',
    btnOnClick: 'hsla(14, 55%, 21%, 1)',
    btnBrandDark: 'hsla(224, 19%, 27%, 1)',
    btnBrandLight: 'hsla(224, 18%, 49%, 1)',

    positiveBright: 'rgba(124, 255, 81, 1)',
    negativeBright: 'rgba(255, 25, 25, 1)',
    warningBright: 'rgba(238, 255, 0, 1)',

    success: '#07b114',
    info: '#006EC5',
    warning: '#ea772b',
    danger: '#dc3545',

    niceSuccess: '#d1e7dd',
    niceSuccessText: '#0f5132',
    niceWarning: '#fff3cd',
    niceWarningText: '#856404',
    niceDanger: '#f8d7da',
    niceDangerText: '#842029',
  },
  dark: {
    white: '#1f1f1f',
    black: '#FFFFFF',

    white100: 'rgba(0, 0, 0, 0.1)',
    white200: 'rgba(0, 0, 0, 0.2)',
    white300: 'rgba(0, 0, 0, 0.3)',
    white400: 'rgba(0, 0, 0, 0.4)',
    white500: 'rgba(0, 0, 0, 0.5)',
    white600: 'rgba(0, 0, 0, 0.6)',
    white700: 'rgba(0, 0, 0, 0.7)',
    white800: 'rgba(0, 0, 0, 0.8)',
    white850: 'rgba(0, 0, 0, 0.85)',
    white900: 'rgba(0, 0, 0, 0.9)',

    black100: 'rgba(255, 255, 255, 0.1)',
    black150: 'rgba(255, 255, 255, 0.15)',
    black200: 'rgba(255, 255, 255, 0.2)',
    black300: 'rgba(255, 255, 255, 0.3)',
    black400: 'rgba(255, 255, 255, 0.4)',
    black500: 'rgba(255, 255, 255, 0.5)',
    black600: 'rgba(255, 255, 255, 0.6)',
    black700: 'rgba(255, 255, 255, 0.7)',
    black800: 'rgba(255, 255, 255, 0.8)',
    black850: 'rgba(255, 255, 255, 0.85)',
    black900: 'rgba(255, 255, 255, 0.9)',

    bgPrimary: 'hsla(225, 27%, 9%, 1)',
    bgDarken: 'hsla(225, 27%, 9%, 1)',
    bgDarkenFaded: 'hsla(225, 27%, 9%, 0.3)',
    bgLight: 'hsla(223, 34%, 13%, 1)',
    cards: 'rgba(42, 56, 78, 1)',

    labelPrimary: 'hsla(0, 0%, 99%, 1)',
    labelSecondary: 'rgba(191, 197, 210, 1)',
    labelTertiary: 'rgba(128, 135, 153, 1)',

    accentPrimary: 'hsla(7, 100%, 64%, 1)',
    accentSecondary: 'hsla(0, 59%, 40%, 1)',
    accentTertiary: 'hsla(0, 100%, 86%, 1)',

    btnHover: 'hsla(0, 79%, 53%, 1)',
    btnOnClick: 'hsla(14, 55%, 21%, 1)',
    btnBrandDark: 'hsla(224, 19%, 27%, 1)',
    btnBrandLight: 'hsla(224, 18%, 49%, 1)',

    positiveBright: 'hsla(105, 100%, 66%, 1)',
    negativeBright: 'hsla(0, 100%, 55%, 1)',
    warningBright: 'hsla(64, 100%, 50%, 1)',

    success: '#07b114',
    info: '#006EC5',
    warning: '#ea772b',
    danger: '#dc3545',

    alertSuccessBg: 'rgba(128, 255, 84, 0.2)',
    alertSuccessBorder: 'rgba(128, 255, 84, 0.4)',
    alertSuccessFont: 'rgba(128, 255, 84, 1)',

    alertErrorBg: 'rgba(255,27,27, 0.2)',
    alertErrorBorder: 'rgba(255,27,27, 0.4)',
    alertErrorFont: 'rgba(252,252,252, 1)',

    alertWarningBg: 'rgba(255,168,0, 0.2)',
    alertWarningBorder: 'rgba(255,168,0, 0.4)',
    alertWarningFont: 'rgba(255,168,0, 1)',

    niceSuccess: '#d1e7dd',
    niceSuccessText: '#0f5132',
    niceWarning: '#fff3cd',
    niceWarningText: '#856404',
    niceDanger: '#f8d7da',
    niceDangerText: '#842029',
  },
};

const colorTheme =
  Appearance.getColorScheme() === 'dark' ? themes.dark : themes.light;

export const globalStyles = StyleSheet.create({
  alignEnd: {
    alignSelf: 'flex-end',
  },
  squareRatio: {
    width: '100%',
    aspectRatio: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inlineCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  inlineFlexButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inlineFlexAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonTouchable: {
    flex: 1,
  },
  button: {
    alignSelf: 'stretch',
  },
  buttonLeft: {
    marginRight: gutters.paddingXS,
  },
  buttonRight: {
    marginLeft: gutters.paddingXS,
  },
  labelRight: {
    textAlign: 'right',
  },
  addressBookItem: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 60,
  },
  addressBookTouchable: {
    marginBottom: 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: variables.buttonMaxWidthSmall,
  },
  floatingTransactionBox: {
    marginVertical: gutters.paddingLG,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  floatingTransaction: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  bigImage: {
    backgroundColor: colorTheme.bgLight,
  },
  inlineWell: {
    marginBottom: gutters.paddingSM,
    paddingVertical: gutters.paddingXS,
    paddingHorizontal: gutters.paddingSM,
    width: '100%',
    // maxWidth: variables.buttonMaxWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorTheme.bgLight,
    borderRadius: borderRadius.borderRadiusMD,
  },
});

const theme = {
  variables,
  debug,
  fonts,
  fontSize,
  lineHeight,
  gutters,
  borderRadius,
  staticColor,
  colors: colorTheme,
  globalStyles,
};

export default theme;
