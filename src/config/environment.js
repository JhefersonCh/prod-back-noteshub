module.exports = {
  config: {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
    JWT_SECRET_EXPIRATION: process.env.JWT_SECRET_EXPIRATION,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOSTPG: process.env.DB_HOSTPG,
    DB_PORT: process.env.DB_PORT,
    HOST: process.env.HOST
  }
}