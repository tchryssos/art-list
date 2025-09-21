import type { FormEvent, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormProps {
  className?: string;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  children: React.ReactNode | React.ReactNode[];
  formRef?: RefObject<HTMLFormElement>;
}

export function Form({ className, onSubmit, children, formRef }: FormProps) {
  const _onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <form
      className={twMerge('flex flex-col gap-4 box-border w-full', className)}
      ref={formRef}
      onSubmit={_onSubmit}
    >
      {children}
    </form>
  );
}
