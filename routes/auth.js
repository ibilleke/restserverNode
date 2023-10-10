import { Router } from "express"
import {check} from "express-validator"
import { validarCampos } from "../middlewares/validar-campos.js"
import { login } from "../controllers/auth.js"

const routerAuth = Router();

routerAuth.post('/login', [ 
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
 ], login)

export default routerAuth