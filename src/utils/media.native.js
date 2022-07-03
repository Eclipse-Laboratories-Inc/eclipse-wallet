export const getMediaRemoteUrl = (url, size = {}, alt = '') => ({
  url: { uri: url },
  ...size,
  alt,
});
