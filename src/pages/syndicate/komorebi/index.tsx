import SocialProfileLayout from "@/containers/socialProfileLayout";
import syndicateDAOs from '@/syndicateDAOs.json';


var members;
var leads;
var links;
var photoGallery;
var actionButtons;
var socialImage;
syndicateDAOs.forEach((syndicateDAO) => {
    if (syndicateDAO.name === "Komorebi Collective") {
        members = syndicateDAO.members
        leads = syndicateDAO.leads
        links = syndicateDAO.links
        photoGallery = syndicateDAO.photoGallery
        actionButtons = syndicateDAO.actionButtons
        socialImage = syndicateDAO.socialImage
    }
})

const KomorebiPage = () => {
  return (
    <SocialProfileLayout 
      pageTitle="Komorebi Collective"
      syndicateName="Komorebi Collective"
      customActionButtons={actionButtons}
      links={links}
      leads={leads}
      members={members}
      photoGallery={photoGallery}
      socialImage={socialImage}
    >
        <h3 className="text-lg mb-1 font-whyte">Our thesis</h3>
        <p className="mb-3 text-gray-300 opacity-80 font-whyte-light">At Komorebi, we believe crypto will be the backbone of our global economies, cultures, and digital interactions. We want to make this future a reality by investing in exceptional female and non-binary founders who represent the vast audience this technology aims to serve.</p>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">Komorebi is a poetic, almost untranslatable, Japanese expression that narrates sunlight filtering through the trees. These rays of light illuminate the forest undergrowth which are otherwise difficult to see. Inspired by this sentiment, we aim to illuminate and elevate a group of otherwise underestimated visionary founders building in crypto.</p>
        <h3 className="text-lg mb-1 font-whyte">Our strategy</h3>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">We’ve been participating in the crypto ecosystem as builders, investors and community shepherds. We’re proud to take the next step in ensuring a more diverse future of crypto builders and beneficiaries around the world. By leveraging all of our expertise and networks, we hope to find the best founders and give them the resources they need to succeed.</p>
        <h3 className="text-lg mb-1 font-whyte">Who we are</h3>
        <p className="mb-3 text-gray-300 font-whyte-light"><span className="opacity-80">Our core operating team consists of members from </span><a href="http://she256.org/" className="underline" target="_blank">she256</a><span className="opacity-80">, a 501c3 nonprofit dedicated to increasing diversity and breaking down barriers to entry in the blockchain space, as well as </span><a href="https://blockchaingirls.org/" className="underline" target="_blank">Women in Blockchain</a><span className="opacity-80"> an organization focused on increasing diversity through education and community building.</span></p>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">The rest of our members and backers are deeply involved in the crypto space and represent numerous investment funds, projects, communities and more. Though we represent a huge range of verticals in the space, we share one core value: a desire to change the state of diversity in the space. </p>
    </SocialProfileLayout>
  );
};

export default KomorebiPage;
