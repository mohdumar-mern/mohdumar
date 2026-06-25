import nodemailer from "nodemailer";

const sendEmail = async (subject, text, replyTo) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: replyTo,
      replyTo,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Don't use res here – just throw to be handled where called
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email sending failed: " + error.message);
  }
};

export default sendEmail;
