import { Router } from "express"
import { buscar } from "../controllers/buscar.js"

const routerBusqueda = Router()

routerBusqueda.get('/:coleccion/:termino', buscar)

export default routerBusqueda