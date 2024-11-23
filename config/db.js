import { Sequelize } from "sequelize";

const db= new Sequelize('nexus','postgres','12345678',{
    host:'127.0.0.1',
    port:5432,
    dialect: 'postgres',
    pool: {
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
    logging: (msg) => console.log(`Consulta SQL ejecutada: ${msg}`) // Personaliza el formato del logging
});
// (async () => {
//     try {
//         await db.authenticate();  // Correcto método para verificar la conexión
//         console.log('Connected to the PostgreSQL server.');
//     } catch (error) {
//         console.error('Error connecting to the PostgreSQL server:', error.message);
//     }
// })();


export default db;