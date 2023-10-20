import { Router } from "express"
import { check } from "express-validator"
import { esAdminRole, validarCampos, validarJWT } from "../middlewares/index.js"
import { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } from "../controllers/productos.js"
import { existeProducto } from "../helpers/index.js"

const routerProductos = Router()

routerProductos.get('/', obtenerProductos)

routerProductos.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
], obtenerProducto)

routerProductos.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'Categoría es obligatoria').isMongoId(),
    validarCampos
], crearProducto)

routerProductos.put('/:id', [
    validarJWT,
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto)

routerProductos.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto)

export default routerProductos