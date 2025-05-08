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
    idMarca,
    descripcion,
    precio_costo,
    precio_venta,
    stock,
    stock_min
}) => {
    const { rows } = await pool.query(`SELECT * FROM sp_crear_producto($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            nombre,
            descripcion,
            precio_costo,
            precio_venta,
            stock,
            stock_min,
            idMarca,
            imagen
        ]);
    return rows[0];
};
exports.eliminarProducto = async (id) => {
    const { rows } = await pool.query(`
        UPDATE ${tabla} 
        SET eliminado = true 
        WHERE id = $1 
        RETURNING *
        `, [id]);
    return rows[0]
}
exports.altaProducto = async (id) => {
    const { rows } = await pool.query(`
        UPDATE ${tabla} 
        SET eliminado = false 
        WHERE id = $1 
        RETURNING *
        `, [id]);
    return rows[0]
}
exports.editarProducto = async (nombre, imagen, idMarca, descripcion, precio_costo, precio_venta, stock, stock_min, idCategoria, id) => {
    const { rows } = await pool.query(`UPDATE ${tabla} SET 
        nombre = $1, 
        imagen = $2, 
        "idMarca" = $3, 
        descripcion = $4, 
        precio_costo = $5, 
        precio_venta = $6, 
        stock = $7, 
        stock_min = $8, 
        "idCategoria" = $9 
        WHERE id = $10 
        RETURNING * `,
        [nombre, imagen, idMarca, descripcion, precio_costo, precio_venta, stock, stock_min, idCategoria, id]);
    return rows[0]
}
exports.obtenerActivos = async () => {
    const { rows } = await pool.query(`SELECT * FROM ${tabla} WHERE eliminado = false ORDER BY id ASC`);
    return rows
}
exports.obtenerInactivos = async () => {
    const { rows } = await pool.query(`SELECT * FROM ${tabla} WHERE eliminado = true ORDER BY id ASC`);
    return rows
}