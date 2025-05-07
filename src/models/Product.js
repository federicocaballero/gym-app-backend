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
//TODO: recuperar productos por estado (activo o inactivo)
//TODO: actualizar modelo para editar producto por id
exports.editarProducto = async (name, price, imagen, id) => {
    const { rows } = await pool.query(`UPDATE ${tabla} SET name = $1, price = $2, imagen = $3 WHERE id = $4 RETURNING *`, [name, price, imagen, id]);
    return rows[0]
}