import styled from '@emotion/styled';
import { FormEvent, RefObject } from 'react';

interface FormProps {
  className?: string;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  children: React.ReactNode | React.ReactNode[];
  formRef?: RefObject<HTMLFormElement>;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[16]};
  box-sizing: border-box;
  width: 100%;
`;

export const Form: React.FC<FormProps> = ({
  className,
  onSubmit,
  children,
  formRef,
}) => {
  const _onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <StyledForm className={className} ref={formRef} onSubmit={_onSubmit}>
      {children}
    </StyledForm>
  );
};
