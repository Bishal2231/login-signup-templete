import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"
dotenv.config()

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Digital Sakhaa",
};
// const recipients = [
//   {
//     email: "animezoneamv@gmail.com",
//   }
// ]; this need to be dynamic noy yo only one gamil but more 



// mailtrapClient
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "verify your email!",
//     text: "Congrats for signing in our website @digital_sakhaa ",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);