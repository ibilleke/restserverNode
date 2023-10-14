import { response } from "express"

const esAdminRole = (req, res, next) => {
    if(!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin válidar el token primero'
        })
    }

    const { rol, nombre } = req.usuario

    if(rol !== 'ADMINISTRADOR_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administador - Acción no permitida`
        })
    }

    next()
}

const tieneRole = ( ...roles ) => {
    return (req, res, next) => {
        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere verificar el role sin válidar el token primero'
            })
        }

        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno des estos roles ${roles}`
            })
        }

        next()
    }
}

export { esAdminRole, tieneRole }