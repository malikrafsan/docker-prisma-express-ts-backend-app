const DEFAULT_ACCESS_TOKEN_SECRET = 'default-access-token-secret';
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || DEFAULT_ACCESS_TOKEN_SECRET;

export { accessTokenSecret };
