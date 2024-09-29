export class AuthError extends Error {
    public originalError: Error;
  
    constructor(message: string, originalError: Error) {
      super(message);
      this.name = 'AuthError';
      this.originalError = originalError;
    }
  }