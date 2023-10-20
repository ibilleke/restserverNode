import mongoose from "mongoose"
import { Role, Usuario, Categoria, Producto } from "../models/index.js"

// ROLES

const roleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la Base de datos`)
    }
}

// USUARIOS

const correoExiste = async(correo) => {
    // Verifiacr si el correo existe
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        throw new Error('Esté correo ya está en registrado')
    }
}

const existeUsuarioPorId = async(id) => {
    // Verifiacr si el id de ese usuario exista en la db
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error('El ID del usuario no existe')
    }
}

// CATEGORIAS

const existeCategoria = async(id) => {
    if(mongoose.Types.ObjectId.isValid(id)){
        // Verificar si el id de la categoría existe
        const existeCategoriaID = await Categoria.findById(id)
        if(!existeCategoriaID) {
            throw new Error('La categoría seleccionada no existe')
        }
    }
}

// PRODUCTOS

const existeProducto = async(id) => {
    if(mongoose.Types.ObjectId.isValid(id)) {
        // Verificar si el id del producto existe
        const existeProductoID = await Producto.findById(id)
        if(!existeProductoID) {
            throw new Error('El producto seleccionado no existe')
        }
    }
}

// VÁLIDAR COLECCIONES PERMITIDAS

const coleccionesPermitidas = ( coleccion, colecciones) => {
    const incluida = colecciones.includes( coleccion )

    if(!incluida) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`)
    }

    return true
}

export { roleValido, correoExiste, existeUsuarioPorId, existeCategoria, existeProducto, coleccionesPermitidas }