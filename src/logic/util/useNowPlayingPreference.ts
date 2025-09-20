import { useState } from 'react';

import { USE_NOW_PLAYING_PREFERENCE_KEY } from '~/constants/localStorage';

export const useNowPlayingPreference = (): [
  boolean,
  (value: boolean) => void,
] => {
  const [useNowPlaying, setUseNowPlaying] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(USE_NOW_PLAYING_PREFERENCE_KEY) === 'true';
  });

  const setPreference = (value: boolean) => {
    setUseNowPlaying(value);
    localStorage.setItem(USE_NOW_PLAYING_PREFERENCE_KEY, String(value));
  };

  return [useNowPlaying, setPreference];
};
