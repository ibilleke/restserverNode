import { Router } from "express"
import {check} from "express-validator"
import { validarCampos, validarJWT, tieneRole } from "../middlewares/index.js"
import { roleValido, correoExiste, existeUsuarioPorId } from "../helpers/index.js"
import { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } from "../controllers/usuarios.js"

const router = Router();

router.get('/', usuariosGet)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo ingresado no es válido').isEmail(),
    check('correo').custom(correoExiste),
    check('contraseña', 'La contraseña debe de conterner mínimo 6 caracteres').isLength({ min: 6}),
    check('rol').custom(roleValido),
    validarCampos
], usuariosPost)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(roleValido),
    validarCampos
],  usuariosPut)

router.patch('/', usuariosPatch)

router.delete('/:id', [
    validarJWT,
    // esAdinRole,
    tieneRole('ADMINISTRADOR_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)

export default router