import Courses from "../../models/mCursos.js";
import News from "../../models/mNews.js";
import Usuarios from "../../models/mUser.js";
import { Sequelize, Op } from "sequelize";
import moment from "moment";

const cSearch = {
    searchResult: async (req, res) => {
        // leer datos de la url 
        const { categoria, nombre } = req.query;

        // Construir el objeto `where` dinámicamente
        let whereClause = {
            nombre: { [Op.iLike]: '%' + nombre + '%' }
        };
        if (categoria) {
            whereClause.categoriaId = { [Op.eq]: categoria };
        }

        // Consultar cursos
        const courses = await Courses.findAll({
            where: whereClause,
            include: [
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        });

        // Consultar noticias
        const news = await News.findAll({
            where: whereClause,
            include: [
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        });

        // Renderizar la vista
        res.render('busqueda', {
            nombrePagina: 'Resultados Búsqueda',
            courses,
            news,
            moment
        });
    }
};

export default cSearch;
