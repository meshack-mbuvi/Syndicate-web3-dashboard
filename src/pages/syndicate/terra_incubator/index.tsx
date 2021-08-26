import SocialProfileLayout from "@/containers/socialProfileLayout";
import syndicateDAOs from '@/syndicateDAOs.json';


var members;
var leads;
var links;
var photoGallery;
var socialImage;
syndicateDAOs.forEach((syndicateDAO) => {
    if (syndicateDAO.name === "Terra Ecosystem Incubator") {
        members = syndicateDAO.members
        leads = syndicateDAO.leads
        links = syndicateDAO.links
        photoGallery = syndicateDAO.photoGallery
        socialImage = syndicateDAO.socialImage
    }
})

const TerraIncubatorPage = () => {
  return (
    <SocialProfileLayout 
      pageTitle="Terra Ecosystem Incubator"
      syndicateName="Terra Ecosystem Incubator"
      links={links}
      leads={leads}
      members={members}
      photoGallery={photoGallery}
      socialImage={socialImage}
    >
        <h3 className="text-lg mb-1 font-whyte">Our thesis</h3>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light" >DeFi isn’t rebuilding finance—it’s dismantling it.</p>
        <h3 className="text-lg mb-1 font-whyte">Our strategy</h3>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">We are creating a community-based incubation platform to bring new talent into the Terra ecosystem, create new projects, and launch them with the community every step along the way. The most promising teams from our “DeFi Connected” hackathon on May 5-7 will receive grants and be invited into a full 11-week residency with Delphi Labs and IDEO CoLab Ventures. At the end of the residency, we expect that one or more of the projects will be offered full incubation towards a community launch.</p>
        <h3 className="text-lg mb-1 font-whyte">Who we are</h3>
        <p className="text-gray-300 opacity-80 font-whyte-light">We are believers in an open and usable Defi ecosystem. We want to support the creation of best-in-class Defi experiences that connect the power of open crypto-powered financial networks to the next wave of crypto adopters.</p>
    </SocialProfileLayout>
  );
};

export default TerraIncubatorPage;