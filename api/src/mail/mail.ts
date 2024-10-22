import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import { BadRequestException } from '@nestjs/common';
dotenvConfig();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'jacknvu98@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendMail = async (mailOptions, callback) => {
  try {
    const details = await transporter.sendMail(mailOptions);
    callback(details);
  } catch {
    throw new BadRequestException();
  }
};
