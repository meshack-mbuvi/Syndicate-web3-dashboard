import { useState } from 'react';
import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import PhotoGallery from '@/components/socialProfiles/photoGallery';
import SocialLinkButtons from '@/components/socialProfiles/socialButtons';
import Badge, { NFTBadge } from '@/components/socialProfiles/badge';
import ProfileCollection from '@/components/socialProfiles/profileCollection';
import SocialActionButtons from '@/components/socialProfiles/socialActionButtons';
import { ProfilesModal } from '@/components/socialProfiles/profilesModal';
import SEO from '@/components/seo';
import { SocialAction, SocialLinkSource } from '@/components/buttons';
import ConnectWallet from "src/components/connectWallet";


const SocialProfileLayout = (props: {
    pageTitle: string,
    syndicateName: string,
    links: {URL: string, source: SocialLinkSource}[],
    customActionButtons?: {title: string, action: SocialAction, URL: string}[],
    leads: {
        name: string, 
        avatar: string,
        bio?: string, 
        links?: {URL: string, source: SocialLinkSource}[]
    }[],
    members: {
        name: string, 
        avatar: string,
        bio?: string, 
        links?: {URL: string, source: SocialLinkSource}[]
    }[],
    children,
    photoGallery: {URL: string, caption?: string}[],
    socialImage: string
}) => {
    const {
        pageTitle,
        syndicateName,
        links,
        customActionButtons,
        leads,
        members,
        children,
        photoGallery,
        socialImage
    } = props;
 
    const [isMembersModalVisible, setMembersModalVisiblility] = useState(false);
    const [isLeadsModalVisible, setLeadsModalVisiblility] = useState(false);

    return (
        <div>
            <SEO
                keywords={[`syndicate`, `crypto`, `invest`, `fund`, `social`, `community`]}
                description={`View the ${syndicateName ? syndicateName : pageTitle} on Syndicate.`}
                title={pageTitle}
                customSecondaryTitle="Syndicate"
                image={socialImage}
            />

            <ProfilesModal
                title="Members"
                show={isMembersModalVisible}
                closeModal={() => {setMembersModalVisiblility(false)}}
                profiles={members}/>

            <ProfilesModal
                title="Leads"
                show={isLeadsModalVisible}
                closeModal={() => {setLeadsModalVisiblility(false)}}
                profiles={leads}/>

            <ConnectWallet />
            <Header backLink={null} />

            <div className="flex mx-auto container transition-all">

                <div className="w-full lg:mx-0 mx-auto">
                    
                    {/* Mobile photo gallery */}
                    <div 
                        style={{marginTop: "56px"}}
                        className="w-screen h-80 sm:h-144 edge-to-edge md:hidden animate-move_in_brief mb-8">
                        <PhotoGallery
                            photos={photoGallery}
                            showCaptions={false}
                            customClassesForControls="mx-auto -mb-14 -top-20"/>
                    </div>

                    {/* Syndicate Profile */}
                    <div className="w-full flex">

                        {/* Article Column (Left) */}
                        <div className="w-full md:w-6/12 no-scroll-bar">
                            
                            {/* Narrow wrapper */}
                            <div className="flex flex-col h-full mx-auto md:mx-0 md:w-10/12 text-white ">

                                {/* Top space pushing down content to accomodate the nav (for flex) */}
                                <div className="md:block hidden h-32 flex-shrink-0"></div>
                            
                                {/* Profile details */}
                                <div className="flex-1">

                                    {/* <BackButton topOffsetClass="-top-5" /> */}

                                    <h4 className="tagline sm:mb-0">Syndicate</h4>
                                    <h1 className="mt-3 social-profile-title-small md:social-profile-title-medium lg:social-profile-title-large font-whyte-light">
                                        {pageTitle}
                                    </h1>

                                    {/* Action buttons + dropdowns container */}
                                    <div className="relative animate-move_in_brief">
                                        <SocialActionButtons
                                            customActionButtons={customActionButtons}
                                            syndicateName={syndicateName} // Verify that each name matches existing netlify forms
                                        />
                                    </div>
                                
                                    {/* Leads */}
                                    <ProfileCollection
                                        profiles = {leads}
                                        numberOfProfilesToHighlight = {2}
                                        customClasses = "animate-move_in_brief mt-12 mb-8 "
                                        setVisibilityForAllProfiles={setLeadsModalVisiblility}
                                    />
                                
                                    {/* Article */}
                                    <article className="animate-move_in_brief">
                                        {children}
                                    </article>

                                    <SocialLinkButtons
                                        links = {links}
                                        customClasses = "animate-move_in_brief mt-10 mb-12"
                                    />
                                
                                    {/* Members */}
                                    <h2 className="text-lg items-center mb-3 mt-16 font-whyte">Members</h2>
                                    <ProfileCollection
                                        profiles={members}
                                        numberOfProfilesToHighlight={7}
                                        setVisibilityForAllProfiles={setMembersModalVisiblility}
                                    />

                                    {/* Badges and NFTs */}
                                    <Badge NFT={NFTBadge.GENESIS} customClasses="mt-16" />
                                    {/* <div className="flex mt-3">
                                        <InfoIcon
                                            tooltip="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                            side="left"
                                        />
                                        <p className="text-sm flex items-center text-gray-90 -ml-2">Learn more about NFT badges</p>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Photo Gallery Column (Right) */}
                        <div className="hidden md:block sticky mx-auto w-6/12 overflow-hidden md:max-h-artwork-140 lg:max-h-artwork-160 xl:max-h-artwork-176 2xl:max-h-artwork-200 3xl:max-h-artwork-232"
                            style={{top: "134px", height: "calc(100vh - 200px)"}}>
                            <PhotoGallery
                                photos = {photoGallery}
                                customClasses = ""
                            />
                        </div>
                    </div>

                    <Footer extraClasses="mt-32 sm:mt-60 mb-12" />
                </div>
            </div>
        </div>
    );
}

export default SocialProfileLayout;