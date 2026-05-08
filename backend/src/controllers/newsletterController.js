const db = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const subscribe = function (request, response) {
  const customerEmail = request.body.email;

  const insertQuery = `
    INSERT INTO newsletter (email) 
    VALUES (?)
  `;

  db.query(insertQuery, [customerEmail], function (dbError, dbResult) {
    if (dbError && dbError.errno === 1062) {
      return response.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    if (dbError) {
      console.error("Database error:", dbError);
      return response.status(500).json({
        success: false,
        message: "Failed to save email",
      });
    }

    if (dbResult.affectedRows > 0) {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: customerEmail,
        subject: "Welcome to Gamify!",
        text: `Hello there, thanks for subscribing to Gamify! Remember to use your discount code WELCOME10 to get your first discount!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #fde50d;">Welcome to Gamify!</h2>
            <p>Hello there!</p>
            <p>Thanks for the subscription to Gamify newsletter.</p>
            <p>Use your discount code <strong style="background: #fff3cd; padding: 4px 8px; border-radius: 4px;">WELCOME10</strong> for your <strong>10% discount</strong> on your first order.</p>
            <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
              See you soon,<br>Gamify Team
            </p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, function (mailError, mailInfo) {
        if (mailError) {
          console.error("Email send error:", mailError);
        } else {
          console.log("Email sent:", mailInfo.messageId);

          db.query(
            "UPDATE newsletter SET confirmation_sent = 1 WHERE email = ?",
            [customerEmail],
            function () {},
          );
        }
      });
    }

    response.json({
      success: true,
      message: "Thank you for subscribing!",
      discount_code: "WELCOME10",
    });
  });
};

module.exports = { subscribe };
