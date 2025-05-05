const supabase = require("../config/supabase");
// exports.signUpNewEmail = async (req, res) => {
//     const { email, password } = req.body;
//     const { data, error } = await supabase.auth.signUp({ email, password })
//     if (error) return res.status(400).json({ message: "Error al registrar el usuario" });
//     res.status(200).json({ user: data.user });
// }

exports.signUpNewEmail = async (req, res) => {
    let supabaseUser;
    const {
        idPerfil,
        nombre,
        apellido,
        usuario,
        contraseña,
        email,
        dni,
        fechaNacimiento,
        telefono
    } = req.body;

    try {
        // 1. Registrar en Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password: contraseña,
            options: {
                data: {  // Datos que se guardarán en auth.users
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

        // 2. Preparar datos para PostgreSQL
        const userData = {
            idPerfil,  // Nombre exacto de la tabla
            id_auth_supabase: supabaseUser.id,  // Nombre exacto de la tabla
            nombre,
            apellido,
            usuario,  // Nombre exacto de la tabla
            email,
            dni,
            fechaNacimiento,  // Nombre exacto de la tabla
            telefono,
            eliminado: false  // Campo requerido por la tabla
        };

        // 3. Registrar en PostgreSQL
        const registeredUser = await authModel.registerInPostgreSQL(userData);

        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            user: {
                ...registeredUser,
                auth_id: supabaseUser.id
            }
        });

    } catch (error) {
        console.error()
        // Revertir registro en Supabase si existe
        if (authData?.user?.id) {
            await supabase.auth.admin.deleteUser(authData.user.id);
        }

        res.status(500).json({
            success: false,
            message: "Error en el registro",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.signInNewSession = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(400).json({ message: "Error al iniciar sesión: ", error });
    res.status(200).json({ session: data.session });
}

