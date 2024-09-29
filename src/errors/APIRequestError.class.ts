export class APIRequestError extends Error {
    public statusCode: number | null;
    public originalError: Error;
  
    constructor(message: string, statusCode: number | null, originalError: Error) {
      super(message);
      this.name = 'APIRequestError';
      this.statusCode = statusCode;
      this.originalError = originalError;
    }
  }
