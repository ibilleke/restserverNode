import { Schema, model } from "mongoose"

const RoleSchema = Schema({
    rol: {
        type: String,
        require: [true, 'El rol es obligatorio']
    }
})

const Role = model('Role', RoleSchema)

export default Role