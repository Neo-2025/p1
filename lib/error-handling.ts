import { NextApiResponse } from 'next';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown, res: NextApiResponse): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error'
  });
} 