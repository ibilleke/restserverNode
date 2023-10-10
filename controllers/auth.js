import { response } from "express"
import bcrypt from "bcrypt"
import Usuario from "../models/usuario.js"
import generarJWT from "../helpers/generar-jwt.js"

const login = async(req, res) => {
    const { correo, contraseña } = req.body

    try {
        // Se obtiene el correo
        const usuario = await Usuario.findOne({correo})

        // Verificar si el correo existe
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correcctos - correo'
            })
        }

        // Verificar el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correcctos - estado'
            })
        }

        // Verificar la contraseña que este correcta
        const validarContraseña = bcrypt.compareSync(contraseña, usuario.contraseña)
        if(!validarContraseña) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correcctos - Contraseña'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })       
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

export { login }