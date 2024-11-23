import Categorias from "../models/mCategorias.js";

export const home= async(req,res)=>{
const consultas=[];

//promise para consultas en el home
consultas.push(Categorias.findAll({}));

//extraer y pasar a la vista
const [ categorias ]= await Promise.all(consultas);

res.render('home',{
    nombrePagina:'Inicio',
    categorias
});
};

const cHome ={

}




