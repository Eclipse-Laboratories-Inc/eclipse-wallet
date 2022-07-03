export const getMediaRemoteUrl = (url, size = {}, alt = '') => ({
  url,
  ...size,
  alt,
});
