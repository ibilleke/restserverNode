import { response, request } from "express"
import jwt from "jsonwebtoken"
import Usuario from "../models/usuario.js"

const validarJWT = async(req, res, next) => {

    const token = req.header('x-token')

    if(!token) {
        return res.status(401).json({
            msg: 'No existe el token'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        // Leer el usario que correspone al uid
        const usuario = await Usuario.findById(uid)

        // Vririfica si el usuario existe en la db
        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            })
        }

        // Verificar si el uid esta activo
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido - usuario desactivado'
            })
        }

        req.usuario = usuario

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

export { validarJWT }