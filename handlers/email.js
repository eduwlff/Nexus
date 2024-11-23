import nodemailer from 'nodemailer';
import config from '../config/emails.js'; 
import fs from 'fs';
import util from 'util';
import ejs from 'ejs';
import { url } from 'inspector';
import path from 'path';

const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).substring(1));

let transport = nodemailer.createTransport({
    host: config.host, 
    port: config.port, 
    auth: {
        user: config.user, 
        pass: config.pass 
    }
});

const enviarEmail = async (opciones) => {
    // leer el archivo para el mail

    const archivo= __dirname + `/../views/emails/${opciones.archivo}.ejs`;

    //compilarlo
    const compilado= ejs.compile(fs.readFileSync(archivo, 'utf-8'));

    const html=compilado({url: opciones.url});

    //configurar las opciones del email

    const opcionesEmail={
        from: 'Nexus <noreply@nexus.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    };

    //enviar el mail

    const sendEmail= util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, opcionesEmail);

    console.log('opciones: ', opciones);
};

export default enviarEmail;
