const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const PORT = process.env.DB_PORT || 3000;
const options = {
    definition: {
        openapi: "3.0.4",
        info: {
            title: "NorTech API",
            version: "1.0.0",
            description: "Esta es la documentacion de endpoints del backend del proyecto NorTech, un ABM de productos con creacion de usuarios y login",
            contact: {
                email: "fedecaballero1234@gmail.com"
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local",
            },
            {
                description: "Servidor de produccion. Agrega tu dominio",
                url: "https://tudominio.com"
            }
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        idperfil: {
                            type: "integer",
                            description: "tipo de perfil: admin o user",
                        },
                        id_auth_supabase: {
                            type: "integer",
                            description: "ID del usuario en Supabase",
                        },
                        nombre: {
                            type: "string",
                            description: "Nombre del usuario",
                        },
                        apellido: {
                            type: "string",
                            description: "Apellido del usuario",
                        },
                        usuario: {
                            type: "string",
                            description: "Usuario del usuario",
                        },
                        dni: {
                            type: "number",
                            description: "DNI del usuario",
                        },
                        fechanacimiento: {
                            type: "Date",
                            description: "Fecha de nacimiento del usuario",
                        },
                        telefono: {
                            type: "number",
                            description: "Telefono del usuario",
                        },
                        id: {
                            type: "integer",
                            description: "ID del usuario",
                        },
                        email: {
                            type: "string",
                            description: "Correo electrónico del usuario",
                        },
                        password: {
                            type: "string",
                            description: "Contraseña del usuario",
                        },
                        role: {
                            type: "string",
                            description: "Rol del usuario",
                        },
                        eliminado: {
                            type: "boolean",
                            description: "Indica si el usuario está eliminado",
                        },

                    },
                },
                Proucto: {
                    type: "object",
                    properties: {
                        nombre: {
                            type: "string",
                            description: "Nombre del producto"
                        },
                        descripcion: {
                            type: "string",
                            description: "Descripcion del producto"
                        },
                        precio_costo: {
                            type: "number",
                            description: "Precio de costo del producto"
                        },
                        precio_venta: {
                            type: "number",
                            description: "Precio de venta del producto"
                        },
                        stock: {
                            type: "number",
                            description: "Stock del producto"
                        },
                        stock_min: {
                            type: "number",
                            description: "Stock minimo del producto"
                        },
                        idMarca: {
                            type: "number",
                            description: "ID de la marca del producto"
                        },
                        idCategoria: {
                            type: "number",
                            description: "ID de la categoria del producto"

                        },
                        imagen: {
                            type: "string",
                            description: "URL de la imagen del producto"
                        }
                    }

                }
            },
        },
        
    },
    
    apis: ["./src/routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(options);

const setupSwaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger Docs disponible en: http://localhost:5432/api-docs");
}

module.exports = setupSwaggerDocs;