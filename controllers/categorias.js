import { response } from "express"
import { Categoria } from "../models/index.js"
import { body } from "express-validator"

const obtenerCategorias = async(req, res) => {
    const { limite = 5, desde = 0 } = req.query
    const query = {estado: true}

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.populate('usuario', 'nombre').find(query).skip(Number(desde)).limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

// Obtener Categoría - populate {}
const obtenerCategoria = async(req, res) => {
    const { id } = req.params
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json(categoria)
}

const crearCategoria = async(req, res) => {
    // Lee el nombre que viene el body y se capitaliza
    const nombre = req.body.nombre.toUpperCase()
    // Se pregunta si existe un categoria con ese nombre
    const categoriaDB = await Categoria.findOne({nombre})
    
    // Si existe la categoría se manda un error
    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id // Se puede acceder al req.usuario por middlewares-validar-jwt
    }

    // Se crea una nueva categoria usando el modelo creado
    const categoria = new Categoria( data )

    // Guardar en db
    await categoria.save()

    // Impresión de la respuesta
    res.status(201).json(categoria)
}

// Actualizar Categoria
const actualizarCategoria = async(req, res) => {
        const { id } = req.params
        const { usuario, estado, ...dato } = req.body
    
        dato.nombre = dato.nombre.toUpperCase()
        dato.usuario = req.usuario._id    

        const categoria = await Categoria.findByIdAndUpdate(id, dato, {new: true})

        res.json(categoria)
}

// Borrar Categoria - estado: false
const borrarCategoria = async(req, res) => {
    const { id } = req.params

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json(categoria)
}

export { obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria }