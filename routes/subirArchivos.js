import { Router } from "express"
import {check} from "express-validator"
import { validarCampos, validarArchivo } from "../middlewares/index.js"
import { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } from "../controllers/subirArchivos.js";
import { coleccionesPermitidas } from "../helpers/index.js"

const routeSubirArchivos = Router();

routeSubirArchivos.post('/', validarArchivo, cargarArchivo)

routeSubirArchivos.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID no existe').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary)

routeSubirArchivos.get('/:coleccion/:id', [

], mostrarImagen)

export default routeSubirArchivos