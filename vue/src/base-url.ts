export const baseURL: string =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:5000' // TODO: staging now, configure for both such configurations
    : 'http://localhost:21021';
