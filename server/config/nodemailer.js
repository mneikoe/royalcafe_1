const nodemailer = require("nodemailer");

// Function to send email
async function sendEmail(userEmail, userName) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password", // Generate app password from your Google account if 2FA is enabled
      },
    });

    const mailOptions = {
      from: "your_email@gmail.com",
      to: userEmail,
      subject: "Registration Successful",
      text: `Hello ${userName},\n\nThank you for registering successfully! 😊`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
