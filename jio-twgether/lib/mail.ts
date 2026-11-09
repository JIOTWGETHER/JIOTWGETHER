
import nodemailer from 'nodemailer';

type ConfirmationDetails = {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
};

export async function sendRegistrationConfirmation({
  name,
  email,
  eventTitle,
  eventDate,
  eventLocation,
}: ConfirmationDetails) {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!user || !password) {
    throw new Error('Gmail configuration is missing');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: password,
    },
  });

  const message = [
    `嗨 ${name}！`,
    '',
    '感謝你報名 Jio TWgether 的活動！🧡',
    '',
    `活動名稱：${eventTitle}`,
    `活動時間：${eventDate}`,
    `活動地點：${eventLocation}`,
    '',
    '我們期待與你見面！',
    '',
    'Hello!',
    '',
    'Thank you for registering for Jio TWgether!',
    '',
    `Event: ${eventTitle}`,
    `Date & Time: ${eventDate}`,
    `Location: ${eventLocation}`,
    '',
    'We look forward to seeing you!',
    '',
    'Jio TWgether｜揪團啦！',
    'https://jiotwgether.vercel.app',
  ].join('\n');

  await transporter.sendMail({
    from: `"Jio TWgether 🧡" <${user}>`,
    to: email,
    subject: `報名成功！Registration Confirmed｜${eventTitle}`,
    text: message,
  });
}
