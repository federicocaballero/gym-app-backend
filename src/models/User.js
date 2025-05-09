const pool = require("../config/db");
const tabla = "usuarios";
exports.mostrarRolPorId = async (idAuthSupabase) => {
    const { rows } = await pool.query(`SELECT idperfil FROM ${tabla} where id_auth_supabase = $1`, [idAuthSupabase]);
    return rows[0]?.idperfil
}
exports.registerInPostgreSQL = async (userData) => {
    //TODO crear procedimiento almacenado
    const query = `
        INSERT INTO ${tabla} (
            idperfil,
            id_auth_supabase,
            nombre,
            apellido,
            usuario,
            email,
            eliminado,
            dni,
            fechanacimiento,
            telefono
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING 
            id,
            idperfil,
            id_auth_supabase,
            nombre,
            apellido,
            usuario,
            email,
            dni,
            fechanacimiento,
            telefono
    `;

    const values = [
        userData.idperfil,
        userData.id_auth_supabase,
        userData.nombre,
        userData.apellido,
        userData.usuario,
        userData.email,
        false,
        userData.dni,
        userData.fechanacimiento,
        userData.telefono
    ];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Error en PostgreSQL:", error);
        throw error;
    }
}

exports.obtenerPerfiles = async () => {
    const { rows } = await pool.query(`SELECT * FROM perfil ORDER BY id ASC`);
    return rows
}