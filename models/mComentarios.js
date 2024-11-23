import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Usuarios from "./mUser.js"; // Modelo de Usuarios
import News from "./mNews.js"; // Modelo de Noticias

const Comentarios = db.define('comentario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mensaje: Sequelize.TEXT,
    usuarioId: { // Clave foránea hacia Usuarios
        type: Sequelize.INTEGER,
        references: {
            model: Usuarios,
            key: 'id'
        }
    },
    noticiaId: { // Clave foránea hacia Noticias
        type: Sequelize.UUID,
        references: {
            model: News,
            key: 'id'
        }
    }
}, {
    timestamps: false // Desactiva createdAt y updatedAt en esta tabla
});

// Asociaciones (opcional, pero útil para queries más claras)
Comentarios.belongsTo(Usuarios, { foreignKey: 'usuarioId' });
Comentarios.belongsTo(News, { foreignKey: 'noticiaId' });

export default Comentarios;
