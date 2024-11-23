import News from "../models/mNews.js";
import Courses from "../models/mCursos.js";
import moment from "moment/moment.js";
import { Sequelize, Op } from "sequelize"; // Asegúrate de importar `Op` desde Sequelize
import Usuarios from "../models/mUser.js";

const cAdmin = {
    panelAdmin: async (req, res) => {
        // Obtener la fecha actual formateada
        const fechaActual = moment().startOf('day').add(1, 'day').toDate(); // Añade un día para excluir hoy


        // Consultas
        const consultas = [];
        consultas.push(News.findAll({ where: { usuarioId: req.user.id } }));
        consultas.push(Courses.findAll({
            where: {
                usuarioId: req.user.id,
                // Aquí se usa la fecha formateada para comparar
                fecha: { [Op.gte]: fechaActual } // Comparación con la fecha formateada
            }
        }));
        consultas.push(Courses.findAll({
            where: {
                usuarioId: req.user.id,
                // Aquí se usa la fecha formateada para comparar
                fecha: { [Op.lt]: fechaActual } // Comparación con la fecha formateada
            }
        }));

        const user = await Usuarios.findOne({where: {id: req.user.id}});

        const [news, courses,previous] = await Promise.all(consultas);

        courses.forEach(course => {
            console.log("Fecha del curso:", course.fecha);
        });


        res.render('administracion', {
            nombrePagina: 'Panel de Administración',
            news,
            courses,
            moment,
            previous,
            user 
        });
    },
    showAdmin: async(req,res)=>{
        const consultas=[];

        consultas.push(News.findAll());
        consultas.push(Courses.findAll());

        const [news, courses]= await Promise.all(consultas);
        
        const user= await Usuarios.findOne({where: {id: req.user.id}});

        res.render('show-all', {
            nombrePagina: 'Todas las noticias y cursos',
            news,
            courses,
            user,
            moment
        })
    }
}

export default cAdmin;
