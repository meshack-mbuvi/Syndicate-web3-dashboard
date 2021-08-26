import Link from "next/link";

const ProfilePicture = (props: {
    children?: any; 
    URL?: string, 
    avatar?: string,
    size?: string,
    customClasses?: string
    setRef?: () => void
}) => {
    const {
        children, 
        URL, 
        avatar, 
        size = "12",
        customClasses,
} = props;

    const styles = customClasses + " h-" + size + " w-" + size + " bg-gray-300 rounded-full bg-cover bg-center relative"
    
    if (URL) {
        return (
            <Link href={URL}>
                <a
                    className={styles}
                    style={{backgroundImage : `url('${avatar}')`}}
                    target="_blank">
                    {children}
                </a>
            </Link>
        );
    }
    else {
        return (
            <div
                className={styles}
                style={{backgroundImage : `url('${avatar}')`}}>
                {children}
            </div>
        );
    }
};
  
export default ProfilePicture;