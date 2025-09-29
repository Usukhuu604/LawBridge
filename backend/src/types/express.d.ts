declare namespace Express {
  export interface Request {
    // This allows us to attach the auth user to the request object
    auth?: {
      userId: string;
      username?: string;
      role?: string;
      clientId?: string;
      lawyerId?: string;
    };
  }
}
