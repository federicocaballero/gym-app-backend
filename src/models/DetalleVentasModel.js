const pool = require("../config/db");
const tabla = "detalle_venta";

exports.crearDetalleVenta = async (id_venta, id_producto, descripcion, precio_venta, cantidad, total) => {
    const { rows } = await pool.query(`INSERT INTO ${tabla} (id_venta, id_producto, descripcion, precio_venta, cantidad, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [id_venta, id_producto, descripcion, precio_venta, cantidad, total]);
    return rows[0]
}

exports.mostrarDetallePorIdVenta = async (id_venta) => {
    const { rows } = await pool.query(`SELECT * FROM ${tabla} where id_venta = $1`, [id_venta]);
    return rows[0]
}
