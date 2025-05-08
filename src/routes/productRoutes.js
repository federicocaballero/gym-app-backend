const express = require("express");
const router = express.Router();

// Controladores
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct,
    getActiveProducts,
    getInactiveProducts
} = require("../controllers/productController");

// Middlewares
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

// Rutas
// Necesitan autenticacion
router.post("/", authenticate, isAdmin, createProduct);
router.put("/:id", authenticate, isAdmin, updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct);
router.post("/:id", authenticate, isAdmin, reactivateProduct);
router.get("/inactiveProducts", authenticate, isAdmin, getInactiveProducts);

//No necesitan autenticacion
router.get("/", getProducts);
router.get("/active", getActiveProducts);
router.get("/:id", getProduct);
module.exports = router;