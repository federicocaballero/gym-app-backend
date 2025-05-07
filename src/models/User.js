const pool = require("../config/db");
const tabla = "usuarios";
exports.mostrarRolPorId = async (idAuthSupabase) => {
    const { rows } = await pool.query(`SELECT idperfil FROM ${tabla} where id_auth_supabase = $1`, [idAuthSupabase]);
    return rows[0]?.idperfil
}

exports.registerInPostgreSQL = async (userData) => {
    const query = `
        INSERT INTO ${tabla} (
            idPerfil,
            id_auth_supabase,
            nombre,
            apellido,
            usuario,
            email,
            eliminado,
            dni,
            fechaNacimiento,
            telefono
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING 
            id,
            idPerfil,
            id_auth_supabase,
            nombre,
            apellido,
            usuario,
            email,
            dni,
            fechaNacimiento,
            telefono
    `;


    const values = [
        userData.idPerfil,
        userData.id_auth_supabase,
        userData.nombre,
        userData.apellido,
        userData.usuario,  // Cambiado de 'username' a 'usuario'
        userData.email,
        false,  // Valor por defecto para 'eliminado'
        userData.dni,
        userData.fechaNacimiento,  // Cambiado de 'fecha_nacimiento'
        userData.telefono  // Sin acento
    ];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Error en PostgreSQL:", error);
        throw error;
    }
}