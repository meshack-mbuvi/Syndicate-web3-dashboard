import { FC } from "react";

import { SectionCard, SectionCardProps } from "./sectionCard";

/**
 * @param {} props
 * @returns
 */

interface Props {
  sections: SectionCardProps[];
  title?: string;
  customStyles: string;
  infoIcon?: boolean;
  customInnerWidth?: string;
  loadingLPDetails?: boolean;
}

export const DetailsCard: FC<Props> = (props) => {
  const {
    sections = [],
    title = "My Stats",
    customStyles = "",
    infoIcon,
    customInnerWidth = "",
  } = props;

  return (
    <div className={`h-fit-content ${customStyles}`}>
      <div className={`flex ${customInnerWidth} justify-between`}>
        <p className="fold-bold text-xl">{title !== "Details" ? title : ""}</p>
      </div>

      <div className={`${customInnerWidth}`}>
        {sections.map((section, index) => (
          <div
            className={`flex justify-start visibility-container target-l-12 relative`}
            key={index}
          >
            <div className="flex justify-between items-start sm:my-3 my-3 w-full">
              <SectionCard
                {...{ ...section }}
                infoIcon={infoIcon}
                title={title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
