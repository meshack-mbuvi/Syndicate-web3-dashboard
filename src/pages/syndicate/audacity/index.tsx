import SocialProfileLayout from "@/containers/socialProfileLayout";
import syndicateDAOs from '@/syndicateDAOs.json';


var members;
var leads;
var links;
var photoGallery;
var socialImage;
syndicateDAOs.forEach((syndicateDAO) => {
    if (syndicateDAO.name === "Audacity Fund") {
        members = syndicateDAO.members
        leads = syndicateDAO.leads
        links = syndicateDAO.links
        photoGallery = syndicateDAO.photoGallery
        socialImage = syndicateDAO.socialImage
    }
})

const AudacityPage = () => {
  return (
    <SocialProfileLayout 
      pageTitle="Audacity Fund: Investing in the Next 💯 Years"
      syndicateName="Audacity Fund"
      links={links}
      leads={leads}
      members={members}
      photoGallery={photoGallery}
      socialImage={socialImage}
    >
        <h3 className="text-lg mb-1 font-whyte">Our thesis</h3>
        <p className="mb-3 text-gray-300 opacity-80 font-whyte-light">Culture is the Future of Money and Asset Management. Culturally dynamic crypto technology:</p>
        <ol className="list-decimal mb-3 text-gray-300 opacity-80 pl-8 font-whyte-light">
            <li className="mb-2">Unlocks multi $T markets in overlooked regions and industries (i.e. remittances).</li>
            <li className="mb-2">Builds global first solutions for unbanked and underserved markets (i.e. CELO).</li>
            <li className="mb-2">Scales crypto and Web 3.0 to the next 100M people, founders, and investors (i.e. NFTs).</li>
            <li className="mb-2">Drives wealth and ownership for the global majority (i.e. DeFi).</li>
        </ol>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">We believe community is a dangerous advantage for arbitrage and that emerging Markets and DeFi (including but not limited to DAOs, NFTs, and social tokens) will transform the next 💯years.</p> 
        <h3 className="text-lg mb-1 font-whyte">Our strategy</h3>
        <p className="mb-3 text-gray-300 opacity-80 font-whyte-light">Audacity Fund invests capital, networks, and skills into early stage teams building viral, global-first, crypto startups. We plan to make 1-3 investments per quarter via equity, pre-sale/private tokens, and discounted public tokens. We’ll invest $10-$100,000 on average into: Black/African led crypto startups building global first decentralized finance (DeFi) for the next 100 million crypto users OR Established crypto startups expanding into emerging/overlooked markets that need cultural access to successfully scale far and wide globally.</p>
        <p className="mb-6 text-gray-300 font-whyte-light"><span className="opacity-80">Our core value proposition to founders is access to our proprietary network of globally competitive blockchain developer talent, culturally dynamic and multigenerational </span><a href="http://welcomekin.com/" className="underline" target="_blank">community building and marketing strategy</a><span className="opacity-80"> for scale, and an expert network of over </span><a href="http://cbee.xyz/" className="underline" target="_blank">150 crypto/blockchain experts</a><span className="opacity-80"> across <i>20</i> countries and <i>6</i> continents. We’ll source deals from our proprietary platforms including the </span><a href="https://www.cbee.xyz/" className="underline" target="_blank">Crypto for Black Economic Empowerment</a><span className="opacity-80"> (CBEE) community & </span><a href="https://www.facebook.com/watch/?v=10156104403003066" className="underline" target="_blank">KIN</a><span className="opacity-80"> - an African owned crypto venture studio with reach across </span><a href="https://www.facebook.com/watch/?v=1401175749972545" className="underline" target="_blank">4 million people globally</a><span className="opacity-80">. We’ll also source from pitch competitions, hackathons, and our broader networks.</span></p>
        <h3 className="text-lg mb-1 font-whyte">Who we are</h3>
        <p className="mb-6 text-gray-300 opacity-80 font-whyte-light">We’re a group of founders, executives, artists, and outliers investing in the future we want to see. We believe community is our greatest asset and nothing moves without culture. We’re leveraging our collective economic power to invest in crypto founders unlocking multi $T markets worldwide.</p>
    </SocialProfileLayout>
  );
};

export default AudacityPage;