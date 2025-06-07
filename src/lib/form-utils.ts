import { z } from 'zod';
import { toast } from 'sonner';
import React from 'react';

// Types
type FormErrors = Record<string, string>;
type FormResult<T> = { data: T | null; errors: FormErrors; isValid: boolean };

/**
 * Validates form data against a Zod schema
 */
export function validateForm<T>(
  schema: z.ZodType<T>,
  formData: FormData | Record<string, unknown>
): FormResult<T> {
  try {
    // Convert FormData to object if needed
    const formValues = formData instanceof FormData 
      ? Object.fromEntries(formData.entries())
      : formData;

    // Parse and validate the data
    const result = schema.safeParse(formValues);
    
    if (result.success) {
      return { data: result.data, errors: {}, isValid: true };
    }
    
    // Format validation errors
    const errors = result.error.errors.reduce<FormErrors>((acc, err) => {
      const path = err.path.join('.');
      acc[path] = err.message;
      return acc;
    }, {});
    
    return { data: null, errors, isValid: false };
  } catch (error) {
    console.error('Validation error:', error);
    return { 
      data: null, 
      errors: { form: 'An unexpected error occurred' }, 
      isValid: false 
    };
  }
}

/**
 * Handles form errors and displays them as toasts
 */
export function handleFormError(
  error: unknown,
  defaultMessage = 'An error occurred while processing your request.'
) {
  console.error('Form error:', error);
  
  if (error instanceof z.ZodError) {
    const message = error.errors.map(err => err.message).join('\n');
    toast.error(message);
    return { errors: error.errors };
  }
  
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  toast.error(errorMessage);
  return { errors: { form: errorMessage } };
}

type FieldErrorProps = {
  field: string;
  errors?: FormErrors;
  className?: string;
};

/**
 * Displays a form field error message
 */
export function FieldError({ field, errors, className = '' }: FieldErrorProps) {
  const errorMessage = errors?.[field];
  if (!errorMessage) return null;
  
  return React.createElement(
    'p',
    { className: `mt-1 text-sm text-red-600 ${className}` },
    errorMessage
  );
}

/**
 * Gets standard props for a form field
 */
export function getFieldProps(
  name: string,
  errors?: FormErrors
) {
  const hasError = Boolean(errors?.[name]);
  return {
    name,
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': hasError ? `${name}-error` : undefined,
    className: hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
  };
}

// Form schema helpers
export const formSchemas = {
  email: (message = 'Valid email is required') =>
    z.string().min(1, message).email(message),
    
  password: (min = 8, max = 50) =>
    z.string()
      .min(min, `Password must be at least ${min} characters`)
      .max(max, `Password must be less than ${max} characters`)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, 
        'Must include uppercase, lowercase, number, and special character'
      ),
  
  confirmPassword: (field = 'password') => 
    z.string()
      .min(1, 'Please confirm your password')
      .refine(
        (val, ctx) => {
          const parent = ctx as unknown as { parent: Record<string, unknown> };
          return val === parent.parent[field];
        },
        { message: 'Passwords do not match' }
      ),
  
  name: (field = 'Name', max = 100) => 
    z.string()
      .min(1, `${field} is required`)
      .max(max, `${field} must be less than ${max} characters`),
      
  phone: () => 
    z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(20, 'Phone number must be less than 20 digits')
      .regex(/^[0-9+()\-\s]+$/, 'Invalid phone number format'),
};

// Form field component props
type FormFieldProps = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time' | 'datetime-local' | 'url' | 'search';
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
};

/**
 * Creates a form field configuration object
 */
export function createFormField({
  name,
  label,
  type = 'text',
  description,
  placeholder,
  required = true,
  disabled = false,
  autoComplete,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
}: FormFieldProps) {
  return {
    name,
    type,
    label,
    description,
    placeholder: placeholder || `Enter ${label.toLowerCase()}`,
    required,
    disabled,
    autoComplete,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
  };
}
