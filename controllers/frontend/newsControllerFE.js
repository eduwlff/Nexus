import Categorias from "../../models/mCategorias.js";
import Comentarios from "../../models/mComentarios.js";
import Courses from "../../models/mCursos.js";
import News from "../../models/mNews.js"
import Usuarios from "../../models/mUser.js";
import moment from "moment";





const cNewsFe= {
    showNews: async (req,res,next)=>{
const consultas= [];
consultas.push(News.findOne({
    where :{id: req.params.id},
    include: [
        {
        model: Categorias
    }, {
        model: Usuarios,
        attributes: ['id','nombre', 'imagen']
    }]

}));

const [news]= await Promise.all(consultas);

//si no hay news
if(!news){
    res.redirect('/');

    return next();
}


const comentarios= await Comentarios.findAll({
    where: { noticiaId: news.id},
    include: [
        {
            model: Usuarios,
            attributes: ['id','nombre', 'imagen']
        }
    ]
})



//mostrar la vista 

res.render('mostrar-noticias', {
    nombrePagina: news.nombre,
    news,
    user: req.user,
    comentarios
})

    },
    mostrarCategoria: async (req,res,next)=>{
const categoria= await Categorias.findOne({
    attributes: ['id','nombre'],
    where: {nombre: req.params.categoria}});
    
    const news= await News.findAll({where: {categoriaId: categoria.id},
        include: [{
            model: Usuarios
        }]
    });

    res.render('categoria-news',{
        nombrePagina: `Noticias de ${categoria.nombre}`,
        news,
        categoria,
        moment
    })


    }

}

export default cNewsFe;