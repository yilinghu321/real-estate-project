export const errorHandler = (statusCode, massage) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
}