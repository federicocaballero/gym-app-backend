const pool = require("../config/db");
const tabla = "usuarios";
exports.mostrarRolPorId = async (idAuthSupabase) => {
    console.log("🚀 ~ exports.mostrarRolPorId= ~ idAuthSupabase:", idAuthSupabase)
    const { rows } = await pool.query(`SELECT "idPerfil" FROM ${tabla} where id_auth_supabase = $1`, [idAuthSupabase]);
    return rows[0]?.idPerfil
}