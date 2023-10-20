import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fs from "fs"
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL )
import { response } from "express"
import { subirArchivo } from "../helpers/index.js"
import { Usuario, Producto } from "../models/index.js"

const cargarArchivo = async(req, res) => {
  try {
    // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos')
    const nombre = await subirArchivo( req.files, undefined, 'imgs')

    res.json({ nombre })
  } catch (msg) {
    res.status(400).json({msg})
  }
}

const actualizarImagen = async(req, res) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if(!modelo) {
        return res.status(400).json({
          msg: `El usuario no existe`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id)
      if(!modelo) {
        return res.status(400).json({
          msg: `El producto no existe`
        })
      }
    break;
  
    default:
      return res.status(500).json({ msg: 'Busqueda no permitida'})
  }

  // Limpiar imágenes previas
  if( modelo.img ) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if( fs.existsSync( pathImagen) ) {
      fs.unlinkSync(pathImagen)
    }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion)
  modelo.img = nombre

  await modelo.save()

  res.json({ modelo })
}

const actualizarImagenCloudinary = async(req, res) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if(!modelo) {
        return res.status(400).json({
          msg: `El usuario no existe`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id)
      if(!modelo) {
        return res.status(400).json({
          msg: `El producto no existe`
        })
      }
    break;
  
    default:
      return res.status(500).json({ msg: 'Busqueda no permitida'})
  }

  // Limpiar imágenes previas
  if( modelo.img ) {
    const nombreArr = modelo.img.split('/')
    const nombre = nombreArr[nombreArr.length -1]
    const [ public_id ] = nombre.split('.')
    await cloudinary.uploader.destroy(`node-Cafe/${coleccion}/${public_id}`)
  }

  const { tempFilePath } = req.files.archivo
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath, { folder: `node-Cafe/${coleccion}` } )
  modelo.img = secure_url

  await modelo.save()

  res.json(modelo)
}

const mostrarImagen = async(req, res) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if(!modelo) {
        return res.status(400).json({
          msg: `El usuario no existe`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id)
      if(!modelo) {
        return res.status(400).json({
          msg: `El producto no existe`
        })
      }
    break;
  
    default:
      return res.status(500).json({ msg: 'Busqueda no permitida'})
  }

  // Limpiar imágenes previas
  if( modelo.img ) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if( fs.existsSync( pathImagen) ) {
      return res.sendFile( pathImagen)
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
  res.sendFile(pathImagen)
}





export { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary}