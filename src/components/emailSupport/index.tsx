import React from 'react';
interface EmailSupportProps {
  href?: string;
  className?: string;
  linkText?: string;
}
export const EmailSupport: React.FC<EmailSupportProps> = ({
  href = 'support@syndicate.io',
  className = 'text-gray-syn3',
  linkText
}) => (
  <a
    className={`${className} cursor-pointer`}
    href={`mailto:${href}`}
    target="_blank"
    rel="noreferrer"
  >
    {linkText || href}
  </a>
);
