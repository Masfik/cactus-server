export const config = {
    web: {
        port: process.env.WEB_PORT  ||  3000
    },
    database: {
        host: process.env.DB_HOST   ||  "localhost",
        port: process.env.DB_PORT   ||  27017,
        name: process.env.DB_NAME   ||  "gatto_ninja"
    }
};