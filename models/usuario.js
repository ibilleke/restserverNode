import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiered: true
    },
    correo: {
        type: String,
        requiered: true,
        unique: true
    },
    contraseña: {
        type: String,
        requiered: true
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        requiered: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
})

usuarioSchema.methods.toJSON = function() {
    const { __v, contraseña, ...usuario } = this.toObject()
    return usuario
}

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario