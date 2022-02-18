import React, { FocusEventHandler, MouseEventHandler } from 'react';

export interface CoreButtonProps {
  onClick?: MouseEventHandler;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  transparent?: boolean;
  buttonLike?: boolean;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  id?: string;
}

export interface BaseButtonProps extends CoreButtonProps {
  children: React.ReactNode | React.ReactNode[];
}
