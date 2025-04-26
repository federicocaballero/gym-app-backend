const supabase = require("../config/supabase");
exports.signUpNewEmail = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return res.status(400).json({ message: "Error al registrar el usuario" });
    res.status(200).json({ user: data.user });
}

exports.signInNewSession = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(400).json({ message: "Error al iniciar sesión: ", error });
    res.status(200).json({ session: data.session });
}

