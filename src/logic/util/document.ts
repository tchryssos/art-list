import { isOnClient } from './service';

export const getDocument = (): Document | undefined => {
  if (!isOnClient()) {
    return undefined;
  }
  return window.document;
};
