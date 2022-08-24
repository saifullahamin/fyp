const sgMail = require('@sendgrid/mail');

const sendMarketingEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: 'Usman Motorcycle Parts <usmanmotorcycleparts@gmail.com>',
    subject,
    html,
  };

  const info = await sgMail.sendMultiple(msg);
  console.log(info);
};

module.exports = sendMarketingEmail;
