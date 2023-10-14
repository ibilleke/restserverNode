import express from "express"
import cors from "cors"
import dbConnetion from "../db/config.js"
import routerAuth from "../routes/auth.js"
import routerBusqueda from "../routes/buscar.js"
import routerCategoria from "../routes/categorias.js"
import routerProductos from "../routes/productos.js"
import router from "../routes/usuarios.js"

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT || 3000

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios'
        }

        // Conectar a la base de datos
        this.conectarDB()
        
        // Middlewares
        this.middlewares()

        // Rutas de mi app
        this.routes()
    }

    async conectarDB() {
        await dbConnetion()
    }

    middlewares() {
        // CORS
        this.app.use(cors())
        // Lectura y parseo
        this.app.use(express.json())
        // Directorio Público
        this.app.use(express.static('public'))
    }

    routes () {
        this.app.use(this.paths.auth, routerAuth)
        this.app.use(this.paths.buscar, routerBusqueda)
        this.app.use(this.paths.categorias, routerCategoria)
        this.app.use(this.paths.productos, routerProductos)
        this.app.use(this.paths.usuarios, router)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', `${this.port} // URL: http://localhost:${this.port}/` )
        })
    }
}

export { Server }
