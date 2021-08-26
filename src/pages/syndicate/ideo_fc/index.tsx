import SocialProfileLayout from "@/containers/socialProfileLayout";
import syndicateDAOs from '@/syndicateDAOs.json';


var members;
var leads;
var links;
var photoGallery;
var socialImage;
syndicateDAOs.forEach((syndicateDAO) => {
    if (syndicateDAO.name === "IDEO Founder Collective") {
        members = syndicateDAO.members
        leads = syndicateDAO.leads
        links = syndicateDAO.links
        photoGallery = syndicateDAO.photoGallery
        socialImage = syndicateDAO.socialImage
    }
})

const IDEOFCPage = () => {
  return (
    <SocialProfileLayout 
      pageTitle="IDEO Founder Collective"
      syndicateName="IDEO Founder Collective"
      links={links}
      leads={leads}
      members={members}
      photoGallery={photoGallery}
      socialImage={socialImage}
    >
        <h3 className="text-lg mb-2 font-whyte">Our thesis</h3>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light" >We believe that the future of venture building will be collaborative—and that venture building networks and communities of founders, investors, and builders who share and have an ownership stake in each other’s mutual success will be the most successful in the long-run. We also deeply believe that the shared ownership model will be uniquely enabled by crypto.</p>
        <h3 className="text-lg mb-2 font-whyte">Our strategy</h3>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">We are a community of IDEO Founders who help each other—with code reviews, design feedback, hiring, and much more—and are committing an equal portion of our companies’ equity or tokens to one another, to support, invest, and share in each other’s mutual success. IDEO is also committing a commensurate portion of its venture funds to the IDEO Founder Collective. Future IDEO Founders will be offered the same opportunity to contribute to and join the IDEO Founder Collective.</p>
        <h3 className="text-lg mb-2 font-whyte">Who we are</h3>
        <p className="text-gray-300 opacity-80 font-whyte-light">We are a community of crypto founders backed by IDEO CoLab Ventures who believe in the power of shared ownership and want to support and invest in each other. We have founded DeFi protocols, web3 tools and infrastructure, and platforms that are reshaping the future of how people communicate, coordinate, work, and play globally.</p>
    </SocialProfileLayout>
  );
};

export default IDEOFCPage;
