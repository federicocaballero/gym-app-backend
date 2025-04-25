const { Pool } = require("pg")
const fs = require("fs")
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync("src/config/ca.crt").toString()
    }
})

pool.connect((error, client, release) => {
    if (error) {
        console.log("error de conexion", error.stack);
    }else{
        console.log("conexion exitosa");
        release();
    }
})

module.exports = pool