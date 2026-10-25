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
      to: process.env.EMAIL_USER, // ← khud ko email aayegi
      replyTo: replyTo, // ← visitor ka email reply ke liye
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email sending failed: " + error.message, { cause: error });
  }
};

export default sendEmail;
