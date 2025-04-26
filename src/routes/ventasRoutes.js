const express = require("express");
const router = express.Router();

// Controladores
const { createVenta, getVentaPorIdUser, updateEstadoVenta } = require("../controllers/ventasController");
const { createDetalleVenta, getDetalleVentaPorIdVenta } = require("../controllers/detalleVentasController");
const authenticate = require("../middlewares/authenticate");

// Rutas ventas
router.post("/", authenticate, createVenta);
router.put("/:id", authenticate, updateEstadoVenta);
router.get("/:id", getVentaPorIdUser);

// Rutas detalle ventas
router.post("/item/:id", authenticate, createDetalleVenta);
router.get("/detalle/:id_usuario", getDetalleVentaPorIdVenta);

module.exports = router;