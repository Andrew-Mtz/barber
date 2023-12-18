import nodemailer from 'nodemailer';
import { config } from 'dotenv'
config()

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Cambia esto al servicio de correo que estás utilizando
  auth: {
    user: process.env.NM_EMAIL, // Tu dirección de correo electrónico
    pass: process.env.NM_PASSWORD, // Tu contraseña
  },
});

export const sendWelcomeEmail = (correoDestino, nombreUsuario) => {
  const remitente = 'Royal Studio <barber.royalstudio@gmail.com>';
  const asunto = '¡Bienvenido a Royal Studio!';
  const mensaje = `Hola ${nombreUsuario},\n\nBienvenido a nuestra barbería. Estamos emocionados de tenerte como miembro. ¡Gracias por confiar en nosotros!\n\nSaludos,\nRoyal Studio`;

  const opcionesCorreo = {
    from: remitente,
    to: correoDestino,
    subject: asunto,
    text: mensaje,
  };

  transporter.sendMail(opcionesCorreo, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de bienvenida:', error);
    } else {
      console.log('Correo de bienvenida enviado:', info.response);
    }
  });
}

export const sendBookingEmail = (correoDestino, nombreUsuario, date) => {
  const remitente = 'Royal Studio <barber.royalstudio@gmail.com>';
  const asunto = '¡Corte agendado!';
  const mensaje = `Hola ${nombreUsuario},\n\nEste correo es para avisarte que tu corte para el dia ${date} quedo agendada correctamente!\n\nSaludos,\nRoyal Studio`;

  const opcionesCorreo = {
    from: remitente,
    to: correoDestino,
    subject: asunto,
    text: mensaje,
  };

  transporter.sendMail(opcionesCorreo, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de reservacion:', error);
    } else {
      console.log('Correo de reservacion enviado:', info.response);
    }
  });
}

export const sendBookingCanceledEmail = (correoDestino, nombreUsuario, date) => {
  const remitente = 'Royal Studio <barber.royalstudio@gmail.com>';
  const asunto = '¡Reserva cancelada!';
  const mensaje = `Hola ${nombreUsuario},\n\nEste correo es para avisarte que tu reserva del dia ${date} fue cancelada exitosamente!\n\nSaludos,\nRoyal Studio`;

  const opcionesCorreo = {
    from: remitente,
    to: correoDestino,
    subject: asunto,
    text: mensaje,
  };

  transporter.sendMail(opcionesCorreo, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de cancelacion:', error);
    } else {
      console.log('Correo de cancelacion enviado:', info.response);
    }
  });
}

export const sendContactEmail = (name, email, message) => {
  const asunto = '¡Contacto por Barberia!';
  const remitente = `${name} <${email}>`

  const opcionesCorreo = {
    from: remitente,
    to: process.env.NM_EMAIL,
    subject: asunto,
    text: `${message}\n\nfrom: ${email}`,
  };

  transporter.sendMail(opcionesCorreo, (error, info) => {
    if (error) {
      console.error('Error al enviar el mensaje de contacto:', error);
    } else {
      console.log('Correo de contacto enviado:', info.response);
    }
  });
}

export const bookingReminder = (name, toEmail, hour) => {
  const remitente = 'Royal Studio <barber.royalstudio@gmail.com>';
  const asunto = '¡Recordatorio de Reserva!';
  const mensaje = `Hola ${name},\n\nEste correo es un recordatorio de que tienes una reserva para hoy a las ${hour}.\n\nSaludos,\nRoyal Studio`;

  const opcionesCorreo = {
    from: remitente,
    to: toEmail,
    subject: asunto,
    text: mensaje,
  };

  transporter.sendMail(opcionesCorreo, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de cancelacion:', error);
    } else {
      console.log('Correo de cancelacion enviado:', info.response);
    }
  });
}
