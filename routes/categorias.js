import { Router } from "express"
import { check } from "express-validator"
import { validarCampos, validarJWT, esAdminRole } from "../middlewares/index.js"
import { obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria } from "../controllers/categorias.js"
import { existeCategoria } from "../helpers/db-validators.js"

const routerCategoria = Router()
/** 
 * {{URL}}/api/categorias
 */

// Obtener todas las categorias
routerCategoria.get('/', obtenerCategorias)

// Obtener una categoría por id
routerCategoria.get('/:id', [
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos    
], obtenerCategoria)

// Crear una nueva categoría
routerCategoria.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar un registro por el id
routerCategoria.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatoria').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

// Borrar categoría - Administrador
routerCategoria.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos    
], borrarCategoria)

export default routerCategoria