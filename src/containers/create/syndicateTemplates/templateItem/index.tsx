import React, { useEffect, useState } from "react";
import Link from "next/link";
import slugify from "slugify";

interface ItemplateItem {
  title: string;
  subTitle: string;
  summary: string[];
}

const TemplateItem: React.FC<ItemplateItem> = ({
  title,
  subTitle,
  summary,
}) => {
  const [templateType, setTemplateType] = useState("");
  useEffect(() => {
    setTemplateType(slugify(title,{lower: true}));
  }, [title]);

  return (
    <Link href={`/syndicates/create/template?step=confirm-${templateType}-values`}>
      <a className="flex flex-col items-start justify-start font-whyte border border-gray-inactive rounded-md hover:border-blue h-80 p-6">
        <p className="text-1.5xl mb-2">{title}</p>
        <p className="text-sm text-gray-3 mb-4 font-whyte-light font-bold">
          {subTitle}
        </p>
        <ul className="list-disc text-sm list-inside py-1">
          {summary.map((setting, index) => {
            return (
              <li className="pb-1" key={index}>
                {setting}
              </li>
            );
          })}
        </ul>
      </a>
    </Link>
  );
};

export default TemplateItem;
