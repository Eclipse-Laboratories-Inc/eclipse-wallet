import { Platform } from 'react-native';

export const isWeb = () => Platform.OS === 'web';

export const isNative = () => !isWeb();

export const isExtension = () => process.env.REACT_APP_IS_EXTENSION || false;
