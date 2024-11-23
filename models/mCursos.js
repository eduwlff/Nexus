import { Sequelize } from "sequelize";
import db from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import Categorias from "./mCategorias.js";
import Usuarios from "./mUser.js";
import slug from "slug";
import shortid from "shortid";

const Courses= db.define(
    'cursos',{
        id :{
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv4
        },
        nombre: {
            type: Sequelize.TEXT(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El curso tiene que tener un nombre'
                }
            }
        },
        slug: {
            type:Sequelize.STRING
        },
        invitado: Sequelize.STRING,
        cupo: {
            type:Sequelize.STRING,
            defaultValue:0
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate:{
                notEmpty:{
                    msg:'Agrega una descripcion'
                }
            }
        },
        fecha: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            validate:{
                notEmpty:{
                    msg:'Agrega una fecha para el curso'
                }
            }
    },
    hora:  {
        type: Sequelize.TIME,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:'Agrega una hora para el curso'
            }
        }
    },
    direccion:  {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:'Agrega una direccion para el curso'
            }
        }
    },ciudad:  {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:'Agrega una Ciudad'
            }
        }
    },
    estado:  {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:'Agrega un estado'
            }
        }
    },
    pais:  {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:'Agrega un pais'
            }
        }
    },
    url:Sequelize.TEXT,
    ubicacion: {
        type: Sequelize.GEOMETRY('POINT')
    },
    interesados:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[]
    }

    

}, {
    hooks:{
        async beforeCreate(courses){
            const url= slug(courses.nombre).toLowerCase();
            courses.slug= `${url}-${shortid.generate()}`
        }
    }
}
)
Courses.belongsTo(Categorias, { foreignKey: 'categoriaId' }); // Relación con Categorías
Courses.belongsTo(Usuarios, { foreignKey: 'usuarioId' }); // Relación con Usuarios

export default Courses;