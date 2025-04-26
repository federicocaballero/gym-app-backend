const { crearVenta, esditarEstadoVenta, mostrarVentaPorIdUser } = require("../models/VentasModel");

exports.createVenta = async (req, res, next) => {
    const { id_usuario, estado, total } = req.body;
    try {
        const response = await crearVenta(id_usuario, estado, total);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}
exports.getVentaPorIdUser = async (req, res, next) => {
    const { id_usuario } = req.params;
    try {
        const response = await mostrarVentaPorIdUser(id_usuario);
        res.status(200).json(response);
    } catch (error) {
        next(error); //Pasa el error al manejador de errores (middleware errorHandler)
    }
}

exports.updateEstadoVenta = async (req, res, next) => {
    const { id } = req.params; //id de la venta
    const { estado } = req.body; //estado de la venta
    try {
        const response = await esditarEstadoVenta(estado, id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
