import { ModifyClubSettings } from "@/components/modifyClub";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";

const Modify: React.FC = () => {
    return (
        <div className="relative container mx-auto pl-10">
            <LayoutWithSyndicateDetails managerSettingsOpen={true}></LayoutWithSyndicateDetails>
            <div className="container mx-auto left-0 grid grid-cols-12 gap-5">
                <div className="md:col-start-1 md:col-end-8 col-span-12 text-white pb-10">
                    <ModifyClubSettings isVisible={true} />
                </div>
            </div> 
        </div>
    );
};
  
export default Modify;