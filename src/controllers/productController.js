const {
    crearProducto,
    mostrarProductosTodos,
    editarProducto,
    eliminarProducto,
    mostrarProductoPorId,
    altaProducto,
    obtenerActivos,
    obtenerInactivos,
    obtenerCategorias
} = require("../models/Product");

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
        // Validaciones básicas
        const { nombre, precio_costo, precio_venta, idMarca, stock, stock_min, imagen } = req.body;
        if (idMarca === undefined || idMarca === null) {
            return res.status(400).json({ error: 'El campo idMarca es requerido' });
        }
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre del producto es requerido' });
        }

        if (precio_costo <= 0 || precio_venta <= 0) {
            return res.status(400).json({ error: 'Los precios deben ser mayores que cero' });
        }

        if (precio_venta < precio_costo) {
            return res.status(400).json({ error: 'El precio de venta no puede ser menor al precio de costo' });
        }

        if (idMarca < 1 || idMarca > 5) {
            return res.status(400).json({ error: 'El ID de idMarca debe estar entre 1 y 5' });
        }

        if (stock < 0 || stock_min < 0) {
            return res.status(400).json({ error: 'Los valores de stock no pueden ser negativos' });
        }

        if (!imagen || imagen.trim() === '') {
            return res.status(400).json({ error: 'La URL de la imagen es requerida' });
        }

        // Llamada al modelo
        const producto = await crearProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await eliminarProducto(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.reactivateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await altaProducto(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    //TODO: agregar validaciones y atributos que se pueden editar
    const { id } = req.params;
    const {
        nombre,
        imagen,
        idMarca,
        descripcion,
        precio_costo,
        precio_venta,
        stock,
        stock_min,
        idCategoria } = req.body;
    try {
        const response = await editarProducto(
            nombre,
            imagen,
            idMarca,
            descripcion,
            precio_costo,
            precio_venta,
            stock,
            stock_min,
            idCategoria,
            id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.getActiveProducts = async (req, res, next) => {
    try {
        const result = await obtenerActivos();
        res.status(200).json(result);
    } catch (error) {
        next(error); 
    }
}

exports.getInactiveProducts = async (req, res, next) => {
    try {
        const result = await obtenerInactivos();
        res.status(200).json(result);
    } catch (error) {
        next(error); 
    }
}

exports.getCategories = async (req, res, next) => {
    try {
        const result = await obtenerCategorias();
        res.status(200).json(result);
    } catch (error) {
        next(error); 
    }
}