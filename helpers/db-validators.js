import Role from "../models/role.js"
import Usuario from "../models/usuario.js"

const roleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la Base de datos`)
    }
}

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

export { roleValido, correoExiste, existeUsuarioPorId }