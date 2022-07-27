import { B3 } from '@/components/typography';

export const DiscordLink: React.FC<{ discordLink: string; label?: string }> = ({
  discordLink,
  label = 'Join our Discord at'
}) => (
  <B3 extraClasses="space-x-2">
    {label}
    <a
      href={discordLink}
      target="_blank"
      rel="noreferrer"
      className="ml-2 text-blue"
    >
      {discordLink}
    </a>
  </B3>
);

export const WebSiteLink: React.FC<{ websiteUrl: string; label?: string }> = ({
  websiteUrl,
  label = 'Official website:'
}) => (
  <B3 extraClasses="space-x-2">
    {label}
    <a
      href={websiteUrl}
      target="_blank"
      rel="noreferrer"
      className="ml-2 text-blue"
    >
      {websiteUrl}
    </a>
  </B3>
);
