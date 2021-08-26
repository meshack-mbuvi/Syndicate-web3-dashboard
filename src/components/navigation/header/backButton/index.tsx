import Link from "next/link";

const FloatingBackButton = (props: {backPath: string}) => {
    const {backPath} = props

    return (
        <div className="w-0 z-30 relative -left-11 lg:-left-14 xl:-left-20 transition-all mt-40 lg:mt-40">
            <div className="sticky top-0 -left-20 cursor-pointer w-14 h-14 rounded-full py-4 lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20">
                <Link href={backPath}>
                <a>
                    <img
                        className="mx-auto relative "
                        style={{ left: "-2px" }}
                        src="/images/back-chevron-large.svg"/>
                </a>
                </Link>
            </div>
        </div>
    );
  };
  
  export default FloatingBackButton;
  