import { genesisBadgeConstants } from "@/components/syndicates/shared/Constants";

export enum NFTBadge {
    GENESIS = "genesis"
}

const { genesisBadgeTitle, genesisBadgeDescription } = genesisBadgeConstants

const Badge = (props: {NFT: NFTBadge, customClasses?: string}) => {
    const {NFT, customClasses = ""} = props;

    var title = genesisBadgeTitle
    var subtitle = genesisBadgeDescription
    var icon = "/images/badges/genesis.svg"

    return (
        <div className={`${customClasses}`}>
            <div className="bg-black border border-gray-700 w-60 sm:w-80 h-16 py-5 px-3 inline-flex rounded-full place-items-center">
                <div className="mr-5">
                    <img className="mx-auto h-10" src={icon}/>
                </div>
                <div className="relative">
                    <div className="font-medium text-white font-whyte">
                        {title}
                    </div>
                    <div className="text-sm text-gray-400 -mt-1 font-whyte">
                        {subtitle}
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  export default Badge;
  