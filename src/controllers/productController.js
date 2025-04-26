const { crearProducto, mostrarProductosTodos, editarProducto, eliminarProducto, mostrarProductoPorId } = require("../models/Product");

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mostrarProductosTodos();
        res.status(200).json(result);
    } catch (error) {
        next(error); //Pasa el error al manejador de errores (middleware errorHandler)
    }
}

exports.getProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await mostrarProductoPorId(id);
        res.status(200).json(response);
    } catch (error) {
        next(error); //Pasa el error al manejador de errores (middleware errorHandler)
    }
}


exports.createProduct = async (req, res, next) => {
    try {
        const producto = await crearProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, price, imagen } = req.body;
    try {
        const response = await editarProducto(name, price, imagen, id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await eliminarProducto(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}