import { useState } from "react";

const ModuleTabs = (props: {
    title: string,
    children,
    customClassesForTabBar?: string
}) => {
    const {title, children, customClassesForTabBar = ""} = props;

    const [activeTab, setActiveTab] = useState(children[children.length - 1].props.title)
    const [activeContent, setActiveContent] = useState(children[children.length - 1].props.children)

    const renderedTabs = children.map((tab) => {
        return(
            <button 
                key={tab.props.title}
                className={`${activeTab === tab.props.title ? "border-b" : ""} mr-8 sm:mr-12 font-whyte`}
                onClick={() => {
                    setActiveTab(tab.props.title);
                    setActiveContent(tab.props.children);
                }}>
                {tab.props.title}
            </button>
        );
    })

    return (
        <div>
            {/* Tabs */}
            <div className={`flex ${customClassesForTabBar} no-scroll-bar`}>
                <h1 className="mr-16 sm:mr-24 tagline text-gray-400 whitespace-nowrap relative top-1 hidden sm:block">{title}</h1>
                <div className="flex">
                    {renderedTabs}
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-16 sm:mt-24">
                {activeContent}
            </div>
        </div>
    );
  };
  
export default ModuleTabs;
