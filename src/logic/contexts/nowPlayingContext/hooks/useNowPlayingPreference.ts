import { useState } from 'react';

import { USE_NOW_PLAYING_PREFERENCE_KEY } from '~/constants/localStorage';
import { isOnClient } from '~/logic/util/service';

export const useNowPlayingPreference = (): [
  boolean,
  (value: boolean) => void,
] => {
  const [useNowPlaying, setUseNowPlaying] = useState(() => {
    if (!isOnClient()) return false;
    return localStorage.getItem(USE_NOW_PLAYING_PREFERENCE_KEY) === 'true';
  });

  const setPreference = (value: boolean) => {
    setUseNowPlaying(value);
    localStorage.setItem(USE_NOW_PLAYING_PREFERENCE_KEY, String(value));
  };

  return [useNowPlaying, setPreference];
};
