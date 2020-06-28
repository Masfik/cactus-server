const env = process.env;

export const config = {
  web: {
    port: env.WEB_PORT || 3000,
  },
  database: {
    host: env.DB_HOST || "localhost",
    port: env.DB_PORT || 27017,
    name: env.DB_NAME || "cactus",
  },
  firebase: {
    databaseURL: env.FIREBASE_DATABASE_URL,
  },
};
