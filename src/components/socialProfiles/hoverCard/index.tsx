import React, { useEffect, useState, useRef } from 'react'
import { SocialLinkSource } from "@/components/buttons";
import ProfilePicture from "../profilePicture";

const HoverCard = (props: {
    title: string,
    bio: string,
    avatar: string,
    links?: {URL: string, source: SocialLinkSource}[]
}) => {
    const {
        title,
        bio,
        avatar,
        links
    } = props;

    // Prevent card from spilling over the edge of the window.
    // In those cases we can push the card to the left until it's completely visible.
    const [positionAdjustment, setPositionAdjustment] = useState("");
    const card = useRef(null);
    useEffect(() => {
        const cardElement = card.current
        const rect = cardElement.getBoundingClientRect()
        const xMax = rect.x + rect.width
        const leftStyle = `${-(xMax - window.innerWidth)-12}px`
        if (xMax > window.innerWidth) {
            setPositionAdjustment(leftStyle)
        }
    }, []);

    // List of links to display at the bottom of the card
    const renderedLinks = links?.map((link) => { 
        return (
            <div className="flex place-items-center" key={link.URL}>
                <img 
                    className="mr-2"
                    src={`/images/social/${link.source === SocialLinkSource.TWITTER ? "smallTwitter" : "smallWeb"}.svg`}/>
                <a 
                    href={link.URL} 
                    className="text-blue-500 hover:underline" 
                    target="_blank">
                        {link.URL}
                </a>
            </div>
        );
    });

    return (
        <div
            className="hover-card absolute z-10 top-14 invisible opacity-0 duration-300 ease-out bg-gray-9 bg-opacity-80 md:w-96 w-80 px-7 py-7 rounded-xl shadow-lg_dark backdrop-filter backdrop-blur-3xl"
            style={{left : positionAdjustment}}
            ref={card}>
                <div className="bg-cover h-20 w-20 mr-2 mb-3 rounded-full" style={{backgroundImage : `url('${avatar}')`}}></div>
                <h2 className="text-xl mb-3">{title}</h2>
                <p className="text-gray-300 mb-3">{bio}</p>
                {renderedLinks}
        </div>
    );
};
  
  export default HoverCard;
  