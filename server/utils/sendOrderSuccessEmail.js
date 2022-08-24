const sendEmail = require('./sendEmail');

const sendOrderSuccessEmail = async ({ name, email, total }) => {
  const message = `<p>You have successfully placed an order.\nThe total amount is ${total} PKR.</p>`;
  // console.log(name, email, total);
  return sendEmail({
    to: email,
    subject: 'Order Placed',
    html: `<h4>Hello, ${name}</h4>${message}`,
  });
};

module.exports = sendOrderSuccessEmail;
