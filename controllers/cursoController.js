import Categorias from "../models/mCategorias.js";
import Courses from "../models/mCursos.js";
import { body } from 'express-validator';
import { Sequelize } from "sequelize";
import passport from "passport";


const cCurso = {
    formNewCurso: async (req, res) => {
        const categoria = await Categorias.findAll();
        res.render('nuevo-curso', {
            nombrePagina: 'Crear Nuevo Curso',
            categoria,
            user: req.user
        });
    },

    createCourses: async (req, res) => {
        // Obtiene los datos
        const courses = req.body;
        // Asigna el usuario
        courses.usuarioId = req.user.id;

        // Almacena la ubicación con un point
        const point = {
            type: 'Point',
            coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
        };
        courses.ubicacion = point;

        // Manejo del cupo opcional
        if (req.body.cupo === '') {
            courses.cupo = 0;
        }

        // Almacenar en la BD
        try {
            await Courses.create(courses);
            req.flash('exito', 'Se ha creado el curso correctamente');
            res.redirect('/administracion');
        } catch (err) {
            console.error(err); // Imprimir el error completo para depuración

            // Manejo mejorado de errores
            let errSequelize;
            if (err instanceof Sequelize.ValidationError) {
                errSequelize = err.errors.map(el => el.message);
            } else {
                errSequelize = ['Error inesperado. Inténtalo de nuevo más tarde.'];
            }

            req.flash('error', errSequelize);
            res.redirect('/nuevo-curso');
        }
    },
    sanitizeCourses: [
        body('nombre').trim().escape(),
        body('invitado').trim().escape(),
        body('cupo').toInt(),
        body('fecha').trim().escape(),
        body('hora').trim().escape(),
        body('direccion').trim().escape(),
        body('url').trim().escape(),
        body('ciudad').trim().escape(),
        body('estado').trim().escape(),
        body('pais').trim().escape(),
        body('lat').trim().toFloat(),
        body('lng').trim().toFloat(),
        body('categoriaId').toInt(),
        (req, res, next) => {
            next();
        }
    ],
    formEditCourse: async(req,res,next)=>{
        const consultas=[];
        consultas.push(Categorias.findAll());
        consultas.push(Courses.findByPk(req.params.id));

        const [categoria,course]= await Promise.all(consultas);

        if(!categoria || !course){
            req.flash('error', 'Operacion no valida');
            res.redirect('administracion');
            return next();
        }

        res.render('edit-course', {
            nombrePagina: `Editar Curso : ${course.nombre}`,
            categoria,
            course,
            user: req.user
        })
    },
    editCourse: async(req,res,next)=>{
        const course= await Courses.findOne({where: {id: req.params.id, usuarioId:
            req.user.id
        }});

        if(!course){
            req.flash('error', 'Operacion no valida');
            res.redirect('/administracion');
            return next();
        }
       const {categoriaId,nombre,invitado,fecha,cupo,descripcion,
        direccion,ciudad,estado,pais,url,lat,lng}= req.body;

        course.categoriaId= categoriaId;
        course.nombre= nombre;
        course.invitado= invitado;
        course.fecha= fecha;
        course.cupo= cupo;
        course.descripcion= descripcion;
        course.direccion= direccion;
        course.ciudad= ciudad;
        course.estado=estado;
        course.pais=pais;
        course.url=url;

        //asignar point (ubicacion)
        const point= {type: 'Point', coordinates: [ parseFloat(lat),parseFloat(lng)]};
        course.ubicacion= point;

        await course.save();

        req.flash('exito', 'Cambios Guardados Correctamente');

        res.redirect('/administracion');
    },

    formDeleteCourse: async(req,res,next)=>{
        const course= await Courses.findOne({where: {id: req.params.id 
            // usuarioId: req.user.id
        }})
        if(!course){
            req.flash('error', 'Operacion no valida');
            res.redirect('/administracion');
            return next();
        }

        //mostrar vista
        res.render('delete-course',{
            nombrePagina: `Eliminar Curso: ${course.nombre}`
        }
        )
    },
    deleteCourse: async(req,res)=>{
        await Courses.destroy({
            where: {
                id:req.params.id
            }
        })
        req.flash('exito', 'Curso Eliminado');
        res.redirect('/administracion');
    }
}

export default cCurso;
