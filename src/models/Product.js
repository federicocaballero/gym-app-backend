const pool = require("../config/db");
const tabla = "public.productos"
exports.mostrarProductosTodos = async () => {
    const { rows } = await pool.query("SELECT * FROM productos");
    return rows
}

exports.mostrarProductoPorId = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM ${tabla} where id = $1`, [id]);
    return rows[0]
}

exports.crearProducto = async ({
    nombre,
    imagen,
    marca,
    descripcion,
    precio_costo,
    precio_venta,
    stock,
    stock_min,
    eliminado,
    idCategoria
}) => {
    const { rows } = await pool.query(
        `INSERT INTO ${tabla}
      (nombre, imagen, marca, descripcion, precio_costo, precio_venta, stock, stock_min, eliminado, "idCategoria")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
        [nombre, imagen, marca, descripcion, precio_costo, precio_venta, stock, stock_min, eliminado, idCategoria]
    );
    return rows[0];
};


exports.editarProducto = async (name, price, imagen, id) => {
    const { rows } = await pool.query(`UPDATE ${tabla} SET name = $1, price = $2, imagen = $3 WHERE id = $4 RETURNING *`, [name, price, imagen, id]);
    return rows[0]
}

//TODO: implementar baja logica sin borrar completamente de la BD
//TODO: implementar alta de producto por id
//TODO: recuperar productos por estado (activo o inactivo)
exports.eliminarProducto = async (id) => {
    const { rows } = await pool.query(`DELETE FROM ${tabla} WHERE id = $1 RETURNING *`, [id]);
    return rows[0]
}