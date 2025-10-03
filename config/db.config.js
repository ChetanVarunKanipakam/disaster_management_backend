export default{
  HOST: "localhost",
  USER: "postgres", // Your PostgreSQL username
  PASSWORD: "Chetan12@", // Your PostgreSQL password
  DB: "disaster_response_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};