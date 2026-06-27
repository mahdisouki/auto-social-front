type ErrorWithResponse = {
  response?: { data?: { message?: string } };
  message?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  const err = error as ErrorWithResponse;
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (typeof err?.message === 'string' && err.message) {
    return err.message;
  }

  return fallback;
}
