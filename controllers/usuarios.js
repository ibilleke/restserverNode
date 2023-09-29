import {response} from "express"

const usuariosGet = (req, res) => {
    const query = req.query

    res.json({
        msg:'get API - controlador',
        query
    })
}

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body
    
    res.json({
        msg:'post API - controlador',
        nombre,
        edad
    })
}

const usuariosPut = (req, res) => {
    const { id } = req.params
    res.json({
        msg:'put API - controlador',
        id
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        msg:'patch API - controlador'
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msg:'delete API - controlador'
    })
}

export { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete }