import { SimpleExternalLinkIcon } from '@/components/icons/externalLink';

interface RemixLinkProps {
  text: string;
  link: string;
  extraClasses?: string;
}

const RemixLink: React.FC<RemixLinkProps> = ({
  text,
  link,
  extraClasses
}: RemixLinkProps) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div
        className={`flex items-center active ${
          extraClasses ? extraClasses : ''
        }`}
      >
        <span className="mr-0.5 pr-2 whitespace-nowrap">{text}</span>
        {<SimpleExternalLinkIcon textColorClass={'#4376FF'} />}
      </div>
    </a>
  );
};

export default RemixLink;
