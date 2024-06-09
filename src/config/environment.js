module.exports = {
  config: {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
    JWT_SECRET_EXPIRATION: process.env.JWT_SECRET_EXPIRATION,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION
  }
}