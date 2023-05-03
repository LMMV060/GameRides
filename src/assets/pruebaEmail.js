
  const emailjs = require('emailjs-com');
  const emailParams = {
    from_email: 'luism14000@gmail.com',
    from_name: 'Alfredo',
    to_email: 'luism14000@gmail.com',
    subject: 'Prueba',
    message_html: 'Lol'
  };
  emailjs.send('service_oqlhvny', 'template_53g6ejy', emailParams, 'MxbfF8StlKGfU3P8-')
    .then(function(response) {
      console.log('Correo electrónico enviado:', response);
    }, function(error) {
      console.error('Error al enviar el correo electrónico:', error);
    });

