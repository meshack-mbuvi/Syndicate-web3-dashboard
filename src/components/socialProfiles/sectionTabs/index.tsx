import React, { useEffect, useState } from "react";

const SectionTabs = (props: {
    title: string,
    titleOnClick: () => void,
    children,
    customClassesForTabBar?: string,
}) => {
    const {
        title, 
        titleOnClick,
        children, 
        customClassesForTabBar = "", 
    } = props;

    const [activeTab, setActiveTab] = useState(0)
    const [scrollTop, setScrollTop] = useState(0)
    var sectionRefs = []

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' }) // smooth scrolling doesn't work on Safari
    }

    const getScrollPosition = (ref) => {
        return ref.current.getBoundingClientRect().top + scrollTop
    }

    // Listen to page scrolling
    useEffect(() => {
        const onScroll = e => {
            setScrollTop(e.target.documentElement.scrollTop);
        };
        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Show tab underline under current section
    useEffect(() => {
        sectionRefs.forEach((sectionRef, index) => {
            if (scrollTop + 1 > getScrollPosition(sectionRef)) {
                setActiveTab(index)
            }
        });
    }, [scrollTop]);

    // Render tab buttons
    const renderedTabs = children.map((tab, index) => {
        sectionRefs.push(tab.props.assignedRef)
        return(
            <button 
                key={tab.props.title}
                className={`${index === activeTab ? "text-white" : "text-gray-400 opacity-80"} text-sm uppercase tracking-widest mr-8 sm:mr-12 font-whyte focus:outline-none active:outline-none hover:opacity-100 transition-all`}
                onClick={() => {
                    scrollToSection(tab.props.assignedRef)
                }}>
                {tab.props.title}
            </button>
        );
    })

    return (
        <React.Fragment>
            
            {/* Tab Bar */}
            <div
                className={`flex ${customClassesForTabBar} no-scroll-bar`}>
                <div className="flex w-full items-center container mx-auto">
                    <h1 
                        onClick={titleOnClick}
                        className={`${titleOnClick ? "cursor-pointer" : ""} mr-16 sm:mr-24 text-white whitespace-nowrap relative hidden sm:block max-w-25p truncate`}>
                        {title}
                    </h1>
                    <div className="flex">
                        {renderedTabs}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div>{children}</div>
        </React.Fragment>
    );
  };
  
export default SectionTabs;
