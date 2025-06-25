import { useState, useCallback, useEffect } from 'react';
import { z, ZodTypeAny } from 'zod';
import { formatValidationError } from '@/lib/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodTypeAny;
  onSubmit: (values: T) => Promise<void> | void;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

interface FormHelpers<T> {
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  resetForm: (values?: Partial<T>) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldTouched: (name: keyof T, isTouched?: boolean) => void;
  setFieldError: (name: keyof T, message: string) => void;
  setErrors: (errors: Record<keyof T, string>) => void;
  setValues: (values: Partial<T>) => void;
  validateForm: () => Promise<boolean>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  onError,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>): [FormState<T>, FormHelpers<T>] {
  const [state, setState] = useState<FormState<T>>({
    values: { ...initialValues },
    errors: {} as Record<keyof T, string>,
    touched: {} as Record<keyof T, boolean>,
    isSubmitting: false,
    isValid: false,
    submitCount: 0,
  });

  // Validate form when values or validation schema changes
  const validateField = useCallback(
    async (name: keyof T, value: any): Promise<string> => {
      if (!validationSchema) return '';

      try {
        // Create a schema that only validates the current field
        const fieldSchema = z.object({
          [name]: validationSchema.shape[name as string],
        });

        // Validate the field
        await fieldSchema.parseAsync({ [name]: value });
        return '';
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedError = formatValidationError(error);
          return formattedError.details[name as string] || 'Invalid value';
        }
        return 'Validation error';
      }
    },
    [validationSchema]
  );

  // Validate the entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    try {
      await validationSchema.parseAsync(state.values);
      setState((prev) => ({
        ...prev,
        errors: {} as Record<keyof T, string>,
        isValid: true,
      }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedError = formatValidationError(error);
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            ...formattedError.details,
          },
          isValid: false,
        }));
      }
      return false;
    }
  }, [validationSchema, state.values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        submitCount: prev.submitCount + 1,
      }));

      try {
        // Mark all fields as touched
        const touchedFields = Object.keys(state.values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        ) as Record<keyof T, boolean>;

        setState((prev) => ({
          ...prev,
          touched: { ...prev.touched, ...touchedFields },
        }));

        // Validate form
        const isValid = await validateForm();
        if (!isValid) {
          throw new Error('Form validation failed');
        }

        // Submit form
        await onSubmit(state.values);
        onSuccess?.(state.values);
      } catch (error) {
        console.error('Form submission error:', error);
        onError?.(error as Error);
      } finally {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
      }
    },
    [onSubmit, onSuccess, onError, state.values, validateForm]
  );

  // Handle field changes
  const handleChange = useCallback(
    async (name: keyof T, value: any) => {
      const newValues = {
        ...state.values,
        [name]: value,
      };

      setState((prev) => ({
        ...prev,
        values: newValues,
      }));

      // Validate on change if enabled
      if (validateOnChange) {
        const error = await validateField(name, value);
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: error,
          },
        }));
      }
    },
    [state.values, validateField, validateOnChange]
  );

  // Handle field blur
  const handleBlur = useCallback(
    async (name: keyof T) => {
      setState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [name]: true,
        },
      }));

      // Validate on blur if enabled
      if (validateOnBlur) {
        const error = await validateField(name, state.values[name]);
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: error,
          },
        }));
      }
    },
    [state.values, validateField, validateOnBlur]
  );

  // Reset form
  const resetForm = useCallback((values: Partial<T> = {}) => {
    setState({
      values: { ...initialValues, ...values },
      errors: {} as Record<keyof T, string>,
      touched: {} as Record<keyof T, boolean>,
      isSubmitting: false,
      isValid: false,
      submitCount: 0,
    });
  }, [initialValues]);

  // Set field value
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      handleChange(name, value);
    },
    [handleChange]
  );

  // Set field touched
  const setFieldTouched = useCallback(
    (name: keyof T, isTouched = true) => {
      setState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [name]: isTouched,
        },
      }));
    },
    []
  );

  // Set field error
  const setFieldError = useCallback((name: keyof T, message: string) => {
    setState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: message,
      },
    }));
  }, []);

  // Set multiple errors
  const setErrors = useCallback((errors: Record<keyof T, string>) => {
    setState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        ...errors,
      },
    }));
  }, []);

  // Set multiple values
  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        ...values,
      },
    }));
  }, []);

  // Effect to validate form when values change and validateOnChange is true
  useEffect(() => {
    if (validateOnChange) {
      validateForm();
    }
  }, [state.values, validateForm, validateOnChange]);

  return [
    state,
    {
      handleChange,
      handleBlur,
      handleSubmit,
      resetForm,
      setFieldValue,
      setFieldTouched,
      setFieldError,
      setErrors,
      setValues,
      validateForm,
    },
  ];
}

// Helper hook for form fields
export function useField<T extends Record<string, any>>(
  form: [FormState<T>, FormHelpers<T>],
  name: keyof T
) {
  const [state, helpers] = form;
  const { values, errors, touched } = state;
  const { handleChange, handleBlur, setFieldTouched } = helpers;

  return {
    value: values[name],
    error: touched[name] ? errors[name] : undefined,
    onChange: (value: any) => handleChange(name, value),
    onBlur: () => handleBlur(name),
    setTouched: (isTouched = true) => setFieldTouched(name, isTouched),
  };
}
