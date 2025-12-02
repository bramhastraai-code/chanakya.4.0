import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendOtpEmailDto {
  to: string;
  otp: string;
  subject?: string;
  text?: string;
}

@Injectable()
export class BrevoEmailService {
  private readonly logger = new Logger(BrevoEmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>(
      'BREVO_SMTP_HOST',
      'smtp-relay.brevo.com',
    );
    this.logger.log(`Using SMTP Host: ${host}`);

    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(this.configService.get<string>('BREVO_SMTP_PORT', '587')),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('BREVO_SMTP_USER'),
        pass: this.configService.get<string>('BREVO_SMTP_PASSWORD'),
      },
    });
  }

  async sendOtpEmail({
    to,
    otp,
    subject = 'Your OTP for Verification',
    text,
  }: SendOtpEmailDto) {
    const fromEmail = this.configService.get<string>('BREVO_FROM_EMAIL');

    const mailOptions = {
      from: fromEmail,
      to,
      subject,
      text: text || `Your OTP is ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="color: #666; font-size: 16px;">Hello,</p>
          <p style="color: #666; font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code is valid for a limited time. Please do not share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Error sending email via Brevo:', error);
      throw error;
    }
  }
}
