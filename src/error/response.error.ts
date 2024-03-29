class ResponseError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export { ResponseError };
