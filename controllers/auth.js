import { json, response } from "express"
import bcrypt from "bcrypt"
import Usuario from "../models/usuario.js"
import generarJWT from "../helpers/generar-jwt.js"
import googleVerify from "../helpers/google-verify.js"

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

const googleSignIn = async(req, res) => {
    const { id_token } = req.body

    try {
        const { nombre, imagen, correo } = await googleVerify( id_token )

        let usuario = await Usuario.findOne({correo})

        // Se verifica si el usuario existe o es el primer ingreso
        if(!usuario) {
            // Crea el usuario si es el primer ingreso
            const data = {
                nombre,
                correo,
                contraseña: '',
                imagen,
                google: true

            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        // Si el usuario de db
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario desactivado'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
           usuario,
           token
        })        
    } catch (error) {
        json.status(401).json({
            ok: false,
            msg: 'El token no se puede verificar'
        })
    }
}

export { login, googleSignIn }