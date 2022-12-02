import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export const client = new Mailgun(FormData).client({
  username: 'api',
  key: process.env.NEXT_PUBLIC_MAILGUN_PRIVATE_KEY
});

export interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
  attachment: {
    filename: string;
    data: string;
  }[];
}

export const sendEmail = async (params: SendEmailParams) =>
  client.messages.create('mail.syndicate.io', {
    from: 'The Syndicate Concierge <concierge@mail.syndicate.io>',
    'h:Reply-To': 'support@syndicate.io',
    ...params
  });
