declare namespace Express {
  export interface Request {
    user: {
      id: string,
      avatar: string,
      name: string,
      email: string,
    }
  }
}