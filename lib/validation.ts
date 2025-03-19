import { NextApiRequest } from 'next';
import { z } from 'zod';

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function validateRequest<T>(
  req: NextApiRequest,
  schema: z.Schema<T>
): Promise<ValidationResult<T>> {
  try {
    const data = await schema.parseAsync(req.body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => e.message).join(', ')
      };
    }
    return { success: false, error: 'Invalid request data' };
  }
} 