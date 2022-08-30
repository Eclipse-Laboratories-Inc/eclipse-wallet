export const getContext = () =>
  new URLSearchParams(window.location.hash.slice(1));

export const getOpener = () => window.opener;
