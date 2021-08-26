import { useState } from "react";

const Accordion = (props: {children}) => {
    const {children} = props;

    const [activeSectionIndex, setActiveSection] = useState(0)

    const numberOfSections = children.length
    const expanded = "h-auto opacity-80"
    const collapsed = "h-0 opacity-0"
    
    const renderedSections = children.map((section, sectionIndex) => {
        const currentSectionIsActive = activeSectionIndex === sectionIndex
        const isEndSection = sectionIndex === numberOfSections - 1

        return(
            <button
                key={section.props.title}
                className={`transition w-full flex justify-between ${currentSectionIsActive ? "" : "items-center"} text-left ${isEndSection ? "" : "border-b border-gray-5"} focus:outline-none`}
                onClick={() => {
                    if (!currentSectionIsActive) {setActiveSection(sectionIndex)}
                    else {setActiveSection(-1)}
                }}>

                {/* Title */}
                <div>
                    <h1 className={`${currentSectionIsActive ? "mb-3 mt-6" : "my-6"}`}>
                        {section.props.title}
                    </h1>
                    <div className={`${currentSectionIsActive ? expanded + " mb-6" : collapsed + " mb-0"} overflow-hidden transition-all text-gray-300`}>
                        {section.props.children}
                    </div>
                </div>

                {/* Chevron Icon */}
                <div className={`${currentSectionIsActive ? "mt-6" : ""} w-6 h-full ml-4 flex-shrink-0`}>
                    <img className="mx-auto" src={`/images/chevron-${currentSectionIsActive ? "up" : "down"}.svg`} /> {/* TODO: fix icon */}
                </div>
            </button>
        );
    })

    return (
        <div className="sm:w-7/12 lg:ml-16 lg:mr-24 font-whyte-light">
            {renderedSections}
        </div>
    );
  };
  
  export default Accordion;
