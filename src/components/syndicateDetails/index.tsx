import React from "react";
import { ExternalLinkIcon } from "src/components/iconWrappers";
import { BadgeCard } from "./shared/BadgeCard";
import { DetailsCard } from "./shared/DetailsCard";
import { DistributionsGraph } from "./shared/DistributionsGraph";
import { InfoIcon } from "src/components/iconWrappers";
import { SectionCard } from "../syndicates/shared";

const SyndicateDetails = () => {
  const details = [
    { header: "Created on", subText: "6/1/21", isEditable: false },
    { header: "Close Date", subText: "6/1/21", isEditable: false },
    {
      header: "Deposit/Distribution Token",
      subText: "USDC / USDC",
      isEditable: false,
    },
    {
      header: "Expected Annual Operating Fees",
      subText: "2%",
      isEditable: true,
    },
    {
      header: "Profit Share to Syndicate Lead",
      subText: "20%",
      isEditable: true,
    },
    {
      header: "Profit Share to Protocol",
      subText: "0.3%",
      isEditable: false,
    },
  ];

  const depositsAndDistributionsSections = [
    { header: "Total Deposits", subText: "0 USDC (0 depositors)" },
    { header: "Total Distributions", subText: "0 USDC" },
    { header: "Total Withdrawn", subText: "0 USDC" },
    {
      header: "Profit Share to Syndicate Leads",
      subText: "1",
    },
  ];
  return (
    <div className="w-full sm:w-2/3 h-fit-content p-12 rounded-md bg-gray-9">
      <span className="font-bold text-gray-dim leading-loose tracking-widest text-sm uppercase">
        Syndicate
      </span>
      <div className="flex items-center">
        <p className="text-xl mr-4">0x3f6q9z52…54h2kjh51h5zfa</p>
        <svg
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-8"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.9095 7.4302C14.9697 7.58819 15.0005 7.75766 15 7.92873V14.6975C14.9997 15.0428 14.8735 15.374 14.6493 15.6181C14.425 15.8623 14.1209 15.9996 13.8037 16H8.19605C7.87897 15.9995 7.57499 15.8623 7.35078 15.6181C7.12656 15.3741 7.00041 15.0432 7 14.698V13.3777C7 13.2157 7.05915 13.0602 7.16443 12.9456C7.26972 12.831 7.41252 12.7666 7.56142 12.7666C7.71032 12.7666 7.85312 12.831 7.9584 12.9456C8.06369 13.0602 8.12284 13.2157 8.12284 13.3777V14.698L13.8044 14.7781L13.8718 8.48689H11.5887C11.4398 8.48689 11.297 8.4225 11.1917 8.30787C11.0865 8.19325 11.0273 8.03779 11.0273 7.87568V5.22242H10.6928C10.5439 5.22242 10.4011 5.15803 10.2958 5.0434C10.1905 4.92877 10.1314 4.77332 10.1314 4.61121C10.1314 4.44911 10.1905 4.29365 10.2958 4.17902C10.4011 4.0644 10.5439 4.00001 10.6928 4.00001H11.3572C11.5244 3.99945 11.69 4.03491 11.8445 4.10436C11.999 4.17381 12.1393 4.27585 12.2575 4.40463L14.6491 7.00837C14.7607 7.12881 14.8492 7.27219 14.9095 7.4302ZM12.1502 6.02506V7.26447H13.2744L12.1502 6.02506Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 1.20651V10.7934C0 11.1134 0.126091 11.4203 0.350536 11.6466C0.57498 11.8729 0.879392 12 1.1968 12H7.80316C8.12058 12 8.42498 11.8729 8.64943 11.6466C8.87388 11.4203 9 11.1134 9 10.7934V3.90354C9 3.74508 8.96902 3.58816 8.90884 3.44176C8.84867 3.29536 8.76047 3.16234 8.64931 3.0503L5.97373 0.353266C5.74927 0.127045 5.44487 -2.7651e-05 5.12747 4.51316e-09H1.1968C0.879392 4.51316e-09 0.57498 0.127114 0.350536 0.353379C0.126091 0.579644 0 0.886525 0 1.20651ZM5.72599 1.80977L7.20476 3.30042H5.72599V1.80977ZM4.52919 3.90367V1.20651H1.1968V10.7934H7.80316V4.50693H5.12759C4.96889 4.50693 4.81668 4.44337 4.70445 4.33023C4.59223 4.21711 4.52919 4.06366 4.52919 3.90367Z"
            fill="white"
          />
        </svg>
        <div className="h-12 w-12 violet-red rounded-full	"></div>
      </div>
      <a
        href={`https://etherscan.io/address/`}
        target="_blank"
        className="text-blue-cyan  flex"
      >
        View on etherscan <ExternalLinkIcon className="ml-2" />
      </a>

      <BadgeCard
        {...{
          title: "Status",
          subTitle: "Open to Deposits",
          text: "Deposits can be made into this Syndicate",
          icon: (
            <span className="rounded-full mt-2 w-4 h-4 ml-1 bg-green-500"></span>
          ),
          isEditable: true,
        }}
      />

      <BadgeCard
        {...{
          title: "Badges (NFTs)",
          subTitle: "Alpha",
          text: "Among the first syndicates on Syndicate",
          icon: (
            <span className="mt-2 ml-1">
              <img src="/images/blueIcon.svg" />
            </span>
          ),
          isEditable: false,
        }}
      />

      <div className="border-b border-gray-49 pb-12">
        <DetailsCard {...{ title: "Details", sections: details }} />
      </div>

      <div className="flex pt-12">
        <div className="text-xl font-semibold w-1/2">
          Deposits & Distributions
        </div>
        <InfoIcon />
      </div>
      <div>
        <div className="ml-6 pt-12">
          <p className="leading-loose">Total Distributions / Deposits</p>
          <p className="text-2xl font-ibm text-green-400 text-sm leading-loose">
            200.0%
          </p>
        </div>
      </div>
      <DistributionsGraph customStyles={"px-4 sm:w-2/3 py-8 border-gray-49"} />

      <div className="grid grid-cols-3 gap-4 px-4 py-8 border-gray-49">
        {depositsAndDistributionsSections.map((sectionDetail, index) => {
          return (
            <div className="pl-4 w-full" key={index}>
              <SectionCard {...{ ...sectionDetail }} infoIcon={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyndicateDetails;
