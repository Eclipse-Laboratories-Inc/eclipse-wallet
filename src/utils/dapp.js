import { fetch } from 'fetch-opengraph';

export const getMetadata = async url => {
  const data = await fetch(url);

  return { name: data['og:title'], icon: data['og:image'] };
};
