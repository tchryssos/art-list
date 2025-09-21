import { useCallback, useEffect, useRef } from 'react';

import { formDataToObject } from './forms';
import { isOnClient } from './service';

/**
 * Simple form backup hook for protecting against re-renders.
 * Saves form data to localStorage and restores it when the component re-mounts.
 */
export const useFormPersistence = (storageKey: string) => {
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Saves current form data to localStorage
   */
  const saveFormData = useCallback(() => {
    if (!isOnClient() || !formRef.current) return;

    try {
      const formData = new FormData(formRef.current);
      const data = formDataToObject(formData);

      // Also capture checkbox states (FormData doesn't include unchecked checkboxes)
      const checkboxes = formRef.current.querySelectorAll(
        'input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        const input = checkbox as HTMLInputElement;
        data[input.name] = input.checked;
      });

      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  }, [storageKey]);

  /**
   * Restores form data from localStorage
   */
  const restoreFormData = useCallback(() => {
    if (!isOnClient() || !formRef.current) return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const data = JSON.parse(stored);

      // Restore each field value
      Object.entries(data).forEach(([key, value]) => {
        const element = formRef.current?.elements.namedItem(
          key
        ) as HTMLInputElement;
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = Boolean(value);
          } else {
            element.value = String(value || '');
          }
        }
      });
    } catch (error) {
      console.warn('Failed to restore form data:', error);
    }
  }, [storageKey]);

  /**
   * Clears the saved form data (call after successful submit)
   */
  const clearFormData = useCallback(() => {
    if (!isOnClient()) return;
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Restore data when component mounts
  useEffect(() => {
    if (formRef.current) {
      setTimeout(restoreFormData, 0);
    }
  }, [restoreFormData]);

  // Auto-save on any form changes
  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    const handleChange = () => saveFormData();

    form.addEventListener('input', handleChange);
    form.addEventListener('change', handleChange);

    // eslint-disable-next-line consistent-return
    return () => {
      form.removeEventListener('input', handleChange);
      form.removeEventListener('change', handleChange);
    };
  }, [saveFormData]);

  return {
    formRef,
    clearFormData,
  };
};
