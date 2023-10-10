import express from "express"
import cors from "cors"
import dbConnetion from "../db/config.js"
import router from "../routes/usuarios.js"
import routerAuth from "../routes/auth.js"

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT || 3000

        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

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
        this.app.use(this.authPath, routerAuth)
        this.app.use(this.usuariosPath, router)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        })
    }
}

export default Server
