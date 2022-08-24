const sgMail = require('@sendgrid/mail');

const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: 'Usman Motorcycle Parts <usmanmotorcycleparts@gmail.com>',
    subject,
    html,
  };

  const info = await sgMail.send(msg);
  console.log(info);
};

module.exports = sendEmail;
