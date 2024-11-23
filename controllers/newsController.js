import Categorias from "../models/mCategorias.js";
import News from "../models/mNews.js";
import { validationResult } from 'express-validator';
import multer from "multer";
import shortid from "shortid";
import path from 'path';
import fs from 'fs';
import Comentarios from "../models/mComentarios.js";
import { where } from "sequelize";

const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).substring(1));

// Configuración de Multer para el manejo de archivos
const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, next) => {
            next(null, path.join(__dirname, '../public/MaterialesNexus/archivos/uploads/news/'));
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter: (req, file, next) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            next(null, true);
        } else {
            next(new Error('El archivo debe ser una imagen válida'), false);
        }
    }
};

const upload = multer(configuracionMulter).single('imagen');

const cNews = {
    formNews: async (req, res) => {
        const categoria = await Categorias.findAll();
        res.render('nueva-noticia', {
            nombrePagina: 'Crea una nueva noticia',
            categoria
        });
    },

    crearNews: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            req.flash('error', errorMessages);
            return res.redirect('/nueva-noticia');
        }

        const news = {
            ...req.body,
            usuarioId: req.user.id,
            categoriaId: req.body.categoriaId,
            imagen: req.file ? req.file.filename : null
        };

        try {
            await News.create(news);
            req.flash('exito', 'Se ha creado la Noticia correctamente');
            res.redirect('/administracion');
        } catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const errSequelize = err.errors.map(el => el.message);
                req.flash('error', errSequelize);
                res.redirect('/nueva-noticia');
            } else {
                console.error(err);
                req.flash('error', 'Error al crear la noticia');
                res.status(500).send('Error al crear la noticia');
            }
        }
    },

    subirImagen: (req, res, next) => {
        upload(req, res, function (error) {
            if (error) {
                if (error.hasOwnProperty('message')) {
                    req.flash('error', error.message);
                } else {
                    req.flash('error', 'Error al subir la imagen');
                }
                res.redirect('/back');
                return;
            } else {
                next();
            }
        });
    },

    formEditNew: async (req, res) => {
        const consultas = [];
        consultas.push(News.findByPk(req.params.newId));
        consultas.push(Categorias.findAll());

        const [neww, categoria] = await Promise.all(consultas);

        if (!neww) {
            console.error('Error: No se encontró la noticia con el ID proporcionado.');
            req.flash('error', 'No se encontró la noticia.');
            return res.redirect('/administracion');
        }
        res.render('editar-new', {
            nombrePagina: `Editar Noticia : ${neww.nombre}`,
            neww,
            categoria
        });
    },

    editNew: async (req, res, next) => {
        const neww = await News.findOne({
            where: {
                id: req.params.newId,
                usuarioId: req.user.id
            }
        });

        if (!neww) {
            req.flash('error', 'Operacion no válida');
            res.redirect('/administracion');
            return next();
        }

        const { nombre, descripcion, categoriaId, url } = req.body;
        neww.nombre = nombre;
        neww.descripcion = descripcion;
        neww.categoriaId = categoriaId;
        neww.url = url;

        await neww.save();
        req.flash('exito', 'Cambios Almacenados Correctamente');
        res.redirect('/administracion');
    },

    formEditImg: async (req, res) => {
        const neww = await News.findOne({
            where: {
                id: req.params.newId,
                usuarioId: req.user.id
            }
        });

        if (!neww) {
            req.flash('error', 'Operacion no válida');
            res.redirect('/administracion');
            return;
        }

        res.render('imagen-new', {
            nombrePagina: `Editar Imagen Noticia : ${neww.nombre}`,
            neww
        });
    },

    editImg: async (req, res, next) => {
        const neww = await News.findOne({
            where: {
                id: req.params.newId,
                usuarioId: req.user.id
            }
        });

        if (!neww) {
            req.flash('error', 'Operacion no válida');
            res.redirect('/iniciar-sesion');
            return next();
        }

        if (req.file && neww.imagen) {
            const imgAntPath = path.join(__dirname, '../public/MaterialesNexus/archivos/uploads/news/', neww.imagen);
            fs.unlink(imgAntPath, error => {
                if (error) {
                    console.error(error);
                }
            });
        }

        if (req.file) {
            neww.imagen = req.file.filename;
        }

        await neww.save();
        req.flash('exito', 'Cambios Almacenados Correctamente');
        res.redirect('/administracion');
    },

    formDeleteNews: async (req, res, next) => {
        const neww = await News.findOne({
            where: {
                id: req.params.newId
                // usuarioId: req.user.id
            }
        });

        if (!neww) {
            req.flash('error', 'Operacion no válida');
            res.redirect('/administracion');
            return next();
        }

        res.render('eliminar-new',{
            nombrePagina: `Eliminar Noticia : ${neww.nombre}`
        })
       
        
    },

    deleteNews: async(req, res, next)=>{
        const neww = await News.findOne({
            where: {
                id: req.params.newId,
                // usuarioId: req.user.id
            }
        });
        if (!neww) {
            req.flash('error', 'Operacion no válida');
            res.redirect('/administracion');
            return next();
        }
        if(neww.imagen){
            const imgAntPath = path.join(__dirname, '../public/MaterialesNexus/archivos/uploads/news/', neww.imagen);
            fs.unlink(imgAntPath, error => {
                if (error) {
                    console.error(error);
                }
            });
        }
        const comentarios= await Comentarios.findAll({
            where:{
                noticiaId: neww.id
            }
        });
        if(comentarios){
            Comentarios.destroy({
                where:{
                    noticiaId:neww.id
                }
            })
        }
        
        //eliminar noticias

        await News.destroy({
            where: {
                id: req.params.newId
            }
        });

        //redireccionar al user

        req.flash('exito', 'Noticia Eliminada');
        res.redirect('/administracion')
           }
       
};

export default cNews;
