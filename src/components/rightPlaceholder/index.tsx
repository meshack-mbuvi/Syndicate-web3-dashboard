import { ContentTitle } from "@/containers/create/shared";
import React from "react";

interface IProps {
  title: string;
  body: string[];
  link?: string;
}

const RightPlaceHolder: React.FC<IProps> = ({ title, body, link }) => {
  return (
    <div className="p-3">
      <ContentTitle>{title}</ContentTitle>
      <div className="font-whyte text-gray-3 leading-6">
        {body.map((item, index) => (
          <p key={index} className="mb-4">
            {item}
          </p>
        ))}
      </div>
      {link && (
        <div className="mt-5 text-blue">
          <a href={link}>Learn More</a>
        </div>
      )}
    </div>
  );
};

export default RightPlaceHolder;
