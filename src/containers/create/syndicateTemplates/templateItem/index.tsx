import React, { useEffect, useState } from "react";
import Link from "next/link";
import slugify from "slugify";

interface ItemplateItem {
  title: string;
  subTitle: string;
  summary: string[];
  disabled?: boolean;
}

const TemplateItem: React.FC<ItemplateItem> = ({
  title,
  subTitle,
  summary,
  disabled = false,
}) => {
  const [templateType, setTemplateType] = useState("");
  useEffect(() => {
    setTemplateType(slugify(title, { lower: true }));
  }, [title]);

  const templateContent = (
    <a
      className={`flex flex-col items-start justify-start font-whyte border border-gray-inactive rounded-md ${
        !disabled && "hover:border-blue mb-6"
      } h-full p-6 ${disabled && "opacity-50 cursor-default"}`}
    >
      <p className="text-1.5xl mb-2">{title}</p>
      <p className="text-sm text-gray-3 mb-4 font-whyte-light font-bold">
        {subTitle}
      </p>
      <ul className="flex flex-col list-disc text-sm list-inside pt-1 h-full justify-end">
        {summary.map((setting, index) => {
          return (
            <li className="pb-1" key={index}>
              {setting}
            </li>
          );
        })}
      </ul>
    </a>
  );
  let templateBox;
  if (!disabled) {
    templateBox = (
      <Link
        href={`/syndicates/create/template?step=confirm-${templateType}-values`}
      >
        {templateContent}
      </Link>
    );
  } else if (disabled) {
    templateBox = (
      <>
        {templateContent}
        <p className="mt-2 text-xs text-center text-gray-spindle w-full">
          Coming soon
        </p>
      </>
    );
  }

  return templateBox;
};

export default TemplateItem;
