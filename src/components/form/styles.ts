import { css } from '@emotion/react';

import { Theme } from '~/constants/theme';

export const createInputStyles = (theme: Theme) =>
  css({
    padding: theme.spacing[16],
    fontSize: theme.fontSize.body,
    fontFamily: theme.fontFamily.normal,
  });
