import { NextApiRequest } from 'next';

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export const validateRequest = (req: NextApiRequest, requiredFields: string[] = []): ValidationResult => {
  const errors: string[] = [];

  // Validate HTTP method
  if (!req.method) {
    errors.push('HTTP method is required');
  }

  // Validate required fields in body
  if (requiredFields.length > 0 && req.body) {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}; 