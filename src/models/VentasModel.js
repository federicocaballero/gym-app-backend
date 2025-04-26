const pool = require("../config/db");
const tabla = "venta";

exports.crearVenta = async (id_usuario, estado, total) => {
    const { rows } = await pool.query(`INSERT INTO ${tabla} (id_usuario, estado, total) VALUES ($1, $2, $3) RETURNING *`, [id_usuario, estado, total]);
    return rows[0]
}

exports.mostrarVentaPorIdUser = async (id_user) => {
    const { rows } = await pool.query(`SELECT * FROM ${tabla} where id_usuario = $1`, [id_user]);
    return rows[0]
}

exports.esditarEstadoVenta = async (estado, id) => {
    const { rows } = await pool.query(`UPDATE ${tabla} SET estado = $1,  WHERE id = $2 RETURNING *`, [estado, id]);
    return rows[0]
}