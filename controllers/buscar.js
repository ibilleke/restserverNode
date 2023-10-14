import { response } from "express"
import mongoose from "mongoose";
import { Categoria, Producto, Usuario } from "../models/index.js"

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino, res) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino)
    if(esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }
    // Expresión regular -> Permite hacer la búsqueda, ya que ignora la sensibilidad de la mayúsculas
    const regex = new RegExp( termino, 'i')

    const usuarios = await Usuario.find({ 
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })

    res.json({
        results: usuarios
    })
}

const buscarcategorias = async(termino, res) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino)
    if(esMongoID) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre')
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }
    // Expresión regular -> Permite hacer la búsqueda, ya que ignora la sensibilidad de la mayúsculas
    const regex = new RegExp( termino, 'i')

    const categorias = await Categoria.find({nombre: regex, estado: true}).populate('usuario', 'nombre')

    res.json({
        results: categorias
    })
}

const buscarProductos = async(termino, res) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino)
    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre').populate('usuario', 'nombre')
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }
    // Expresión regular -> Permite hacer la búsqueda, ya que ignora la sensibilidad de la mayúsculas
    const regex = new RegExp( termino, 'i')

    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre').populate('usuario', 'nombre')

    res.json({
        results: productos
    })
}

const buscar = (req, res) => {
    const { coleccion, termino } = req.params

    if( !coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarcategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Esta búsqueda no esta permitida'
            })
    }
}

export { buscar }