import { SocialLinkSource } from "@/components/buttons"; // TODO: move this enum 
import HoverCard from "../hoverCard";
import ProfilePicture from "../profilePicture";

const ProfileCollection = (props: {
    profiles: {
        name: string, 
        avatar: string,
        bio?: string, 
        links?: {URL: string, source: SocialLinkSource}[]
    }[],
    numberOfProfilesToHighlight?,
    customClasses?,
    setVisibilityForAllProfiles,
}) => {
    const {
        profiles,
        numberOfProfilesToHighlight = 8,
        customClasses = "",
        setVisibilityForAllProfiles
    } = props;

    const renderedProfiles = profiles.slice(0, numberOfProfilesToHighlight).map((profile) => {
        const shouldShowHoverCard = profile.bio && profile.avatar
        return(
            <ProfilePicture
                URL={!shouldShowHoverCard && profile.links ? profile.links[0].URL : null}
                avatar={profile.avatar}
                customClasses="mr-4 mb-4">

                {/* Only show a hovercard if there is enough information to display. In our case,
                    only show it when there's a profile picture and bio. */}
                {shouldShowHoverCard
                    ?   <HoverCard
                            title={profile.name}
                            bio={profile.bio}
                            avatar={profile.avatar}
                            links={profile.links}
                        />
                    :   <div className="label mx-auto invisible opacity-0 absolute z-10 horizontally-center">
                            {profile.name}
                        </div>
                }
            </ProfilePicture>
        );
    });

    const numberOfProfiles = profiles.length;
    const hiddenProfiles = numberOfProfiles - numberOfProfilesToHighlight;
    return (
        <div className={`${customClasses} flex flex-wrap items-center`}>

            {/* Displayed profiles */}
            {renderedProfiles}

            {/* If there are more profiles than possible to display
                add a button to show the overflowing members. */}
            {hiddenProfiles > 0
                ?   <button
                        className="relative -top-2 h-12 w-12 bg-white bg-opacity-10 rounded-full focus:outline-none"
                        onClick={() => {setVisibilityForAllProfiles(true)}}>
                            <p><span className="font-whyte-light">+</span>{hiddenProfiles}</p>
                    </button>
                :   null}
            
            {/* If there's just one profile, use the extra space to add a name beside
                the profile picture */}
            {numberOfProfiles === 1
                ?   <a 
                        className="relative -top-2"
                        href={profiles[0].links ? profiles[0].links[0].URL : null}>
                        <p className="font-whyte">{profiles[0].name}</p>
                    </a>
                :   null}
        </div>
    );
  };
  
  export default ProfileCollection;
  