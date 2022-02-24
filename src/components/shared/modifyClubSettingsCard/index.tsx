import { useDemoMode } from "@/hooks/useDemoMode";
import React from "react";
import { useRouter } from "next/router";

const ModifyClubSettingsCard: React.FC = () => {
  const isDemoMode = useDemoMode();

  const router = useRouter();
  const { clubAddress } = router.query;
  return (
    <a
      href={isDemoMode ? undefined : `/clubs/${clubAddress}/modify`}
    >
      <div className="rounded-t-2xl space-x-4 flex items-stretch">
        <div className="flex-shrink-0">
          <img src="/images/SettingsIcon.svg" className="mt-1" alt="settings" />
        </div>
        <div className="space-y-1">
          <p className="text-base leading-6">
            Modify settings
          </p>
        </div>
      </div>
    </a>
  );
};

export default ModifyClubSettingsCard;