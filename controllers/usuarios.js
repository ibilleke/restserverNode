import { response } from "express"
import bcrypt from "bcrypt"
import { Usuario } from "../models/index.js"

const usuariosGet = async(req, res) => {
    const { limite = 5, desde = 0 } = req.query
    const query = {estado: true}

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req, res) => {
    const { nombre, correo, contraseña, rol } = req.body
    const usuario = new Usuario({nombre, correo, contraseña, rol})

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10)
    usuario.contraseña = await bcrypt.hash(contraseña, salt)

    // Guardar en la db
    try {
        const usuarioGuardado = await usuario.save()
        res.json({usuarioGuardado})
    } catch (error) {
        console.log(error)
    }
}

const usuariosPut = async(req, res) => {
    const { id } = req.params
    const { _id, contraseña, google, ...resto } = req.body

    // TODO validar contra la base de datos
    if( contraseña ) {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10)
        resto.contraseña = await bcrypt.hash(contraseña, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true})

    res.json(usuario)
}

const usuariosPatch = (req, res) => {
    res.json({
        msg:'patch API - controlador'
    })
}

const usuariosDelete = async(req, res) => {
    const { id } = req.params
    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id)
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json(usuario)
}

export { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete }