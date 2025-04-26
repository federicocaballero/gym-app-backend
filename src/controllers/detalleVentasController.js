const { crearDetalleVenta, mostrarDetallePorIdVenta } = require("../models/DetalleVentasModel");
const { mostrarVentaPorIdUser } = require("../models/VentasModel");
exports.getDetalleVentaPorIdVenta = async (req, res, next) => {
    const { id_venta } = req.params;
    try {
        const response = await mostrarDetallePorIdVenta(id_venta);
        res.status(200).json(response);
    } catch (error) {
        next(error); //Pasa el error al manejador de errores (middleware errorHandler)
    }
}


exports.createDetalleVenta = async (req, res, next) => {
    // const user_id = req.user.id //rescata el id de supabase del usuario
    const user_id = req.params.id_usuario
    const { id_producto, descripcion, precio_venta, cantidad, total } = req.body;
    try {
        const venta = await mostrarVentaPorIdUser(user_id);
        if (!venta) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        const response = await crearDetalleVenta(venta.id, id_producto, descripcion, precio_venta, cantidad, total);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}
