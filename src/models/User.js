const pool = require("../config/db");
const tabla = "users";
exports.mostrarRolPorId = async (idAuthSupabase) => {
    const { rows } = await pool.query(`SELECT role FROM ${tabla} where id_auth_supabase = $1`, [idAuthSupabase]);
    return rows[0]?.role
}