import SocialProfileLayout from "@/containers/socialProfileLayout";
import syndicateDAOs from '@/syndicateDAOs.json';


var members;
var leads;
var leads;
var links;
var photoGallery;
var socialImage;
syndicateDAOs.forEach((syndicateDAO) => {
  if (syndicateDAO.name === "DELPHI INFINFT") {
      members = syndicateDAO.members
      leads = syndicateDAO.leads
      links = syndicateDAO.links
      photoGallery = syndicateDAO.photoGallery
      socialImage = syndicateDAO.socialImage
  }
})

const DelphiInfinftPage = () => {
  return (
    <SocialProfileLayout 
      pageTitle="DELPHI INFINFT"
      syndicateName="DELPHI INFINFT"
      links={links}
      leads={leads}
      members={members}
      photoGallery={photoGallery}
      socialImage={socialImage}
    >
      <p className="text-lg mb-1">Our thesis</p>
      <p className="mb-3 text-gray-300 opacity-80">
        NFT’s are changing digital ownership rights, as well as how creators are
        interacting with their communities. Along with the growth of the NFT
        space, there is supporting infrastructure that needs to be built
        alongside it. The goal of this fund is to find the protocols that are
        moving the NFT space forward and building the infrastructure that is
        needed.
      </p>
      <p className="mb-6 text-gray-300 opacity-80">
        We will find the best and brightest teams in the NFT space and help give
        them the resources they need to succeed in the ecosystem.
      </p>
      <p className="text-lg mb-1">Our strategy</p>
      <p className="mb-3 text-gray-300 opacity-80">
        We plan to deploy at least 80% of the fund’s capital in the first 6 - 9
        months as we find protocols that fit with our thesis.
      </p>
      <p className="mb-3 text-gray-300 opacity-80">
        We will identify and select leading NFT networks through our networks
        and communities. We’ll be working directly with the teams we invest in
        to help them become a core piece of the NFT ecosystem long-term.
      </p>
      <p className="mb-6 text-gray-300 opacity-80">
        INFINFT's team will strategically invest in protocols and use-cases
        which it will in-turn leverage to experiment and continue to push
        forward the NFT ecosystem.
      </p>
      <p className="text-lg mb-1">Who we are</p>
      <p className="text-gray-300 opacity-80">
        We are Delphi Digital in combination with gmoneyNFT.
      </p>
    </SocialProfileLayout>
  );
};

export default DelphiInfinftPage;
