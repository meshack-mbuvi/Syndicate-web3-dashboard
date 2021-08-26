import { SocialLinkSource } from "@/components/buttons";
import ProfilePicture from "@/components/socialProfiles/profilePicture";
import Link from "next/link";
import React from "react";
import { Modal, ModalStyle } from "src/components/modal";


export const ProfilesModal = (props: {
    title?: string,
    show: boolean,
    closeModal: () => void,
    loading?: boolean,
    profiles: {
        avatar: string,
        name: string, 
        bio?: string, 
        links?: {URL: string, source: SocialLinkSource}[]
    }[]
}) => {
const {
    title = "",
    show,
    closeModal,
    loading = false,
    profiles
} = props;

    const orderedProfiles = [...profiles].sort((a,b) => (a.name > b.name ? 1 : -1)) // alphabetically order by first name
    const rowStyles = "py-4 flex items-center w-full rounded-md"

    const renderedMembers = orderedProfiles.map((profile) => {
        const URL = profile.links ? profile.links[0].URL : null
        if (URL) {
            return (
                <Link href={URL}>
                    <a 
                        className={`${rowStyles} hover:bg-white hover:bg-opacity-10`} 
                        target="_blank"
                        key={profile.name}>
                        <ProfilePicture
                            avatar={profile.avatar}
                            customClasses="mr-4"/>
                        <p className="text-white">{profile.name}</p>
                    </a>
                </Link>         
            ); 
        }
        else {
            return (
                <div className={rowStyles} key={profile.name}>
                    <ProfilePicture
                        avatar={profile.avatar}
                        customClasses="mr-4"/>
                    <p className="text-white">{profile.name}</p>
                </div>         
            ); 
        }
    })

    return (
        <Modal  
            title={title}
            show={show}
            closeModal={closeModal}
            loading={loading}
            showCloseButton={true}
            type="normal"
            modalStyle={ModalStyle.DARK}
        >
                <div className="overflow-auto text-black border-t border-gray-24 w-full pt-2 border-opacity-50 h-96 -mb-6">
                    {renderedMembers}
                </div>
        </Modal>
    );
};
