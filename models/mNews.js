import { Sequelize } from "sequelize";
import db from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import Categorias from "./mCategorias.js";
import Usuarios from "./mUser.js";

const News = db.define('noticias', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4 // Corrige la forma de asignar el UUID
    },
    nombre: {
        type: Sequelize.TEXT(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La noticia tiene que tener un título'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La noticia tiene que tener un cuerpo'
            }
        }
    },
    url: Sequelize.TEXT,
    imagen: Sequelize.TEXT,
    usuarioId: { // Agregar la columna usuarioId
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Configura la referencia a la tabla Usuarios
            model: Usuarios,
            key: 'id'
        }
    }
});

News.belongsTo(Categorias, { foreignKey: 'categoriaId' }); // Relación con Categorías
News.belongsTo(Usuarios, { foreignKey: 'usuarioId' }); // Relación con Usuarios

export default News;
