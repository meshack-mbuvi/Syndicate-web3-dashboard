import { ModifyClubSettings } from "@/components/modifyClub";

export default {
  title: "Molecules/Modify Club Settings/Settings Modal",
};

const Template = (args) =>
    <div className="grid grid-cols-12 gap-5">
        <div className="md:col-start-1 md:col-end-7 col-span-12 text-white">
            <ModifyClubSettings {...args}>Child</ ModifyClubSettings>
        </div>
    </div>

export const Default = Template.bind({});
Default.args = {
    isVisible: true,
    handleClose: () => {console.log("Closed")}
};