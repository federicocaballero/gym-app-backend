const supabase = require("../config/supabase");
const authModel = require("../models/User");
exports.signUpNewEmail = async (req, res, next) => {
    // 1. Validación y preparación de datos
    const requiredFields = ['idperfil', 'nombre', 'apellido', 'usuario', 'contraseña', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
        });
    }
    let supabaseUser;
    const {
        idperfil,
        nombre,
        apellido,
        usuario,
        contraseña,
        email,
        dni,
        fechanacimiento,
        telefono
    } = req.body;

    try {
        // 1. Registrar en Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password: contraseña,
            options: {
                data: {
                    nombre,
                    apellido,
                    usuario
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                message: "Error en autenticación",
                error: authError.message
            });
        }

        supabaseUser = data.user; // Asignamos el usuario de Supabase

        // 3. Registrar en PostgreSQL
        console.log('Datos a insertar en PostgreSQL:', userData);
        const registeredUser = await authModel.registerInPostgreSQL({
            idperfil,
            id_auth_supabase: supabaseUser.id,
            nombre,
            apellido,
            usuario,
            email,
            dni,
            fechanacimiento,
            telefono,
            eliminado: false
        });

        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            user: {
                ...registeredUser,
                auth_id: supabaseUser.id
            }
        });
    } catch (error) {
        // Revertir registro en Supabase si existe
        if (supabaseUser?.id) {
            await supabase.auth.admin.deleteUser(supabaseUser.id)
                .catch(err => console.error('Error al revertir registro:', err));
        }
        next(error);
    }
};

exports.signInNewSession = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(400).json({ message: "Error al iniciar sesión: ", error });
    res.status(200).json({ session: data.session });
}

