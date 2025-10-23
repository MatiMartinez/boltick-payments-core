export interface RegisterUserInput {
  authToken: string;
}

export interface RegisterUserOutput {
  success: number;
  message: string;
}
