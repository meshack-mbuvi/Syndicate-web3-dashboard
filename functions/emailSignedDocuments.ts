import template from 'lodash/template';
import { NextApiRequest } from 'next';
import * as yup from 'yup';

import * as mailgun from './utils/mailgun';

const requestBody = yup.object().shape({
  legalEntityName: yup.string().required('legalEntityName is required'),
  clubAddress: yup.string().required('clubAddress is required'),
  operatingAgreement: yup.string().required('Operating agreement is required'),
  subscriptionAgreement: yup
    .string()
    .required('Subscription agreement is required'),
  managerName: yup.string().required('Manager name is required'),
  managerEmail: yup.string().email().required('Manager email is required'),
  memberName: yup.string().required('Member name is required'),
  memberEmail: yup.string().email().required('Member email is required')
});

export default async (request: NextApiRequest) => {
  const {
    legalEntityName,
    clubAddress,
    operatingAgreement,
    subscriptionAgreement,
    memberName,
    memberEmail,
    managerName,
    managerEmail
  } = await requestBody.validate(request.body);

  const messageHTML = emailTemplate({
    legalEntityName,
    clubAddress,
    memberName,
    memberEmail,
    managerName,
    managerEmail,
    currentWeekday: today()
  });

  await mailgun.sendEmail({
    to: [managerEmail, memberEmail],
    subject: `${legalEntityName} x ${memberName} Legal Agreements`,
    html: messageHTML,
    attachment: [
      {
        filename: `${legalEntityName} x ${memberName} Operating Agreement.txt`,
        data: operatingAgreement
      },
      {
        filename: `${legalEntityName} x ${memberName} Subscription Agreement.txt`,
        data: subscriptionAgreement
      }
    ]
  });

  return { statusCode: 201 };
};

const today = () =>
  [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ][new Date().getDay()];

const emailTemplate = template(`
<p>Hello <%= managerName %> and <%= memberName %>,</p>

<p><%= memberName %> has signed the Operating Agreement and Subscription Agreement for <%= legalEntityName %>.</p>

<p>The agreements are attached for your convenience. Syndicate does not store a copy of these agreements, so please download and save it for your records.</p>

<p>To continue, <%= memberName %> will need to download the exhibit documents and submit them to <%= managerName %>. You can do this by replying to this email!</p>

<p><%= managerName %>, after you have received the exhibits from <%= memberName %>, you will need to sign the attached subscription agreement and mark this agreement as signed in your <%= legalEntityName %>'s dashboard.</p>

<p>Happy <%= currentWeekday %>,<br />
The Syndicate Concierge</p>
`);
