import { useState } from 'react';

type ErrorItem = {
  property: string;
  errors: string[];
};

type Errors = {
  username?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
  code?: string[];
  captcha?: string[];
  error?: string;
  comment?: string[];
  [key: string]: string[] | undefined | string;
};

export function useErrorHandler(initialErrors: Errors = {}) {
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const handleError = (err: { message?: unknown }) => {
    if (Array.isArray(err?.message)) {
      const newErrors: Errors = {};

      (err.message as ErrorItem[]).forEach((item) => {
        newErrors[item.property] = item.errors;
      });

      setErrors(newErrors);
    } else {
      setErrors({ error: 'Error((((' });
    }
  };

  const resetErrors = () => setErrors({});

  return { errors, handleError, resetErrors };
}