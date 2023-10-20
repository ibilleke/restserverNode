import { Schema, model } from "mongoose"

const productoSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: { // Este se para la eliminacion
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: { // Este es para el producto este disponible
        type: Boolean,
        default: true
    },
    img: { // Este es para el producto este disponible
        type: String
    }
})

productoSchema.methods.toJSON = function() {
    const { __v, estado,  ...datos } = this.toObject()
    return datos
}

const Producto = model('Producto', productoSchema)
export { Producto }