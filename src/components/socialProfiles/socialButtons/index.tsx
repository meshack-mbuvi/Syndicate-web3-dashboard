import { SocialLinkButton, SocialLinkSource } from "@/components/buttons";
import Link from "next/link";

const SocialLinkButtons = (props: {
    links: {URL: string, source: SocialLinkSource}[],
    customClasses?: string
}) => {
    const {
        links,
        customClasses = ""
    } = props;

    // If there's only one button, show the social media handle next
    // to the relevant social media icon
    if (links.length === 1) {
        const URL = links[0].URL
        const splitURL = URL.split("/")
        const label = "@" + splitURL[splitURL.length - 1]
        return (
            <Link href={URL}>
                <a
                  className={`${customClasses} relative flex items-center`}
                  target="_blank">
                    <img 
                        className="mr-2"
                        src={`/images/social/${links[0].source}.svg`}/>
                    <span>{label}</span>
                </a>
            </Link>
        );
    }
    else {
        const renderedButtons = links.map((link) => {
            return(
                <SocialLinkButton
                    url={link.URL}
                    source={link.source}
                    customClasses="mr-2"
                    key={link.URL}/>
            );
        })
    
        return (
            <div className={`${customClasses} flex mt-4`}>
                {renderedButtons}
            </div>
        );
    }
};
  
export default SocialLinkButtons;