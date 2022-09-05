export const isWeb = () => true;

export const isNative = () => false;

export const isExtension = () => process.env.REACT_APP_IS_EXTENSION || false;
