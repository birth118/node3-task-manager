const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
//   to: 'birth118@naver.com',
//   from: 'seongsoo@gmail.com',
//   subject: 'The fist mail from task app',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);


const sendWelcomeEmail =(email, name)=>{
    sgMail.send({
        to: email,
        from: 'donotreply@taskApp.com',
        subject: '웰컴 Thanks for joining in the Task App',
        text: `${name}, \n웰컴 Thanks for joining in the Task App`
    });
}

const sendByeEmail =(email, name)=>{
    sgMail.send({
        to: email,
        from: 'donotreply@taskApp.com',
        subject: '빠이 Thanks for using in the Task App',
        text: `빠이 ${name}, Hope we meet agains soon`
    });
}

module.exports = {
    sendWelcomeEmail, sendByeEmail
}