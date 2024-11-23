import moment from "moment"
import Categorias from "../../models/mCategorias.js"
import Courses from "../../models/mCursos.js"
import News from "../../models/mNews.js"
import Usuarios from "../../models/mUser.js"
import passport from "passport"
import { Sequelize } from "sequelize"










const cCourseFe= {
    showCourse: async (req,res,next)=>{
        const course= await Courses.findOne({
            where : {
                slug : req.params.slug
            },
            include: [
                {
                    model: Categorias
                },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
        });
    // si no existe 
    if(!course){
        res.redirect('/');
    }

    // 
    res.render('show-course',{
        nombrePagina : `${course.nombre}`,
        course,
        moment,
        user: req.user
    })
    },

    confirmAttendance: async (req,res)=>{
        console.log(req.body);

        const {accion}= req.body;
        if(accion==='confirmar'){
            //agregar al usuario
            Courses.update(
                {'interesados': Sequelize.fn('array_append', Sequelize.col('interesados'),
                req.user.id  )},
                {'where': {'slug' : req.params.slug}}
            );
            res.send('has confirmado tu asistencia')
        }else{
            // cancelar la asistencia 
            Courses.update(
                {'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'),
                req.user.id  )},
                {'where': {'slug' : req.params.slug}}
            );
            res.send('has cancelado tu asistencia')
        }        
    },

    showAttendees: async (req,res)=>{
        const course= await Courses.findOne({
            where: {slug: req.params.slug},
            attributes: ['interesados']
        });

        const {interesados}= course;

        const asistentes= await Usuarios.findAll({
            attributes: ['nombre', 'imagen'],
            where: {id: interesados}
        });

        //crear vista y pasar datos

        res.render('asistentes-cursos',{
            nombrePagina: 'Listado de Asistentes del curso',
            asistentes
        })
    },
    mostrarCategorias: async(req,res,next)=>{
        const categoria= await Categorias.findOne({
            attributes: ['id','nombre'],
            where: {nombre: req.params.categoria}});
            
            const courses= await Courses.findAll({where: {categoriaId: categoria.id},
                include: [{
                    model: Usuarios
                }]
            });
            res.render('categoria-courses',{
                nombrePagina: `Cursos de  ${categoria.nombre}`,
                courses,
                categoria,
                moment
            })
    }
}

export default cCourseFe;