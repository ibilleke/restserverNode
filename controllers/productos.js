import { response } from "express"
import { Categoria, Producto } from "../models/index.js"

const obtenerProductos = async(req, res) => {
    const { limite = 5, desde = 0 } = req.query
    const query = {estado: true}

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre').populate('categoria', 'nombre')
    ])

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async(req, res) => {
    const { id } = req.params
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre')

    res.json(producto)
}

const crearProducto = async(req, res) => {
        const { estado, usuario, ...body } = req.body

        // Se pregunta si existe un producto con ese nombre
        const productoDB = await Producto.findOne({nombre: body.nombre.toUpperCase()})
        if( productoDB ) {
            return res.status(400).json({
                msg: `El producto: ${body.nombre}, ya existe`
            })
        }

        const categoriaDB = await Categoria.findOne({categoria: body.categoria})
        if( categoriaDB ) {
            return res.json({
                msg: `La categoria: ${body.categoria} no existe`
            })
        }

        // Genera los datos para guardarlos
        const datos = {
            body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id,
            categoria: body.categoria
        }
        // Crea la categoría 
        const producto = new Producto( datos )
        // Guarda en db
        await producto.save()

        res.status(201).json(producto)
}

const actualizarProducto = async(req, res) => {
    const { id } = req.params
    const { usuario, estado, ...datos } = req.body

    // Se pregunta si existe un producto con ese nombre
    const productoDB = await Producto.findOne({nombre: datos.nombre.toUpperCase()})
    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto: ${datos.nombre}, ya existe`
        })
    }

    const categoriaDB = await Categoria.findOne({categoria: datos.categoria})
    if( categoriaDB ) {
        return res.json({
            msg: `La categoria: ${datos.categoria} no existe`
        })
    }
    
    if(datos.nombre) {
        datos.nombre = datos.nombre.toUpperCase()
    }
    datos.usuario = req.usuario._id    

    const producto = await Producto.findByIdAndUpdate(id, datos, {new: true})

    res.json(producto)
}

const borrarProducto = async(req, res) => {
    const { id } = req.params

    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json(producto)
}

export { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto }