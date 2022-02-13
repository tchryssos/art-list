import { css } from '@emotion/react';

import { Theme } from '~/constants/theme';

export const createInputStyles = (theme: Theme) =>
  css({
    padding: theme.spacing[16],
    fontSize: theme.fontSize.body,
    fontFamily: theme.fontFamily.normal,
    fontWeight: theme.fontWeight.light,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    border: `${theme.border.borderWidth[1]} solid ${theme.colors.accentHeavy}`,
  });
