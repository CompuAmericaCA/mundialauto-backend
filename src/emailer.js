const nodemailer = require('nodemailer')


const createTrans = () => {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.gmail.com",
      port: 587,
      auth: {
        user: "alenjhon9@gmail.com", // generated ethereal user
        pass: "126711jalenhidalgo", // generated ethereal password
      }

    });
    return transporter;
  }
  

  const sendMail = async (correo) => {
    const transporter = createTrans()
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: correo, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
    return
  }

  exports.sendMail = () => sendMail()