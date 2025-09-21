export const getDocument = (): Document | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.document;
};
