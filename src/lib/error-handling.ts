import { NextApiResponse } from 'next';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const handleError = (res: NextApiResponse, error: Error | ApiError) => {
  console.error('API Error:', error);

  const status = (error as ApiError).status || 500;
  const message = error.message || 'Internal server error';
  const code = (error as ApiError).code || 'INTERNAL_ERROR';

  return res.status(status).json({
    error: {
      message,
      code,
    },
  });
};
