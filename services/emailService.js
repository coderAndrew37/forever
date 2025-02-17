const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmationEmail(to, order) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Order Confirmation",
    html: `<h3>Hello, ${order.name}</h3>
           <p>Thank you for your order! It is being processed.</p>
           <p><strong>Order Details:</strong></p>
           <ul>
              ${order.items
                .map(
                  (item) =>
                    `<li>${item.quantity} x ${item.name} - Ksh ${(
                      item.priceCents / 100
                    ).toFixed(2)}</li>`
                )
                .join("")}
           </ul>
           <p><strong>Total: Ksh ${(order.totalCents / 100).toFixed(
             2
           )}</strong></p>`,
  };
  await transporter.sendMail(mailOptions);
}

async function sendOrderStatusUpdateEmail(to, order, status, trackingNumber) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Order Update - ${status}`,
    html: `<h3>Hello, ${order.name}</h3>
           <p>Your order status has been updated to: <strong>${status}</strong>.</p>
           ${
             trackingNumber
               ? `<p>Tracking Number: <strong>${trackingNumber}</strong></p>`
               : ""
           }
           <p>Thank you for shopping with us!</p>`,
  };
  await transporter.sendMail(mailOptions);
}

async function sendOrderCancellationEmail(to, order, reason) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Order Cancellation",
    html: `<h3>Hello, ${order.name}</h3>
           <p>Unfortunately, your order has been canceled.</p>
           <p>Reason: <strong>${reason}</strong></p>
           <p>We apologize for the inconvenience.</p>`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendOrderCancellationEmail,
};
